import fs from "fs";
import mongoose from "mongoose";
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

//thii s for the paination
export const responseWithPagination = (
  res,
  req,
  statusCode,
  success,
  message,
  total,
  data,
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  res.status(statusCode).json({
    status: statusCode,
    success,
    pagination: {
      page: page,
      limit: limit,
      totalPage: total,
    },
    message,
    data: data ?? null,
  });
};

//Validate the id
export const validateId = (id) => {
  if (!id) {
    return responseToClient(res, req, 400, false, "Please providethe  Id");
  }
  if (!mongoose.isValidObjectId(id)) {
    return responseToClient(
      res,
      req,
      400,
      false,
      "Please provide the valid Id",
    );
  }
};
