import asycHandler from "express-async-handler";
import User from "../models/UserModel.js";

export const getUserProfile = asycHandler(async (req, res) => {
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

