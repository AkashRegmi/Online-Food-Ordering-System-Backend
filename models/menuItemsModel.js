import mongoose from "mongoose";
import { lowercase } from "zod";
const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Menu item name is required"],
      trim: true,
      lowercase: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be less than 0"],
      max: [100000, "Price exceeds the allowed limit"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      lowercase: true,
      enum: {
        values: [
          "starter",
          "main-course",
          "dessert",
          "beverage",
          "pizza",
          "burger",
          "other",
        ],
        message: "{VALUE} is not a valid category",
      },
      index: true,
    },
    menuImage: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ name: "text" });
const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;
