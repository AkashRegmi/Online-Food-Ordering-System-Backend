import { responseToClient } from "../helper/response.js";
import MenuItem from "../models/menuItemsModel.js";

export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const file = req.file;
    const existingName = await MenuItem.findOne({
      name: {
        $regex: name,
        $options: "i",
      },
    });
    if (existingName) {
      return responseToClient(
        res,
        req,
        400,
        false,
        `${name} already exist. Please Choose another nmae `,
      );
    }
    if (!file) {
      return responseToClient(res, 400, false, "Image is required");
    }
    const menuItem = await MenuItem.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      menuImage: file.path,
    });
    return responseToClient(
      res,
      req,
      201,
      true,
      "Menu item created successfully",
    );
  } catch (error) {
    console.log(error.message);
  }
};
