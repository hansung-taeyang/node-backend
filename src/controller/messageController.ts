import { NextFunction, Request, Response } from "express";
import fsPromises from "fs/promises";
import path from "path";
import sharp from "sharp";
import logger from "../utils/logger";
import { StatusCodes } from "http-status-codes";
import config from "../utils/config";
import { MessageRequestBody } from "../zod-schema/messageSchema";
import { db } from "../db/db";
import { eq } from "drizzle-orm";
import { messages } from "../db/tables/messages";

interface FileData {
  name: string;
  size: number;
  data: string;
}

interface ApiErrorResponse {
  code: number;
  description: string;
}

type PpurioMessageBody = {
  account: string;
  messageType: string;
  from: string;
  duplicateFlag: string;
  refKey: string;
  files: FileData[];
} & Omit<MessageRequestBody["body"], "imageUrl">;

interface Auth {
  token: string;
  type: string;
  expired: string;
}

export class MessageController {
  private API_URL = "https://message.ppurio.com/v1/message";
  private authData: string | null = null;
  private authTokenExpireTime: number | null = null;

  private initializePpurioToken = async (): Promise<Auth | undefined> => {
    try {
      const response = await fetch("https://message.ppurio.com/v1/token", {
        headers: {
          "Authorization": `Basic ${config.PPURIO_AUTH_KEY_BASE64}`,
        },
        method: "post",
      });
      const data = await response.json() as Auth;
      return data;
    } catch (error) {
      throw new Error(`Failed to initialize ppurio token: ${error}`);
    }
  }

  private initializeAuth = async (): Promise<void> => {
    const now = Date.now();
    if (!this.authData || now >= this.authTokenExpireTime!) {
      try {
        const authData = await this.initializePpurioToken();
        if (!authData || !authData.token) {
          throw new Error("인증 토큰을 가져올 수 없습니다.");
        }
        this.authData = authData.token;
        this.authTokenExpireTime = now + 3600000;
      } catch (error) {
        throw new Error(`Failed to initialize ppurio auth: ${error}`);
      }
    }
  }

  private loadImageToBase64 = async (imageUrl: string): Promise<FileData[]> => {
    const PROJECT_ROOT = process.cwd();
    const imagePath = path.join(PROJECT_ROOT, "public", imageUrl);
    try {
      await fsPromises.access(imagePath);
    } catch {
      throw new Error(`입력 파일이 존재하지 않습니다: ${imagePath}`);
    }

    const { data, info } = await sharp(imagePath)
      .resize({ width: 400, height: 400 })
      .toBuffer({ resolveWithObject: true });

    const base64Data = data.toString("base64");

    return [
      {
        name: path.basename(imagePath),
        size: info.size,
        data: base64Data,
      },
    ];
  }

  public sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.initializeAuth();

      const { content, targetCount, targets, imageUrl } = req.body as MessageRequestBody["body"];

      const fileDataArray = await this.loadImageToBase64(imageUrl);

      // 프론트에서 보내는 사람 번호를 보냈다고 가정. .env에 저장된 번호를 사용.
      const data: PpurioMessageBody = {
        account: config.PPURIO_ACCOUNT_ID,
        messageType: "MMS",
        content,
        from: `${config.PPURIO_SENDER_NUMBER}`,
        duplicateFlag: "N",
        targetCount,
        targets,
        refKey: "swpc-team-sun",
        files: fileDataArray,
      };


      const headers = {
        Authorization: `Bearer ${this.authData}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(this.API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        logger.error("Send Message response status: %d", response.status);

        const data = await response.json() as ApiErrorResponse;
        throw new Error(
          `메시지 전송 실패: ${data.description} (코드: ${data.code})`,
        );
      }

      // imageUrl: /images/sample.jpeg
      const imageId = imageUrl.split("/")[2];

      await db.insert(messages).values({
        userEmailId: req.emailId,
        imageId: imageId!,
        messageJson: {
          content,
          targetCount,
        },
      });

      const responseData = await response.json();
      res.status(response.status).json({
        message: "Message sent successfully",
        data: responseData,
      });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      next(err);
    }
  }

  public getMessages = async (req: Request, res: Response, next: NextFunction) => {
    if (req.emailId === null || req.emailId === undefined) {
      return;
    }

    const result = await db.query.messages.findMany({
      where: eq(messages.userEmailId, req.emailId),
    });

    logger.info("Messages: %o", result);

    res.status(StatusCodes.OK).json({
      messages: result.map(({ imageId, messageJson, sentAt, id }) => ({
        id: id,
        image: `/images/${imageId}`,
        messageJson: messageJson,
        sentAt: sentAt
      }))
    });
  }

  public getMessagesWithoutLogin = async (req: Request, res: Response, next: NextFunction) => {
    const result = await db.query.messages.findMany({
      where: eq(messages.userEmailId, "foo@bar.com")
    });

    res.status(StatusCodes.OK).json({
      messages: result.map(({ imageId, messageJson, sentAt, id }) => ({
        id: id,
        image: `/images/${imageId}`,
        messageJson: messageJson,
        sentAt: sentAt
      }))
    });
  }

  public deleteMessage = async (req: Request, res: Response, next: NextFunction) => {

    const messageId = parseInt(req.params["messageId"]!.toString());
    if (isNaN(messageId)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Message ID must be a number"
      });
      return;
    }

    try {
      await db.delete(messages).where(eq(messages.id, messageId));
      res.status(StatusCodes.NO_CONTENT).json({
        message: "Message deleted successfully"
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      next(error);
    }

  }
}

export default MessageController;
