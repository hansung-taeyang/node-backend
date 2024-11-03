import { Router } from "express";
import sendingMessageController from "../controller/sendingMessageController";

const router = Router();

router.post("/", sendingMessageController.sendMessage);

export default router;
