import { fetchTodos } from "../services/todoService.js";
import { formatTodos } from "../utils/formatTodo.js";
import { errorHandler } from "../utils/customError.js";
import Todo from "../db/TodoSchema.js";

export const todoPrimaryController = {
  postTodos: async (req, res, next) => {
    const { title, description, priority, parsedDate, userId } = req;

    try {
      const newTodo = new Todo({
        title,
        description,
        dueDate: parsedDate,
        priority,
        user: userId,
      });

      const savedTodo = await newTodo.save();

      return res.status(201).json({
        id: savedTodo._id,
        title: savedTodo.title,
        description: savedTodo.description,
        dueDate: savedTodo.dueDate,
        priority: savedTodo.priority,
        completed: savedTodo.completed,
        createdAt: savedTodo.createdAt,
      });
    } catch (err) {
      console.error("Error saving todo:", err);
      return next(errorHandler(500, "Internal server error while saving todo"));
    }
  },

  getTodos: async (req, res, next) => {
    try {
      const userId = req.userId;
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;

      const { sortedTodos, totalTodos } = await fetchTodos(userId, page, limit);
      const formattedTodos = formatTodos(sortedTodos);

      res.status(200).json({
        todos: formattedTodos,
        totalPages: Math.ceil(totalTodos / limit),
        currentPage: page,
        totalTodos,
      });
    } catch (err) {
      next(errorHandler(500, "Error fetching todos"));
    }
  },
};
