import { Router } from "express";
import MessageController from "../controller/messageController";
import { messageSchema } from "../zod-schema/messageSchema";
import { validate } from "../middleware/validate";
import { checkLogin } from "../middleware/checkLogin";

const router = Router();
const controller = new MessageController();

router.post("/", validate(messageSchema), controller.sendMessage);
router.get("/withLogin", checkLogin, controller.getMessages);
router.get("/", controller.getMessagesWithoutLogin);

export default router;