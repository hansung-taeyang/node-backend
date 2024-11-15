import { validate } from "../middleware/validate";
import { signUpSchema } from "../zod-schema/signUpSchema";
import { Router } from "express";
import signUpController from "../controller/signUpController";

const router = Router();

/**
 * @openapi
 * /v1/signUp:
 *   post:
 *     summary: Sign up(Create new user)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequest'
 *     responses:
 *       201:
 *         description: Created user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: User created successfully
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already exists
 */
router.post("/", validate(signUpSchema), signUpController);

export default router;