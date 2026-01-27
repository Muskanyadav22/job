import express from "express";
import { getUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.get("/user/:id", getUserProfile);
router.get("/user/profile/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;

