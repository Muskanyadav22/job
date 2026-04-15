import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password, profession, role } = req.body;

  
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }


  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    profession: profession || "Not specified",
    role: role || "jobseeker",
  });

  
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

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }


  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

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


export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});
