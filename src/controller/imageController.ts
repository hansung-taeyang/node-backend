import sharp from "sharp";
import { CreateImageRequestBody, ImageStyle } from "../zod-schema/imageSchema";
import { NextFunction, type Request, type Response } from "express";
import fs from "fs/promises";
import crypto from "node:crypto";
import path from "path";
import logger from "../utils/logger";
import { db } from "../db/db";
import { StatusCodes } from "http-status-codes";

import { openai, type ImageParameter } from "../utils/openai";
import { images } from "../db/tables/images";
import { eq } from "drizzle-orm";
import { users } from "../db/tables/users";

/**
 * Generate an image prompt for DALL·E 3, based on users input
 * @param userPrompt A user's input to generate an image prompt
 * @param userStyle A style of illustration, one of `ImageStyle` type
 * @returns GPT-4 response for the image prompt
 */
const generateImagePrompt = async (userPrompt: string, userStyle: ImageStyle) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Your job is to write a prompt for DALL·E 3 based on the user's input. The user wants to generate a 2D illustration based on your prompt. The illustration will be used for the book's advertisement, which will be sent as an attachment of the book's advertisement message, or an email. The user will provide a genre and a plot of the book. Make sure the generated image doesn't include any texts, letters, or characters. The user wants ${userStyle} Style for the illustration. Please only include a prompt for the image in your response.`
      },
      {
        role: "user",
        content: userPrompt
      }
    ]
  });

  return completion.choices[0]?.message.content;
};

/**
 * Generate a file name from the buffer data
 * @param buffer a raw image buffer
 * @returns base64url encoded file name
 */
const generateFileNameFromBuffer = (buffer: Buffer): string => {
  return crypto.createHash("sha256").update(buffer).digest("base64url");
};

/**
 * Save the image as webp format
 * @param base64Image base64 image data from OpenAI
 * @returns name of the saved webp image
 */
const saveAsJpeg = async (base64Image: string): Promise<string> => {
  const imageBuffer = await sharp(Buffer.from(base64Image, "base64"))
    .jpeg({
      quality: 50
    })
    .toBuffer();

  const fileName = `${generateFileNameFromBuffer(imageBuffer)}.jpeg`;
  const IMAGE_BASE_PATH = path.join(process.cwd(), "public", "images");
  const fileUrl = path.join(IMAGE_BASE_PATH, fileName);

  await fs.writeFile(fileUrl, imageBuffer);
  logger.info(`Image created at ${fileUrl}`);

  return fileName;
};

export const createImage = async (req: Request, res: Response, next: NextFunction) => {
  const { prompt, style } = req.body as CreateImageRequestBody["body"];

  /*
  "장르: 장편소설, 추리/미스터리. 책 소개: 외딴 산장에 여덟 명의 남녀가 모인 가운데 한밤중 은행 강도범이 침입해 인질극을 벌인다. 인질들은 수차례 탈출을 시도하지만 번번이 실패하고, 강도범과 인질들 사이에 숨 막히는 줄다리기가 펼쳐지는 가운데 인질 한 명이 살해된 체 발견된다."
  */

  // 1단계: GPT에게 유저의 프롬프트를 전달해 DALLE에 넘길 프롬프트를 만들어달라고 한다.
  const generatedPrompt = await generateImagePrompt(prompt, style)
    .then(prompt => {
      // 생성된 프롬프트 확인
      logger.info("Prompt created!: %s", prompt);
      return prompt;
    });

  // DALLE에게 넘겨줄 요청 BODY
  const openaiRequestBody: ImageParameter = {
    prompt: generatedPrompt!,
    model: "dall-e-3",
    response_format: "b64_json"
  };

  try {
    // 2단계: DALLE에 프롬프트를 넘겨 이미지 생성
    const { data: [rawImage] } = await openai.images.generate(openaiRequestBody);

    if (rawImage === undefined || rawImage.b64_json === undefined) {
      throw new Error("No image data found from OpenAI");
    }

    // 이미지 webp로 저장
    const fileName = await saveAsJpeg(rawImage.b64_json);

    if (req.emailId !== undefined || req.emailId !== null) {
      await db.insert(images)
        .values({
          imageId: fileName,
          userEmailId: req.emailId
        });
    }

    // 모두 잘 됐으면 프론트에 200 코드와 함께 저장된 이미지의 서버 URL을 보냄
    res.status(StatusCodes.OK).json({
      url: `/images/${fileName}`
    });
  } catch (error) {
    next(error);
  }
};

export const getAllImage = async (req: Request, res: Response, next: NextFunction) => {
  const emailId = req.emailId;
  try {
    // emailId 를 가지는 유저 레코드와 연관된 이미지들(일대다 관계) 중에서
    // 이미지들을 {생성일자, 파일이름} 필드만 뽑아서 리턴함.
    const result = await db.query.users.findFirst({
      where: eq(users.emailId, emailId),
      with: {
        createdImages: {
          columns: {
            createdAt: true,
            imageId: true,
            id: false,
            userEmailId: false
          },
          orderBy: (createdImages, { desc }) => [desc(createdImages.createdAt)],
        }
      },
    });
    const userImages = result?.createdImages;
    return res.status(StatusCodes.OK).json([...userImages!]);
  } catch (error) {
    next(error);
  }
};