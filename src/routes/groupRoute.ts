import { Router } from "express";
import { auth } from "../middlewares/authMiddleware";
import { uploadSingle } from "../middlewares/uploadMiddleware";
import { validateBody } from "../middlewares/validateMiddleware";
import { addMemberSchema, createGroupSchema } from "../validations/groupValidation";
import groupController from "../Controllers/groupController";

const router = Router();

router.post(
  "/",
  auth,
  uploadSingle("avatar"),
  validateBody(createGroupSchema),
  groupController.createGroup
);
router.get("/", auth, groupController.getMyGroups);
router.get("/:id", auth, groupController.getGroupDetails);
router.post(
  "/:id/members", auth,
  validateBody(addMemberSchema),
  groupController.addMember
);
router.delete("/:id/members/:userId", auth, groupController.removeMember);
router.get("/:id/messages", auth, groupController.getGroupMessages);

export default router;