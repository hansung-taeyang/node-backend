import { z } from "zod";

export const signUpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(15, { message: "Password must not exceed 15 characters" })
      .regex(
        /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*\d){1,})(?=(.*[#?!@$%^&*-]){1,}).*$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        },
      ),
    phone: z
      .string()
      .regex(/^\d{11}$/, { message: "Phone number must be 10 digits" }),
  }),
});

export type SignUpRequest = z.infer<typeof signUpSchema>;