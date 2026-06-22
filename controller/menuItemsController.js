import mongoose, { mongo } from "mongoose";
import {
  responseToClient,
  responseWithPagination,
  validateId,
} from "../helper/response.js";
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
//get menu bu id
export const getMenuByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseToClient(res, req, 400, false, "Please provide the id");
    }
    if (!mongoose.isValidObjectId(id)) {
      return responseToClient(
        res,
        req,
        400,
        false,
        "Please provide the valid id",
      );
    }
    const menu = await MenuItem.findById(id);
    if (!menu) {
      return responseToClient(res, req, 400, false, "Menu item not found ");
    }
    return responseToClient(
      res,
      req,
      200,
      true,
      "menu item fetched Successfully",
      menu,
    );
  } catch (error) {
    console.log(error);
  }
};

//get all the menu items
export const getAllMenuControlller = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = Number((page - 1) * limit);
    const [menu, total] = await Promise.all([
      MenuItem.find().limit(limit).skip(skip).sort({ createdAt: -1 }),

      MenuItem.countDocuments(),
    ]);
    if (menu.length === 0) {
      return responseToClient(res, req, 404, false, "No item found");
    }

    const totalpage = Math.ceil(total / limit);

    return responseWithPagination(
      res,
      req,
      200,
      true,
      "Menu item fetch Successfully ",
      totalpage,
      menu,
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};
//Delete the menu item
export const deleteMenuIteController = async (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    const menu = await MenuItem.findById(id);
    if (!menu) {
      return responseToClient(res, req, 400, false, "Menu item not found.");
    }
    const deleteMenuItems = await MenuItem.findByIdAndDelete({ id });
    if (!deletemenuItems) {
      return responseToClient(
        res,
        req,
        400,
        false,
        "failed to dele the Menuitems",
      );
    }
  } catch (error) {
    throw error;
  }
};
