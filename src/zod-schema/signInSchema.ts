import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     SignInRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *       required: [email, password]
 *       example:
 *         email: 'foo@bar.com'
 *         password: test1234!
 */
export const signInSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address format" }),
    password: z.string(),
  }),
});

export type SignInRequestBody = z.infer<typeof signInSchema>;
