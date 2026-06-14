import z from "zod";
export const menuItemsSchema = z.object({
  name: z
    .string("Menu item name is required")
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters")
    .regex(/^[A-Za-z]+$/, "Only character is allowed"),
  description: z
    .string("Description is required")
    .trim()
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description cannot exceed 500 characters"),
  price: z.coerce
    .number()
    .min(0, "Price cannot be less than 0")
    .max(100000, "Price exceeds the allowed limit"),
  category: z.enum(
    [
      "starter",
      "main-course",
      "dessert",
      "beverage",
      "pizza",
      "burger",
      "other",
    ],
    {
      errorMap: () => ({
        message: "Please provide a valid category",
      }),
    },
  ),
});
