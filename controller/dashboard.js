import { responseToClient } from "../helper/response.js";
import Order from "../models/orderModel.js";

export const getOrderInfo = async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const match = {};
  if (startDate || endDate) {
    match.createdAt = {};

    if (startDate) {
      match.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      match.createdAt.$lte = end;
    }
  }
  const [stats] = await Order.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: null,
        totalOrder: {
          $sum: 1,
        },
        totalIncome: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "delivered"],
              },
              "$totalAmount",
              0,
            ],
          },
        },
        totalPendingOrders: {
          $sum: {
            $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
          },
        },
      },
    },
  ]);
  return responseToClient(
    res,
    req,
    200,
    true,
    "Order statistics fetched successfully",
    stats,
  );
};

export const recentOrder = async (req, res, next) => {
  try {
    const data = await Order.find().populate("user").sort({ createdAt: -1 });
    return responseToClient(
      res,
      req,
      200,
      true,
      "Data fetch Successfully",
      data,
    );
  } catch (error) {
    next(error);
  }
};
