import jwt from "jsonwebtoken";
export const generateAccessToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRETE, {
    expiresIn: "1h",
  });
  return token;
};
export const generateRefreshToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRETE, {
    expiresIn: "4d",
  });
  return token;
};
