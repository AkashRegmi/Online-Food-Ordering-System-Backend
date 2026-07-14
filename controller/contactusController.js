import pool from "../config/pgdb.js";
import { responseToClient } from "../helper/response.js";

export const contactusController = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const query = `
      INSERT INTO contacts (name, email, subject, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [name, email, subject, message];

    const result = await pool.query(query, values);
    return responseToClient(
      res,
      req,
      201,
      true,
      "Contact us created SuccessFully",
      result?.rows[0],
    );
  } catch (error) {
    throw error;
  }
};

export const getAllContactus = async (req, res) => {
  try {
    const query = `SELECT * FROM  contacts`;
    const data = await pool.query(query);
    if (!data.rows) {
      responseToClient(res, req, 400, false, "no data found");
    }
    return responseToClient(
      res,
      req,
      200,
      true,
      "Contact Us data fetched successfully",
      data?.rows,
    );
  } catch (error) {
    throw error;
  }
};

export const getByIdContactUs = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseToClient(res, req, 400, false, "Please provide the id");
    }
    const query = `select * from contacts where id=$1`;
    const data = await pool.query(query, [id]);
    return responseToClient(
      res,
      req,
      200,
      true,
      "Data fetched Successfully",
      data.rows,
    );
  } catch (error) {
    throw error;
  }
};
