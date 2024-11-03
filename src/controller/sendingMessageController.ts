import { Request, Response } from "express";
import initializeToken from "../auth/auth";
import fsPromises from "fs/promises";
import path from "path";
import sharp from "sharp";
import logger from "../utils/logger";

interface FileData {
  name: string;
  size: number;
  data: string;
}

interface ApiErrorResponse {
  code: number;
  description: string;
}

interface MessageData {
  account: string;
  messageType: string;
  content: string;
  from: string;
  duplicateFlag: string;
  targetCount: number;
  targets: string[];
  refKey: string;
  subject: string;
  files: FileData[];
}

export class SendingMessageController {
  private static API_URL = "https://message.ppurio.com/v1/message";
  private static authData: string | null = null;
  private static authTokenExpireTime: number | null = null;
  private static readonly ACCOUNT_ID = "2071448";
  private static readonly SENDER_NUMBER = "01099214086";

  private static async initializeAuth(): Promise<void> {
    const now = Date.now();
    if (
      !SendingMessageController.authData ||
      now >= SendingMessageController.authTokenExpireTime!
    ) {
      const authData = await initializeToken();
      if (!authData || !authData.token) {
        throw new Error("인증 토큰을 가져올 수 없습니다.");
      }
      SendingMessageController.authData = authData.token;
      SendingMessageController.authTokenExpireTime = now + 3600000; 
    }
  }
  
  public static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      await SendingMessageController.initializeAuth();

      const { content, targetCount, targets, subject, imageUrl } = req.body;
      if (!content || !targetCount || !Array.isArray(targets) || !subject || !imageUrl) {
        res.status(400).json({
          message:
            "잘못된 요청 형식입니다. content, targetCount, targets, imageUrl는 필수 항목입니다.",
        });
        return;
      }

      const fileDataArray = await convertImageToJpgAndBase64(imageUrl);

      const data: MessageData = {
        account: SendingMessageController.ACCOUNT_ID,
        messageType: "MMS",
        content,
        from: SendingMessageController.SENDER_NUMBER,
        duplicateFlag: "N",
        targetCount,
        targets,
        refKey: "swpc-team-sun",
        subject,
        files: fileDataArray,
      };

      const headers = {
        Authorization: `Bearer ${SendingMessageController.authData}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(SendingMessageController.API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        logger.info("Response Status: {}", response.status);

        let errorData: ApiErrorResponse;
        try {
          errorData = (await response.json()) as ApiErrorResponse;
        } catch {
          errorData = {
            code: 5000,
            description: "서버에서 오류가 발생했습니다.",
          };
        }

        throw new Error(
          `메시지 전송 실패: ${errorData.description} (코드: ${errorData.code})`,
        );
      }

      const responseData = await response.json();
      res.status(response.status).json({
        message: "Message sent successfully",
        data: responseData,
      });
    } catch (error) {
      logger.error("Error sending message:", error);
      res.status(500).json({
        message: "Failed to send message",
        error: (error as Error).message,
      });
    }
  }
}

async function convertImageToJpgAndBase64(
  imageUrl: string,
): Promise<FileData[]> {
  const imagePath = path.join(__dirname, "..", "..", "public", imageUrl);
  logger.info(imagePath);
  try {
    await fsPromises.access(imagePath);
  } catch {
    throw new Error(`입력 파일이 존재하지 않습니다: ${imagePath}`);
  }

  const jpgPath = imagePath.replace(/\.webp$/, ".jpg");

  await sharp(imagePath)
    .resize({ width: 400, height: 400 })
    .jpeg({ quality: 100 })
    .toFile(jpgPath);

  try {
    await fsPromises.access(jpgPath);
  } catch {
    throw new Error(`변환된 JPG 파일이 존재하지 않습니다: ${jpgPath}`);
  }

  const imageData = await fsPromises.readFile(jpgPath);
  const base64Data = imageData.toString("base64");

  return [
    {
      name: path.basename(jpgPath),
      size: imageData.length,
      data: base64Data,
    },
  ];
}

export default SendingMessageController;
