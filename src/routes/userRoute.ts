import { Router } from "express";
import userController from "../Controllers/userController";
import { auth } from "../middlewares/authMiddleware";
import { uploadSingle } from "../middlewares/uploadMiddleware";
import { validateBody } from "../middlewares/validateMiddleware";
import { updateProfileSchema } from "../validations/userValidation";

const router = Router();

router.get("/search", auth, userController.searchUsers);
router.put("/update", auth, uploadSingle("avatar"), validateBody(updateProfileSchema), userController.updateProfile);
router.get("/:id", auth, userController.getUserProfile);

export default router;