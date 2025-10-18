import express from "express";
import cors from "cors";
import userTodosRouter from "./routes/TodosRoute.js";
import userRouter from "./routes/userRoute.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();
app.use(cookieParser());
app.use(helmet());
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

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts, try again later",
});

app.get("/", (req, res) => {
  res.send("Server running");
});
app.use("/user", userTodosRouter);
app.use("/auth", authLimiter, userRouter);

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
