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
router.post("/", validate(imageSchema), imageController.createImage);

/**
 * @openapi
 * /v1/image/withLogin:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    summary: Create an image from Open AI
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
router.post("/withLogin", validate(imageSchema), checkLogin, imageController.createImage);

// 로그인 한 유저가 생성한 모든 이미지를 배열 형식으로 리턴
/*
[
  {"imageId":"2GWh1VwmSmbJHicsigyeXu1ByiZ4-y7O45tq9svCWSE.jpeg","createdAt":"2024-11-02T12:54:43.000Z"},
  {"imageId":"8wIK9uJRD6pH08NwCwHo4liXiWg0tzANYy1Zq6ZX28o.jpeg","createdAt":"2024-11-02T12:55:09.000Z"}
]
*/
router.get("/withLogin", checkLogin, imageController.getAllImage);

export default router;