import User from "../db/userSchema.js";
import Todo from "../db/TodoSchema.js";
import { errorHandler } from "../utils/customError.js";
import mongoose from "mongoose";

export const todoDataValidator = {
  validateGetUser: async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      return next(errorHandler(400, "User ID not found"));
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(errorHandler(400, "Invalid ID format"));
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return next(errorHandler(401, "User not found, not authenticated"));
    }

    req.userId = userId;
    next();
  },

  validatePostUser: (req, res, next) => {
    const { title, description, dueDate, priority = "Medium" } = req.body;
    const userId = req.user?.id;

    if (!userId) return next(errorHandler(401, "User not authenticated"));

    if (!mongoose.Types.ObjectId.isValid(userId))
      return next(errorHandler(400, "Invalid todo ID format"));
    if (!title?.trim()) return next(errorHandler(400, "Title is required"));
    if (!description?.trim())
      return next(errorHandler(400, "Description is required"));
    if (!dueDate) return next(errorHandler(400, "Due date is required"));

    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime()))
      return next(errorHandler(400, "Invalid due date format"));

    const validPriorities = ["High", "Medium", "Low"];
    if (!validPriorities.includes(priority))
      return next(errorHandler(400, "Invalid priority value"));
    req.userId = userId;
    req.title = title.toString().trim();
    req.description = description.toString().trim();
    req.parsedDate = parsedDate;
    req.priority = priority;
    next();
  },

  validatepriority: (req, res, next) => {
    const { todoId } = req.params;
    const { priority } = req.body;
    const userId = req.user?.id;

    if (!todoId) return next(errorHandler(400, "Missing todo ID"));
    if (!userId) return next(errorHandler(401, "User not authenticated"));
    if (
      !mongoose.Types.ObjectId.isValid(todoId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    )
      return next(errorHandler(400, "Invalid IDs format"));

    const validPriorities = ["Low", "Medium", "High"];
    if (!validPriorities.includes(priority)) {
      return next(errorHandler(400, "Invalid priority value"));
    }
    req.todoId = todoId;
    req.priority = priority;
    req.userId = userId;
    next();
  },

  validateUpdateTodo: async (req, res, next) => {
    const { title, description, dueDate } = req.body;
    const { todoId } = req.params;
    const userId = req.user?.id;

    if (!todoId || !userId)
      return next(errorHandler(400, "Todo ID or User ID missing"));
    if (
      !mongoose.Types.ObjectId.isValid(todoId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    )
      return next(errorHandler(400, "Invalid ObjectId format"));
    if (title !== undefined && !title.trim())
      return next(errorHandler(400, "Title cannot be empty"));
    if (description !== undefined && !description.trim())
      return next(errorHandler(400, "Description cannot be empty"));
    if (dueDate && isNaN(new Date(dueDate)))
      return next(errorHandler(400, "Invalid due date format"));
    try {
      const userExists = await User.findById(userId);
      if (!userExists) return next(errorHandler(404, "User not Authenticated"));
    } catch (error) {
      next(
        errorHandler(
          500,
          "Internal Server Error while running validation for update todo"
        )
      );
    }
    req.userId = userId;
    req.todoId = todoId;
    req.title = title;
    req.description = description;
    req.dueDate = dueDate;
    next();
  },

  validateDeleteTodo: async (req, res, next) => {
    const { todoId } = req.params;
    const userId = req.user?.id;
    if (!userId || !todoId) {
      return next(errorHandler(400, "Ids Missing"));
    }
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(todoId)
    ) {
      return next(errorHandler(400, "Invalid Ids Types"));
    }
    try {
      const userExists = await User.findById(userId);
      if (!userExists) return next(errorHandler(404, "User not Authenticated"));
      const todoExists = await Todo.findById(todoId);
      if (!todoExists) return next(errorHandler(404, "Todo Not Found"));
    } catch (error) {
      next(
        errorHandler(
          500,
          "Internal Server Error while running validation for delete todo"
        )
      );
    }
    req.userId = userId;
    req.todoId = todoId;
    next();
  },

  validateMarkTodo: async (req, res, next) => {
    const { todoId } = req.params;
    const userId = req.user?.id;
    if (!userId || !todoId) {
      return next(errorHandler(400, "Rerquired fields Missing"));
    }
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(todoId)
    ) {
      return next(errorHandler(400, "Invalid Object Id"));
    }
    try {
      const userExists = await User.findById(userId);
      if (!userExists) return next(errorHandler(404, "User not Authenticated"));
      const todoExists = await Todo.findById(todoId);
      if (!todoExists) return next(errorHandler(404, "Todo Not Found"));
    } catch (error) {
      next(
        errorHandler(
          500,
          "Internal Server Error while running validation for mark as complete todo"
        )
      );
    }
    req.userId = userId;
    req.todoId = todoId;
    next();
  },
};
