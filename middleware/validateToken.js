import { responseToClient } from "../helper/response.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeaders = req.headers["authorization"];
    const token = authHeaders && authHeaders.split(" ")[1];
    if (!token) {
      responseToClient(res, 400, false, "Token is not Provided ");
    }
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRETE);
    const validUser = await User.findOne({
      email: decoded.email,
      isActive: true,
    });
    if (!validUser) {
      responseToClient(res, 400, false, "User not found");
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
  }
};
