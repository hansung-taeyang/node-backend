import { z } from "zod";

/**
 * - POST /createImage의 request body의 스키마(규칙)  
 * - middleware/validate.ts의 validated에서 사용자 request body가 유효한 형식인지 검증할 때 사용
 */
const imageSchema = z.object({
  body: z.object({
    prompt: z.string().min(1).max(4000),
    style: z.enum(["vivid", "natural"])
  })
});

export default imageSchema;