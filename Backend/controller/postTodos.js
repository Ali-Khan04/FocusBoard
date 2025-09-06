import Todo from "../db/TodoSchema.js";
import { errorHandler } from "../utils/customError.js";
export const postTodos = async (req, res, next) => {
  const { title, description, date } = req.body;
  const { userId } = req.params;
  if (!title || !description || !date)
    return next(errorHandler(500, "Required Fields Missing"));
  const newTodo = new Todo({
    title,
    description,
    date,
    user: req.user.id,
  });

  try {
    const savedTodo = await newTodo.save();

    res.status(201).json({
      id: savedTodo._id,
      title: savedTodo.title,
      description: savedTodo.description,
      date: savedTodo.date,
    });
  } catch (err) {
    next(errorHandler(500, "Error Saving todos"));
  }
};
