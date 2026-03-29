import { Router } from "express";
import messageService from "../services/Message.service";
import { expressAuth } from "../middlewares/authMiddleware";

const router = Router();

router.use(expressAuth);

router.post("/", async (req, res, next) => {
  try {
    const user = (req as any).user;
    if (!user?.id) return res.status(401).json({ error: "Unauthorized" });
    const saved = await messageService.createMessage(user.id, req.body);
    return res.status(201).json(saved);
  } catch (err) {
    return next(err);
  }
});

router.patch("/", async (req, res, next) => {
  try {
    const user = (req as any).user;
    if (!user?.id) return res.status(401).json({ error: "Unauthorized" });
    const updated = await messageService.editMessage(user.id, req.body);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const user = (req as any).user;
    if (!user?.id) return res.status(401).json({ error: "Unauthorized" });
    const deleted = await messageService.deleteMessage(user.id, req.params.id);
    return res.json({ deleted });
  } catch (err) {
    return next(err);
  }
});

export default router;
