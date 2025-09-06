import Todo from "../db/TodoSchema.js";
import { errorHandler } from "../utils/customError.js";

export const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.status(200).json({ todos });
  } catch (err) {
    next(errorHandler(500, "Error Fetching todos"));
  }
};
