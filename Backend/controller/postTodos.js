import Todo from "../db/TodoSchema.js";
import { errorHandler } from "../utils/customError.js";
export const postTodos = async (req, res, next) => {
  const { title, description, date } = req.body;
  const newTodo = new Todo({ title, description, date });
  try {
    await newTodo.save();
    res.status(201).send("Saved Successfully");
  } catch (err) {
    next(errorHandler(500, "Error Saving todos"));
  }
};
