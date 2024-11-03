import { Router } from "express";
import SendMessageController from "../controller/sendMessageController";
import { messageSchema } from "../zod-schema/messageSchema";
import { validate } from "../middleware/validate";

const router = Router();
const controller = new SendMessageController();

router.post("/", validate(messageSchema), controller.sendMessage);

export default router;
