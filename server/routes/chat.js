import { Router } from "express";
import { randomUUID } from "crypto";
import { authRequired } from "../lib/auth.js";
import { addChatMessage, getUserById } from "../lib/store.js";
import { generateSupportReply } from "../lib/gemini.js";

const router = Router();

router.post("/", authRequired, async (req, res) => {
  const { message, history = [] } = req.body || {};

  if (!message || !String(message).trim()) {
    return res.status(400).json({ message: "message is required" });
  }

  const user = await getUserById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const userMessage = {
    id: randomUUID(),
    userId: req.userId,
    role: "user",
    content: String(message).trim(),
    createdAt: new Date().toISOString(),
  };
  await addChatMessage(userMessage);

  const result = await generateSupportReply({
    message: userMessage.content,
    history,
    user,
  });

  const assistantMessage = {
    id: randomUUID(),
    userId: req.userId,
    role: "assistant",
    content: result.reply,
    source: result.source,
    createdAt: new Date().toISOString(),
  };
  await addChatMessage(assistantMessage);

  return res.json({
    reply: assistantMessage.content,
    source: assistantMessage.source,
  });
});

export default router;
