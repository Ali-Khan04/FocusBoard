import express from "express";
import cors from "cors";
import userTodosRouter from "./routes/getTodosRoute.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server running");
});
app.use("/user", userTodosRouter);
app.listen(3000, () => {
  console.log("Server running in 3000");
});
