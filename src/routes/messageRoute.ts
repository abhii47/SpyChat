import { Router } from "express";
import { auth } from "../middlewares/authMiddleware";
import { uploadMultiple } from "../middlewares/uploadMiddleware";
import messageController from "../Controller/messageController";

const router = Router();

router.post("/upload",auth,uploadMultiple("media"),messageController.uploadMediaFiles);

export default router;