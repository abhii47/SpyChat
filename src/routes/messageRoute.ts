import { Router } from "express";
import { auth } from "../middlewares/authMiddleware";
import { uploadMultiple } from "../middlewares/uploadMiddleware";
import messageController from "../Controllers/messageController";
import { validateBody } from "../middlewares/validateMiddleware";
import { SendMessageSchema } from "../validations/messageValidation";

const router = Router();

router.post("/upload",auth,uploadMultiple("media"),messageController.uploadMediaFiles);
router.post("/send",auth,uploadMultiple("media"),validateBody(SendMessageSchema),messageController.sendMessage);
router.get("/:messageId/read",auth,messageController.createMessageRead);
router.get("/:messageId",auth,messageController.checkMessageRead);
router.get("/:roomType/:roomId",auth,messageController.getMessage);
router.get("/:roomType/:roomId/unread-count",auth,messageController.getUnreadCount);

export default router;