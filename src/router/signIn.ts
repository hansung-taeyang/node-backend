import { validate } from "../middleware/validate";
import { signInSchema } from "../zod-schema/signInSchema";
import { Router } from "express";
import signInController from "../controller/signInController";

const router = Router();

/**
 * @openapi
 * /v1/signIn:
 *   post:
 *     summary: Sign in to the application
 *     requestBody:
 *       description: Request body requires email and password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInRequest'
 *     responses:
 *       200:
 *         description: Successfully signed in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: JWT_TOKEN_HERE
 *       401:
 *         description: Invalid credentials when user does not exist or password is incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Non-existing user or invalid password
 *                   example: Invalid credentials
 */
router.post("/", validate(signInSchema), signInController);

export default router;
