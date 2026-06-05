import env from "dotenv";
import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
env.config();

const PORT = process.env.PORT || 5000;
const app = express();
connectDb();
//middleWare
app.use(cors());

//Helath of the Server
app.get("/checkHealth", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
