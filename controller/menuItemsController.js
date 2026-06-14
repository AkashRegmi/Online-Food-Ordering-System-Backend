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
        400,
        false,
        `${name} already exist. Please Choose another nmae `,
      );
    }
    
  } catch (error) {
    console.log(error.log);
  }
};
