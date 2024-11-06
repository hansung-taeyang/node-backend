import { Router } from "express";
import SendMessageController from "../controller/sendMessageController";
import { messageSchema } from "../zod-schema/messageSchema";
import { validate } from "../middleware/validate";
import { checkLogin } from "../middleware/checkLogin";

const router = Router();
const controller = new SendMessageController();

router.post("/", validate(messageSchema), controller.sendMessage);
router.get("/withLogin", checkLogin, controller.getMessages);
router.get("/", controller.getMessages);

export default router;
