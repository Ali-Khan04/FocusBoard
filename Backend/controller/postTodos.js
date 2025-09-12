import Todo from "../db/TodoSchema.js";
import { errorHandler } from "../utils/customError.js";
export const postTodos = async (req, res, next) => {
  const { title, description, date, priority = "Medium" } = req.body;

  if (!title || !description || !date)
    return next(errorHandler(500, "Required Fields Missing"));

  const newTodo = new Todo({
    title,
    description,
    date,
    priority,
    user: req.user.id,
  });

  try {
    const savedTodo = await newTodo.save();

    res.status(201).json({
      id: savedTodo._id,
      title: savedTodo.title,
      description: savedTodo.description,
      date: savedTodo.date,
      priority: savedTodo.priority,
      completed: savedTodo.completed,
      createdAt: savedTodo.createdAt,
    });
  } catch (err) {
    next(errorHandler(500, "Error Saving todos"));
  }
};

export const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    const formattedTodos = todos.map((todo) => ({
      id: todo._id,
      title: todo.title,
      description: todo.description,
      date: todo.date,
      priority: todo.priority,
      completed: todo.completed,
      createdAt: todo.createdAt,
    }));

    res.status(200).json(formattedTodos);
  } catch (err) {
    next(errorHandler(500, "Error fetching todos"));
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
