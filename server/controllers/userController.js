import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import { uploadToCloudinary } from "../middleware/upload.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if id exists
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // find user by id
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile: ", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Get all users (Admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can view all users" });
    }

    const users = await User.find({}).select("-password");

    return res.status(200).json(users);
  } catch (error) {
    console.log("Error in getAllUsers: ", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Delete user (Admin only)
export const deleteUser = asyncHandler(async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete users" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error in deleteUser: ", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Upload Resume (PDF) to Cloudinary
export const uploadResume = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Generate a unique filename using userId + timestamp
    const filename = `resume_${user._id}_${Date.now()}`;

    // Upload PDF buffer to Cloudinary
    const resumeUrl = await uploadToCloudinary(req.file.buffer, filename);

    // Save URL to user profile
    user.resume = resumeUrl;
    await user.save();

    return res.status(200).json({
      message: "Resume uploaded successfully",
      resumeUrl,
    });
  } catch (error) {
    console.log("Error in uploadResume:", error);
    return res.status(500).json({ message: "Failed to upload resume" });
  }
});

// Update user profile (name, bio, profession)
export const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { name, bio, profession } = req.body;

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (profession) user.profession = profession;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profession: user.profession,
        bio: user.bio,
        role: user.role,
        profilePicture: user.profilePicture,
        resume: user.resume,
      },
    });
  } catch (error) {
    console.log("Error in updateUserProfile:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
});
