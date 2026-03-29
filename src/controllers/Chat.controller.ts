import { Router } from "express";
import chatService from "../services/Chat.service";
import { expressAuth } from "../middlewares/authMiddleware";

const router = Router();

router.use(expressAuth);

router.post("/", async (req, res, next) => {
  try {
    const user = (req as any).user;
    if (!user?.id) return res.status(401).json({ error: "Unauthorized" });
    const chat = await chatService.createChat(user.id, req.body);
    return res.status(201).json(chat);
  } catch (err) {
    return next(err);
  }
});

router.post("/participants", async (req, res, next) => {
  try {
    const updated = await chatService.addParticipant(req.body);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const user = (req as any).user;
    if (!user?.id) return res.status(401).json({ error: "Unauthorized" });
    const chats = await chatService.findChatsByUserId(user.id);
    return res.json(chats);
  } catch (err) {
    return next(err);
  }
});

export default router;
