import { z } from "zod";

// 프론트에서 넘겨줄 필드 중 하나: 생성될 이미지의 스타일
/**
 * @openapi
 * components:
 *   schemas:
 *     ImageStyleEnum:
 *       type: string
 *       enum:
 *         - minimalist
 *         - flat design
 *         - watercolor
 *         - vintage
 *         - abstract
 *         - line art
 */
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
 *           maxLength: 4000
 *           description: 책 장르 및 카테고리와 책 소개를 포함한 내용
 *         style:
 *           type: string
 *           description: 원하는 이미지 스타일
 *           schema:
 *             $ref: '#/components/schemas/ImageStyleEnum'
 *       required: [prompt, style]
 *       example:
 *         prompt: >-
 *           장르: 장편소설, 추리/미스터리. 책 소개: 외딴 산장에 여덟 명의 남녀가 모인 가운데 한밤중 은행 강도범이 침입해 인질극을 벌인다.
 *           인질들은 수차례 탈출을 시도하지만 번번이 실패하고, 강도범과 인질들 사이에 숨 막히는 줄다리기가 펼쳐지는 가운데 인질 한 명이 살해된 체 발견된다.
 *         style: 'flat design'
 */
export const imageSchema = z.object({
  body: z.object({
    prompt: z.string().min(1).max(4000),
    style: imageEnum
  })
});

export type CreateImageRequestBody = z.infer<typeof imageSchema>;