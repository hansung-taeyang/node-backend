import { z } from "zod";

export const signInSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address format" }),
    password: z.string(),
  }),
});

export type SignInRequestBody = z.infer<typeof signInSchema>;
