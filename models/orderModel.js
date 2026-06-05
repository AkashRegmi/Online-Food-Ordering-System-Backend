import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: [true, "Menu item is required"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },

    price: {
      type: Number,
      required: [true, "Item price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: [true, "Order must contain at least one item"],
    },

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },

    status: {
      type: String,
      enum: {
        values: [
          "pending",
          "confirmed",
          "preparing",
          "out-for-delivery",
          "delivered",
          "cancelled",
        ],
        message: "{VALUE} is not a valid order status",
      },
      default: "pending",
      index: true,
    },

    address: {
      type: String,
      required: [true, "Delivery address is required"],
      trim: true,
      minlength: [10, "Address must be at least 10 characters long"],
      maxlength: [300, "Address cannot exceed 300 characters"],
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.index({ user: 1 });

orderSchema.index({ status: 1 });

orderSchema.index({ user: 1, createdAt: -1 });

orderSchema.index({ status: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
