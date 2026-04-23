import { Router } from "express";
import authController from "../Controller/authController";
import { uploadSingle } from "../middlewares/uploadMiddleware";

const router = Router();

router.post("/register", uploadSingle('avatar'), authController.register);
router.post("/login", authController.login);

export default router;