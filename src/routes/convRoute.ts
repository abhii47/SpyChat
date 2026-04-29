import { Router } from "express";
import { auth } from "../middlewares/authMiddleware";
import convController from "../Controller/convController";
import { validateBody } from "../middlewares/validateMiddleware";
import { startConversationSchema } from "../validations/convValidation";

const router = Router();

router.post("/", auth, validateBody(startConversationSchema), convController.startConversation);
router.get("/", auth, convController.getMyConversations);
router.get("/:id/messages", auth, convController.getConversationMessages);

export default router;