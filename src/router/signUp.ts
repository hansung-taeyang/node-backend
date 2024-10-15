import { validate } from "../middleware/validate";
import { signUpSchema } from "../zod-schema/signUpSchema";
import { Router } from "express";
import signUpController from "../controller/signUpController";

const router = Router();


router.post("/", validate(signUpSchema), signUpController);

export default router;