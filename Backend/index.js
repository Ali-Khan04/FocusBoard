import express from "express";
import cors from "cors";
import userTodosRouter from "./routes/TodosRoute.js";
import userSignUpRouter from "./routes/userRoute.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection failed", err));

app.get("/", (req, res) => {
  res.send("Server running");
});
app.use("/user", userTodosRouter);
app.use("/auth", userSignUpRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    statusCode,
    message,
  });
});
app.listen(3000, () => {
  console.log("Server running in 3000");
});
