import { Router } from "express";
import authService from "../services/Auth.service";

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

export default router;
