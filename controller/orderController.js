import mongoose from "mongoose";
import {
  responseToClient,
  responseWithPagination,
  validateId,
} from "../helper/response.js";
import MenuItem from "../models/menuItemsModel.js";
import Order from "../models/orderModel.js";

export const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userId = req.user.id;
    const { items, address, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      await session.abortTransaction();

      return responseToClient(
        res,
        req,
        400,
        false,
        "Order must contain at least one item",
      );
    }

    if (!address || address.trim().length < 10) {
      await session.abortTransaction();

      return responseToClient(
        res,
        req,
        400,
        false,
        "Valid delivery address is required",
      );
    }

    const invalidItem = items.find(
      (item) => !item.menuItem || !item.quantity || item.quantity < 1,
    );

    if (invalidItem) {
      await session.abortTransaction();

      return responseToClient(
        res,
        req,
        400,
        false,
        "Quantity must be at least 1",
      );
    }

    const menuIds = items.map((item) => item.menuItem);

    const menuItems = await MenuItem.find({
      _id: { $in: menuIds },
    }).session(session);

    if (menuItems.length !== items.length) {
      await session.abortTransaction();

      return responseToClient(
        res,
        req,
        404,
        false,
        "One or more menu items not found",
      );
    }

    const menuMap = new Map();

    menuItems.forEach((menu) => {
      menuMap.set(menu._id.toString(), menu);
    });

    let totalAmount = 0;

    const orderItems = items.map((item) => {
      const menu = menuMap.get(item.menuItem);

      const itemTotal = menu.price * item.quantity;

      totalAmount += itemTotal;

      return {
        menuItem: menu._id,
        quantity: item.quantity,
        priceAtPurchase: menu.price, // secure, from DB
      };
    });

    const order = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          totalAmount,
          address,
          notes,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return responseToClient(
      res,
      req,
      201,
      true,
      "Order created successfully",
      order[0],
    );
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const filter = role === "admin" ? {} : { user: id };

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("items.menuItem", "name price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!orders.length) {
      return responseToClient(res, req, 404, false, "No orders found");
    }
    const total = await Order.countDocuments(filter);

    return responseWithPagination(
      res,
      req,
      200,
      true,
      "Total oeder Fetched Successfully",
      total,
      orders,
    );
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return responseToClient(res, req, 400, false, "Invalid order id");
    }

    const filter = role === "admin" ? { _id: id } : { _id: id, user: userId };

    const order = await Order.findOne(filter)
      .populate("user", "name email")
      .populate("items.menuItem", "name price category");

    if (!order) {
      return responseToClient(res, req, 404, false, "Order not found");
    }

    return responseToClient(
      res,
      req,
      200,
      true,
      "Order fetched successfully",
      order,
    );
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    validateId(id);
    const isExistingOrder = await Order.findById(id);
    if (!isExistingOrder) {
      return responseToClient(res, req, 400, false, "order not found");
    }
    const filter = role === "admin" ? { _id: id } : { _id: id, user: userId };

    const deleteOrder = await Order.findOneAndDelete(filter);
    if (!deleteOrder) {
      return responseToClient(
        res,
        req,
        400,
        false,
        "Failded to delete the order",
      );
    }
    return responseToClient(res, req, 200, true, "Order Deleted Successfully");
  } catch (error) {
    next(error);
  }
};
export const updateOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { id } = req.params;
    const userId = req.user.id;
    const { items, address, notes } = req.body;

    const isAdmin = req?.user?.role === "admin";
    const query = isAdmin ? { id: _id } : { id: _id, user: userId };

    const order = await Order.findOne(query).session(session);

    if (!order) {
      await session.abortTransaction();

      return responseToClient(res, req, 404, false, "Order not found");
    }

    if (!isAdmin && ["delivered", "cancelled"].includes(order.status)) {
      await session.abortTransaction();

      return responseToClient(
        res,
        req,
        400,
        false,
        `Cannot update a ${order.status} order`,
      );
    }

    // Update items if provided
    if (items) {
      const menuIds = items.map((item) => item.menuItem);

      const menuItems = await MenuItem.find({
        _id: { $in: menuIds },
      }).session(session);

      if (menuItems.length !== items.length) {
        await session.abortTransaction();

        return responseToClient(
          res,
          req,
          404,
          false,
          "One or more menu items not found",
        );
      }
      if (isAdmin && status !== undefined) {
        order.status = status;
      }

      const menuMap = new Map();

      menuItems.forEach((menu) => {
        menuMap.set(menu._id.toString(), menu);
      });

      let totalAmount = 0;

      const orderItems = items.map((item) => {
        const menu = menuMap.get(item.menuItem);

        totalAmount += menu.price * item.quantity;

        return {
          menuItem: menu._id,
          quantity: item.quantity,
          priceAtPurchase: menu.price,
        };
      });

      order.items = orderItems;
      order.totalAmount = totalAmount;
    }

    if (address !== undefined) {
      order.address = address;
    }

    if (notes !== undefined) {
      order.notes = notes;
    }

    await order.save({ session });

    await session.commitTransaction();

    return responseToClient(
      res,
      req,
      200,
      true,
      "Order updated successfully",
      order,
    );
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
