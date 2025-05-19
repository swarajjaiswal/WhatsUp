import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/authroute.js";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(cookieParser());
dotenv.config();
app.use(
  cors({
    origin:"http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/chat", chatRoute);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});         