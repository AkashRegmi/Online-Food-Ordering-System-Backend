import z from "zod";
import { objectId } from "./common/mongooseDbValidator.js";

export const orderItemSchema = z.object({
  menuItem: objectId,

  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),

  priceAtPurchase: z.coerce.number().min(0, "Price cannot be negative"),
});
export const orderSchema = z.object({
  user: z.string("User is required").min(1, "User is required"),

  items: z
    .array(orderItemSchema)
    .min(1, "Order must contain at least one item"),

  status: z
    .enum(
      [
        "pending",
        "confirmed",
        "preparing",
        "out-for-delivery",
        "delivered",
        "cancelled",
      ],
      {
        errorMap: () => ({
          message: "Please provide a valid order status",
        }),
      },
    )
    .optional(),

  address: z
    .string("Delivery address is required")
    .trim()
    .min(10, "Address must be at least 10 characters long")
    .max(300, "Address cannot exceed 300 characters"),

  notes: z
    .string()
    .trim()
    .max(200, "Notes cannot exceed 200 characters")
    .optional(),
});
export const updateOrderSchema = z.object({
  user: z.string("User is required").min(1, "User is required"),

  items: z
    .array(orderItemSchema)
    .min(1, "Order must contain at least one item")
    .optional(),

  status: z
    .enum(
      [
        "pending",
        "confirmed",
        "preparing",
        "out-for-delivery",
        "delivered",
        "cancelled",
      ],
      {
        errorMap: () => ({
          message: "Please provide a valid order status",
        }),
      },
    )
    .optional(),

  address: z
    .string("Delivery address is required")
    .trim()
    .min(10, "Address must be at least 10 characters long")
    .max(300, "Address cannot exceed 300 characters")
    .optional(),

  notes: z
    .string()
    .trim()
    .max(200, "Notes cannot exceed 200 characters")
    .optional(),
});
