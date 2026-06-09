import { sendEmailHelper } from "../helper/emailJobHelper.js";
import { generateOtp } from "../helper/generateOtp.js";
import { responseToClient } from "../helper/response.js";
import User from "../models/userModel.js";
import { emailQueue } from "../Queue/emailQueue.js";

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
