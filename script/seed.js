import mongoose from "mongoose";
import User from "../models/userModel.js";
import dotenv from "dotenv";
import { tryCatch } from "bullmq";
dotenv.config();
const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect to the database");
    if (!process.env.SUPERADMIN_EMAIL || !process.env.SUPERADMIN_PASSWORD) {
      throw new Error("Missing super admin credentials");
    }
    const existingAdmin = await User.findOne({
      email: process.env.SUPERADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Super admin already exists");
      return;
    }
    await User.deleteMany();
    console.log("All user deleted");
    const data = {
      userName: "superAdmin",
      email: process.env.SUPERADMIN_EMAIL,
      password: process.env.SUPERADMIN_PASSWORD,
      role: process.env.SUPERADMIN_ROLE,
      isActive: true,
    };
    const user = await User.create(data);
    console.log("user created ");
  } catch (error) {
    console.log("error during the Seeding ", error.message);
  } finally {
    mongoose.disconnect();
    console.log("Mongoose connection closed.");
  }
};
seedData();
