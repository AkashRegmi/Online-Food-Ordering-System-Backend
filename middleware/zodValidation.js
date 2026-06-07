import z, { Schema, ZodError } from "zod";
export const validateRequest = (schema) => async (req, res, next) => {
  try {
    schema.parse(req.body);
    return next();
  } catch (err) {
    const error = err instanceof ZodError ? err.error : err;
    return res.status(400).json(error);
  }
};
