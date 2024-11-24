import { Router } from "express";
import MessageController from "../controller/messageController";
import { messageSchema } from "../zod-schema/messageSchema";
import { validate } from "../middleware/validate";
import { checkLogin } from "../middleware/checkLogin";

const router = Router();
const controller = new MessageController();

/**
 * @openapi
 * /v1/message:
 *   post:
 *     summary: Send a message with ppurio API
 *     tags: [Message]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Request body requires content, targetCount, targets, imageUrl.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MessageRequest'
 *     responses:
 *       200:
 *         description: Successfully sent a message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message sent successfully
 *                 data:
 *                   $ref: '#/components/schemas/PpurioResponse'
 *       401:
 *         description: Unauthorized access
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to send a message
 * 
 */
router.post("/", validate(messageSchema), checkLogin, controller.sendMessage);

/**
 * @openapi
 * /v1/message:
 *  get:
 *   summary: Get all messages sent by a user
 *   tags: [Message]
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: Successfully retrieved messages
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         messages:
 *          type: array
 *          items:
 *           type: object
 *           properties:
 *            id:
 *             type: number
 *             example: 1
 *            image:
 *             type: string
 *             example: "/images/sample.jpeg"
 *            messageJson:
 *             type: object
 *             properties:
 *              content:
 *               type: string
 *               example: "[문자 제목] 문자 내용"
 *              targetCount:
 *               type: number
 *               example: 1
 *            sentAt:
 *             type: string
 *             format: date-time
 *             example: "2021-08-01T00:00:00.000Z"
 *    401:
 *     description: Unauthorized access
 *     $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/", checkLogin, controller.getMessages);

/**
 * @openapi
 * /v1/message/{messageId}:
 *  delete:
 *   summary: Delete a message by messageId
 *   tags: [Message]
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: messageId
 *      schema:
 *       type: number
 *      required: true
 *      description: ID of the message to delete
 *   responses:
 *    204:
 *     description: Successfully deleted a message
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Message deleted successfully
 *    400:
 *     description: Invalid message ID
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Message ID must be a number
 *    401:
 *     description: Unauthorized access
 *     $ref: '#/components/responses/UnauthorizedError'
 *    500:
 *     description: Internal server error
 */
router.delete("/:messageId", checkLogin, controller.deleteMessage);

export default router;