import { validate } from "../middleware/validate";
import { signInSchema } from "../zod-schema/signInSchema";
import { Router } from "express";
import signInController from "../controller/signInController";

const router = Router();

router.post("/", validate(signInSchema), signInController);

export default router;
