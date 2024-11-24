import { Router } from "express";
import MessageController from "../controller/messageController";
import { messageSchema } from "../zod-schema/messageSchema";
import { validate } from "../middleware/validate";
import { checkLogin } from "../middleware/checkLogin";

const router = Router();
const controller = new MessageController();

router.post("/", validate(messageSchema), checkLogin, controller.sendMessage);
router.get("/", checkLogin, controller.getMessages);

router.delete("/:messageId", checkLogin, controller.deleteMessage);

export default router;
