import { z } from "zod";

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
    subject: z.string(),
    imageUrl: z.string()
  })
});

export type MessageRequestBody = z.infer<typeof messageSchema>;