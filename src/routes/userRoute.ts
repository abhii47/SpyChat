import { Router } from "express";
import userController from "../Controller/userController";
import { auth } from "../middlewares/authMiddleware";
import { uploadSingle } from "../middlewares/uploadMiddleware";

const router = Router();

router.get("/search",auth,userController.searchUsers);
router.put("/update",auth,uploadSingle("avatar"),userController.updateProfile);
router.get("/:id",auth,userController.getUserProfile);

export default router;