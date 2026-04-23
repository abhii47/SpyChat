import { Router } from "express";
import authController from "../Controller/authController";
import { uploadSingle } from "../middlewares/uploadMiddleware";
import { validateBody } from "../middlewares/validateMiddleware";
import { loginSchema, registerSchema } from "../validations/authValidation";

const router = Router();

router.post("/register", uploadSingle('avatar'), validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);

export default router;