import { z } from "zod";

// 프론트에서 넘겨줄 필드 중 하나: 생성될 이미지의 스타일
const imageEnum = z.enum([
  "minimalist",
  "flat design",
  "watercolor",
  "vintage",
  "abstract",
  "line art"
]);

export type ImageStyle = z.infer<typeof imageEnum>

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateImageRequest:
 *       type: object
 *       properties:
 *         prompt:
 *           type: string
 *           description: The text prompt to generate the image.
 *         style:
 *           type: string
 *           description: The style of the image to be generated.
 *       example:
 *         prompt: Cute norwegian forest cat
 *         style: natural
 */
export const imageSchema = z.object({
  body: z.object({
    prompt: z.string().min(1).max(4000),
    style: imageEnum
  })
});

export type CreateImageRequestBody = z.infer<typeof imageSchema>;