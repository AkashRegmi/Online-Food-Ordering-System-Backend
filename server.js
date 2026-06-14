import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { validateEnv } from "./helper/validateEnv.js";
import { connectRedis } from "./config/redis.js";
import authRoute from "./routes/userRoutes.js";
dotenv.config();
validateEnv();
const PORT = process.env.PORT || 5000;
const app = express();
connectDb();
connectRedis();
//middleWare
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Helath of the Server
app.get("/checkHealth", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", authRoute);

//GLOBAL ERROR HANDELING
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running in port ${process.env.PORT}`);
});
