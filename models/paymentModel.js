import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // payment belongs to an order
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    // who paid
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "usd",
      lowercase: true,
    },

    provider: {
      type: String,
      enum: ["stripe"],
      default: "stripe",
    },

    // Stripe payment intent id
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Stripe checkout session if needed
    sessionId: {
      type: String,
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "succeeded",
        "failed",
        "cancelled",
        "refunded",
      ],
      default: "pending",
      index: true,
    },

    paidAt: {
      type: Date,
    },

    failureReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);