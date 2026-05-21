import express from "express";
import {
  getUserProfile,
  getAllUsers,
  deleteUser,
  uploadResume,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/protect.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/user/:id", getUserProfile);
router.get("/user/profile/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});
router.get("/users", protect, getAllUsers);
router.delete("/users/:id", protect, deleteUser);

// Profile update
router.put("/user/profile", protect, updateUserProfile);

// Resume upload — multer processes the file, then uploadResume controller handles it
router.post("/user/upload-resume", protect, upload.single("resume"), uploadResume);

export default router;
