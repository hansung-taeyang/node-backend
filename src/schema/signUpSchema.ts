import { z } from "zod";

export const signUpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(15, { message: "Password must not exceed 15 characters" })
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).*/, 
        { message: "Password must contain letters, numbers, and special characters" }
    ),
    phone: z.string().regex(/^\d{11}$/, { message: "Phone number must be 10 digits" }),
  })
});

export type SignUpRequest = z.infer<typeof signUpSchema>;