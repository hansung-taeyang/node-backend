import { validate } from "../middleware/validate";
import { imageSchema } from "../zod-schema/imageSchema";
import { Router } from "express";
import * as imageController from "../controller/imageController";
import { checkLogin } from "../middleware/checkLogin";

const router = Router();

/**
 * @openapi
 * /v1/image:
 *  post:
 *    summary: Create an image from Open AI
 *    tags: [Image]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      description: Request body requires prompt string.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateImageRequest'
 *    responses:
 *      200:
 *        description: Successfully created an image
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                url:
 *                  type: string
 *                  example: '/images/sample.jpeg'
 *      401:
 *        description: Unauthorized access
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: No image data found from OpenAI
 */
router.post("/", validate(imageSchema), checkLogin, imageController.createImage);

router.post("/withoutLogin", validate(imageSchema), imageController.createImage);
export default router;