import z, { ZodError } from "zod";
export const validateRequest = (schema) => async (req, res, next) => {
  try {
    schema.parse(req.body);
    return next();
  } catch (err) {
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
