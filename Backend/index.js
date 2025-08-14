import express from "express";
import cors from "cors";
import userTodosRouter from "./routes/TodosRoute.js";
import userSignUpRouter from "./routes/userRoute.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
app.use(cors());
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
app.listen(3000, () => {
  console.log("Server running in 3000");
});
