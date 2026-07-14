import z, { ZodError } from "zod";
import fs from "fs";
export const validateRequest = (schema) => async (req, res, next) => {
  try {
    schema.parse(req.body);
    return next();
  } catch (err) {
    if (res.file) {
      fs.promises.unlink(req.file);
      try {
      } catch (error) {
        console.error(
          "Error deleting the file from the validation ",
          error.message,
        );
      }
    }
    if (req.files && Array.isArray(req.files)) {
      try {
        for (const file of req.files) {
          fs.promises.unlink(file);
          console.error("File deleted Successfully ");
        }
      } catch (error) {
        console.error(
          "Error deleting the fole from the Validation ",
          error.message,
        );
      }
    }
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: err.issues[0].message,
      });
    }
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};
