import { OAuth2Client } from "google-auth-library";
import { responseToClient } from "../helper/response.js";
import { tryCatch } from "bullmq";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helper/generateToken.js";
import axios from "axios";
import User from "../models/userModel.js";
const client = new OAuth2Client(process.env.CLIENT_ID);
export const googleLogin = async (req, res) => {
  try {
    const googleUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.CLIENT_ID}` +
      `&redirect_uri=${process.env.REDIRECT_URI}` +
      `&response_type=code` +
      `&scope=openid email profile`;
console.log(process.env.REDIRECT_URI);
    return res.redirect(googleUrl);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to redirect to Google",
    });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    console.log(code);

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code missing",
      });
    }

    // Exchange code for token
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
    });

    // Get Google profile
    const googleUser = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      },
    );

    const profile = googleUser.data;

    let user = await User.findOne({
      email: profile.email,
    });

    if (!user) {
      user = await User.create({
        userName: profile.name,
        email: profile.email,
        googleId: profile.id,
        profileImage: profile.picture,
        authProvider: "google",
        isActive: true,
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return res.json({
      success: true,
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    console.log(error.response?.data || error);

    res.status(500).json({
      success: false,
      message: "Google Login Failed",
    });
  }
};
