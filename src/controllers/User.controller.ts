import { Router } from "express";
import userService from "../services/User.service";
import { expressAuth } from "../middlewares/authMiddleware";

const router = Router();

// Create user (public)
router.post("/", async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    // remove password from response
    const u = { ...(user as any) };
    delete u.password;
    return res.status(201).json(u);
  } catch (err) {
    return next(err);
  }
});

// Protected routes
router.use(expressAuth);

router.get("/me", async (req, res, next) => {
  try {
    const user = (req as any).user;
    if (!user?.id) return res.status(401).json({ error: "Unauthorized" });
    const data = await userService.findById(user.id);
    if (!data) return res.status(404).json({ error: "Not found" });
    const u = { ...(data as any) };
    delete u.password;
    return res.json(u);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Not found" });
    const u = { ...(updated as any) };
    delete u.password;
    return res.json(u);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

export default router;
