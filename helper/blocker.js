import { tryCatch } from "bullmq";
import { responseToClient } from "./response.js";

export const block = (destination) => {
  return (req, res, next) => {
    try {
      const role = req.user.role;
      if (!destination.includes(role)) {
        return responseToClient(
          res,
          req,
          401,
          false,
          "Not allowed to perform the task",
        );
      }
      next();
    } catch (error) {
      throw error;
    }
  };
};
