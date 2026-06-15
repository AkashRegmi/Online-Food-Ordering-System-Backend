import fs from "fs";
export const responseToClient = (
  res,
  req,
  statusCode,
  success,
  message,
  data,
) => {
  if (!success && req?.file?.path) {
    fs.unlink(req.file.path, (err) => {
      if (err) console.log("Failed to delete file:", err);
    });
  }
  return res.status(statusCode).json({
    status: statusCode,
    success,
    message,
    data: data ?? null,
  });
};


