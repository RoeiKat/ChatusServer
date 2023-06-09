import { Router } from "express";
import { body } from "express-validator";
import { authCheck } from "../middleware/authCheck";
import { getUserConversations } from "../controllers/Conversations/conversation-read";
import { createMessage } from "../controllers/Conversations/Messages/messages-create";
import { getMessages } from "../controllers/Conversations/Messages/messages-read";

const router = Router();

//Gets all conversations
router.get("/", authCheck, getUserConversations);

// Uploads a new message
router.post(
  "/",
  [
    body("message", "Message cannot be null!").not().isEmpty(),
    body("to", "No reciever provided").not().isEmpty(),
  ],
  authCheck,
  createMessage
);

// Gets the conversation messages
router.get("/:conversationId", authCheck, getMessages);

export default router;
