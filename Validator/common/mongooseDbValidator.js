import z from "zod";
export const objectId = z
  .string("Provide the valid Id ")
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid mongo db id");
