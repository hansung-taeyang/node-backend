import OpenAI from "openai";
import sharp from "sharp";
import { CreateImageRequestBody } from "../zod-schema/imageSchema";
import config from "../utils/config";
import { NextFunction, type Request, type Response } from "express";
import fs from "fs/promises";
import crypto from "node:crypto";
import path from "path";
import logger from "../utils/logger";

const openai = new OpenAI({
  apiKey: config.OPEN_API_KEY
});

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
  logger.info(`Image created at ${fileUrl}`);

  return fileName;
};

const createImageController = async (req: Request, res: Response, next: NextFunction) => {
  const { prompt, style } = req.body as CreateImageRequestBody["body"];

  const openaiRequestBody: OpenAI.Images.ImageGenerateParams = {
    prompt: prompt,
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

    res.status(200).json({ url: `http://localhost:3000/images/${fileName}` });
  } catch (error) {
    next(error);
  }
};

export default createImageController;