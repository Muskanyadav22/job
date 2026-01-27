import express from "express";
import { signUp, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/auth/signup", signUp);
router.post("/auth/login", login);
router.get("/auth/me", protect, getMe);

export default router;
