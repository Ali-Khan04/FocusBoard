import Todo from "../db/TodoSchema.js";
import { errorHandler } from "../utils/customError.js";

export const getTodos = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 0;
    const limit = 10;

    const todos = await Todo.find({ user: userId }, "title description date")
      .sort({ date: -1 })
      .skip(page * limit)
      .limit(limit);

    const totalTodos = await Todo.countDocuments({ user: userId });

    res.status(200).json({
      todos: todos || [],
      totalPages: Math.ceil(totalTodos / limit),
      currentPage: page,
      totalTodos: totalTodos,
    });
  } catch (err) {
    next(errorHandler(500, "Error fetching todos"));
  }
};
