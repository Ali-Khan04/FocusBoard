import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: {
    type: "string",
    unique: false,
    required: true,
  },
  description: {
    type: "string",
    unique: false,
    required: true,
  },
  date: { type: Date, required: true },
});
const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
