import { z } from "zod";

const imageSchema = z.object({
  body: z.object({
    prompt: z.string().min(1).max(4000),
    style: z.enum(["vivid", "natural"])
  })
});

export default imageSchema;