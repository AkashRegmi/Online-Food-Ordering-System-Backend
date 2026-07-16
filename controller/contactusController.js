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

export const deleteContactUs = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return responseToClient(
        res,
        req,
        400,
        false,
        "Please Provide the id to delete ",
      );
    }
    const deletQuery = `delete from contacts where id=$1`;
    const deleteContactUs = await pool.query(deletQuery, [id]);
    if (!deleteContactUs) {
      return responseToClient(
        res,
        req,
        400,
        false,
        "Failed to delete the message",
      );
    }
    return responseToClient(
      res,
      req,
      200,
      true,
      "Contact us deleted Successfully",
    );
  } catch (error) {
    throw error;
  }
};

export const updateContactUs = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, subject, message } = req.body;
    if (!id) {
      return responseToClient(
        res,
        req,
        400,
        false,
        "Please Provide the id to delete ",
      );
    }
    const existingContact = await pool.query(
      "SELECT * FROM contacts WHERE id = $1",
      [id],
    );
    if (existingContact.rows.length === 0) {
      return responseToClient(res, req, 404, false, "Contact not found.");
    }
    const previousData = existingContact.rows[0];
    const updatedContact = await pool.query(
      `UPDATE contacts
       SET
         name = $1,
         email = $2,
         subject = $3,
         message = $4
       WHERE id = $5
       RETURNING *`,
      [
        name ?? previousData.name,
        email ?? previousData.email,
        subject ?? previousData.subject,
        message ?? previousData.message,
        id,
      ],
    );
    return responseToClient(
      res,
      req,
      200,
      true,
      "Contact updated successfully.",
      updatedContact.rows[0],
    );
  } catch (error) {
    throw error;
  }
};
