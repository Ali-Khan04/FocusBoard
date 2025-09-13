import Todo from "../db/TodoSchema.js";
import { errorHandler } from "../utils/customError.js";
export const postTodos = async (req, res, next) => {
  const { title, description, dueDate, priority = "Medium" } = req.body;

  if (!title || !description || !dueDate)
    return next(errorHandler(500, "Required Fields Missing"));
  const newTodo = new Todo({
    title,
    description,
    dueDate,
    priority,
    user: req.user.id,
  });

  try {
    const savedTodo = await newTodo.save();

    res.status(201).json({
      id: savedTodo._id,
      title: savedTodo.title,
      description: savedTodo.description,
      dueDate: savedTodo.dueDate,
      priority: savedTodo.priority,
      completed: savedTodo.completed,
      createdAt: savedTodo.createdAt,
    });
  } catch (err) {
    next(errorHandler(500, "Error Saving todos"));
  }
};

export const updateTodoPriority = async (req, res, next) => {
  const { todoId } = req.params;
  const { priority } = req.body;

  if (!["Low", "Medium", "High"].includes(priority)) {
    return next(errorHandler(400, "Invalid priority value"));
  }

  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, user: req.user.id },
      { priority },
      { new: true }
    );

    if (!updatedTodo) {
      return next(errorHandler(404, "Todo not found"));
    }

    res.status(200).json({
      id: updatedTodo._id,
      priority: updatedTodo.priority,
    });
  } catch (err) {
    next(errorHandler(500, "Error updating todo priority"));
  }
};
