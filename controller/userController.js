import { tryCatch } from "bullmq";
import { sendEmailHelper } from "../helper/emailJobHelper.js";
import { generateOtp } from "../helper/generateOtp.js";
import { responseToClient } from "../helper/response.js";
import User from "../models/userModel.js";
import { emailQueue } from "../Queue/emailQueue.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helper/generateToken.js";
export const registerUser = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;
    //checking the existing user
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return responseToClient(res, 409, false, `email ${email} already exist`);
    }
    const otp = generateOtp(5);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    const newUser = await User.create({
      userName,
      email,
      password,
      otp,
      otpExpire: otpExpiry,
    });
    await sendEmailHelper(
      "otp_email",
      email,
      "otp.pug",
      "Verify your Account",
      {
        name: userName,
        otp,
      },
    );
    return responseToClient(
      res,
      201,
      true,
      "User registered successfully. OTP sent to email.",
    );
  } catch (error) {
    console.log(error);
  }
};

export const verifyOtpAfterRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const checkExistingUser = await User.findOne({ email: email });
    if (!checkExistingUser) {
      return responseToClient(
        res,
        400,
        false,
        `User with email ${email} doesnot exist. please Sign up `,
      );
    }
    if (!otp) {
      return responseToClient(res, 400, false, "Pleaase provide the otp");
    }
    if (checkExistingUser.otp !== otp) {
      return responseToClient(res, 400, false, "Invalid otp");
    }
    if (
      !checkExistingUser.otpExpire ||
      checkExistingUser.otpExpire < Date.now()
    ) {
      return responseToClient(res, 400, false, "OTP expired");
    }
    checkExistingUser.isActive = true;
    checkExistingUser.otp = null;
    checkExistingUser.otpExpire = null;
    await checkExistingUser.save();
    return responseToClient(res, 200, true, "Otp verified Successfully");
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check th euser exist
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return responseToClient(
        res,
        400,
        false,
        "User Not found.Please Sign Up.",
      );
    }

    //check that the user account is active
    if (!userExist.isActive) {
      return responseToClient(
        res,
        400,
        false,
        "Please verify your account to login",
      );
    }
    //validate the password
    const isVerified = await bcrypt.compare(password, userExist.password);
    if (!isVerified) {
      return responseToClient(
        res,
        400,
        false,
        "Password doesnot match. Please provide correct password",
      );
    }
    const payload = {
      id: userExist._id,
      email: userExist.email,
      role: userExist.role,
    };
    //if password is correct then send the token
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    return responseToClient(res, 200, true, "Login Successfull", {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
  }
};
