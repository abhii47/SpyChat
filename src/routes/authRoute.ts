import { Router } from "express";
import authController from "../Controllers/authController";
import { uploadSingle } from "../middlewares/uploadMiddleware";
import { validateBody } from "../middlewares/validateMiddleware";
import { loginSchema, registerSchema } from "../validations/authValidation";
import { auth } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", uploadSingle('avatar'), validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", auth, authController.getMe);

export default router;