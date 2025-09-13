import Todo from "../db/TodoSchema.js";
import { errorHandler } from "../utils/customError.js";

export const getTodos = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const priorityOrder = { High: 1, Medium: 2, Low: 3 };

    // Fetch todos sorted by priority
    const todos = await Todo.find({ user: userId })
      .sort({
        priority: 1,
        createdAt: -1,
      })
      .skip(page * limit)
      .limit(limit);

    const sortedTodos = todos.sort((a, b) => {
      const aPriority = priorityOrder[a.priority] || 2;
      const bPriority = priorityOrder[b.priority] || 2;
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      // If priorities are same then sort by creation date
      return b.createdAt - a.createdAt;
    });

    const totalTodos = await Todo.countDocuments({ user: userId });
    const formattedTodos = sortedTodos.map((todo) => ({
      id: todo._id,
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      completed: todo.completed,
      dueDate: todo.dueDate
        ? todo.dueDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : null,
      createdAt: todo.createdAt.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      updatedAt: todo.updatedAt.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    res.status(200).json({
      todos: formattedTodos,
      totalPages: Math.ceil(totalTodos / limit),
      currentPage: page,
      totalTodos,
    });
  } catch (err) {
    next(errorHandler(500, "Error fetching todos"));
  }
};
