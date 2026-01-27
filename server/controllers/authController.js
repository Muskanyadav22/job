import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    User SignUp
// @route   POST /api/v1/auth/signup
// @access  Public
export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password, profession, role } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  // Hash password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    profession: profession || "Not specified",
    role: role || "jobseeker",
  });

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profession: user.profession,
      role: user.role,
      profilePicture: user.profilePicture,
    },
  });
});

// @desc    User Login
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  // Check password
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profession: user.profession,
      role: user.role,
      profilePicture: user.profilePicture,
    },
  });
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});
