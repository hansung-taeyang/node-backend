import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     PpurioResponse:
 *       description: Data sent back from ppurio API
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         description:
 *           type: string
 *         refKey:
 *           type: string
 *         messageKey:
 *           type: string
 *       example:
 *         code: 1000
 *         description: success
 *         refKey: text
 *         messageKey: 230413110135117SMS029914servsUBn
 *     MessageRequest:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: Message content
 *         from:
 *           type: string
 *           description: Sender's phone number
 *         targetCount:
 *           type: number
 *           description: Number of targets(Message recipients)
 *         targets:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Recipient's phone number
 *               name:
 *                 type: string
 *                 description: Recipient's name
 *               changeWord:
 *                 type: string
 *                 description: Word to change in the message
 *             required: [to]
 *         imageUrl:
 *           type: string
 *           description: URL of an image to send with message
 *       required: [content, from, targetCount, targets, imageUrl]
 *       example:
 *         content: "[문자 제목] 문자 내용"
 *         from: "01012345678"
 *         targetCount: 2
 *         targets:
 *           - to: "01012345678"
 *           - to: "01087654321"
 *         imageUrl: "/images/sample.jpeg"
 */
export const messageSchema = z.object({
  body: z.object({
    content: z.string(),
    from: z.string(),
    targetCount: z.number(),
    targets: z.array(z.object({
      to: z.string(),
      name: z.any().optional(),
      changeWord: z.any().optional()
    })),
    imageUrl: z.string()
  })
});

export type MessageRequestBody = z.infer<typeof messageSchema>;