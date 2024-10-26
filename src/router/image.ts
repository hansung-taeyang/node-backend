import { validate } from "../middleware/validate";
import { imageSchema } from "../zod-schema/imageSchema";
import { Router } from "express";
import * as imageController from "../controller/imageController";

const router = Router();

/**
 * @openapi
 * /v1/image:
 *  post:
 *    summary: Create an image from Open AI
 *    requestBody:
 *      description: Request body requires prompt string. Style should be either `vivid` or `natural`. (`vivid` is the default)
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateImageRequest'
 *          example:
 *            prompt: Cute norwegian forest cat
 *            style: natural
 *    responses:
 *      200:
 *        description: Successfully created image with revised prompt string.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    revisedPrompt:
 *                      type: string
 *                    url:
 *                      type: string
 *                  description: The generated image data

 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 */
router.post("/", validate(imageSchema), imageController.createImageController);

export default router;