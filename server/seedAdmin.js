import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/UserModel.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to Database!");

    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@jobfindr.com" });

    if (adminExists) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("Admin@123456", 10);

    // Create admin user
    const adminUser = new User({
      name: "Admin User",
      email: "admin@jobfindr.com",
      password: hashedPassword,
      role: "admin",
      bio: "JobFindr Administrator",
      profession: "Admin",
      profilePicture: "/admin-avatar.png",
    });

    await adminUser.save();

    console.log("✅ Admin user created successfully!");
    console.log("\n📋 Admin Credentials:");
    console.log("================================");
    console.log("Email: admin@jobfindr.com");
    console.log("Password: Admin@123456");
    console.log("Role: Admin");
    console.log("================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error.message);
    process.exit(1);
  }
};

seedAdmin();
