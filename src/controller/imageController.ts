import sharp from "sharp";
import { CreateImageRequestBody } from "../zod-schema/imageSchema";
import { NextFunction, type Request, type Response } from "express";
import fs from "fs/promises";
import crypto from "node:crypto";
import path from "path";
import logger from "../utils/logger";
import { db } from "../db/db";
import { StatusCodes } from "http-status-codes";

import { openai, type ImageParameter } from "../utils/openai";
import { images } from "../db/tables/images";

/**
 * Generate an image prompt for DALL·E 3, based on users input
 * @param userPrompt A user's input to generate an image prompt
 * @returns GPT-4 response for the image prompt
 */
const generateImagePrompt = async (userPrompt: string) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Your job is to write a prompt for DALL·E 3 based on the user's input. The user wants to generate a 2D illustration based on your prompt. The illustration will be used for the book's advertisement, which will be sent as an attachment of the book's advertisement message, or an email. The user will provide a genre and a plot of the book. Make sure the generated image doesn't include any texts, letters, or characters. The user wants Watercolor Style for the illustration."
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
const saveAsWebp = async (base64Image: string): Promise<string> => {
  const imageBuffer = await sharp(Buffer.from(base64Image, "base64"))
    .webp({ quality: 50 })
    .toBuffer();

  const fileName = `${generateFileNameFromBuffer(imageBuffer)}.webp`;
  const IMAGE_BASE_PATH = path.join(__dirname, "../..", "public", "images");
  const fileUrl = path.join(IMAGE_BASE_PATH, fileName);

  await fs.writeFile(fileUrl, imageBuffer);
  await db.insert(images).values({ imageId: fileName });
  
  logger.info(`Image created at ${fileUrl}`);

  return fileName;
};

export const createImage = async (req: Request, res: Response, next: NextFunction) => {
  const { prompt, style } = req.body as CreateImageRequestBody["body"];

    /*
    "장르: 장편소설, 추리/미스터리. 책 소개: 외딴 산장에 여덟 명의 남녀가 모인 가운데 한밤중 은행 강도범이 침입해 인질극을 벌인다. 인질들은 수차례 탈출을 시도하지만 번번이 실패하고, 강도범과 인질들 사이에 숨 막히는 줄다리기가 펼쳐지는 가운데 인질 한 명이 살해된 체 발견된다."
    */

  const generatedPrompt = await generateImagePrompt(prompt)
    .then(prompt => {
      logger.info("Prompt created!");
      logger.info(prompt);
      return prompt;
    });

  const openaiRequestBody: ImageParameter = {
    prompt: generatedPrompt!,
    style: style,
    model: "dall-e-3",
    response_format: "b64_json"
  };

  try {
    const { data: [rawImage] } = await openai.images.generate(openaiRequestBody);
    if (rawImage === undefined || rawImage.b64_json === undefined) {
      throw new Error("No image data found");
    }

    const fileName = await saveAsWebp(rawImage.b64_json);

    res.status(StatusCodes.OK).json({
      url: `http://localhost:3000/images/${fileName}`,
      revised_prompt: rawImage.revised_prompt
    });
  } catch (error) {
    next(error);
  }
};