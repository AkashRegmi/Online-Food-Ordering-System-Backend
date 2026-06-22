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
        req,
        400,
        false,
        "User Not found.Please Sign Up.",
      );
    }

    //check that the user account is active
    if (!userExist.isActive) {
      return responseToClient(
        res,
        req,
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
        req,
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
    return responseToClient(res,req, 200, true, "Login Successfull", {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
  }
};

export const resendOtp = async (req, res) => {
  try {
    //take the email from the body
    const { email } = req.body;
    //vlaidae the email is that emal exist andthe account status is true
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return responseToClient(res, 400, false, "user not found");
    }
    const otp = generateOtp(5);
    const otpExpiry = new Date(new Date().getMinutes() + 30);
    //generate the otp
    existingUser.otp = otp;
    existingUser.otpExpiry = otpExpiry;
    await existingUser.save();
    //send the otp to mail
    await sendEmailHelper(
      "otp_email",
      email,
      "otp.pug",
      "Verify your Account",
      {
        name: existingUser.userName,
        otp,
      },
    );
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    //take the actual email, password and newPassword
    const { email, password, newPassword } = req.body;
    //checl the user and check the user is verified
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return responseToClient(res, 400, false, "User not found");
    }
    if (!existingUser.isActive) {
      return responseToClient(res, 400, false, "Please verify your account");
    }
    //check the password
    const isVAlidPassword = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isVAlidPassword) {
      return responseToClient(res, 400, false, "Invalid Password");
    }
    const isSamePassword = await bcrypt.compare(
      newPassword,
      existingUser.password,
    );
    if (isSamePassword) {
      return responseToClient(
        res,
        400,
        false,
        "New Password cannot be same as before ",
      );
    }
    //then update the passwird
    existingUser.password = newPassword;
    await existingUser.save();
    return responseToClient(res, 200, true, "Password reset Successfully");
  } catch (error) {
    console.log(error);
  }
};
