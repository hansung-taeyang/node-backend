import { z } from "zod";

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
 *           description: The style of the image to be generated. Can be either "vivid" or "natural".
 *       example:
 *         prompt: Cute norwegian forest cat
 *         style: natural
 */
export const imageSchema = z.object({
  body: z.object({
    prompt: z.string().min(1).max(4000),
    style: z.literal("vivid").or(z.literal("natural"))
  })
});

export type CreateImageRequestBody = z.infer<typeof imageSchema>;