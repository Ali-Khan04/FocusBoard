import mongoose from "mongoose";
import Todo from "../db/TodoSchema.js";
import { errorHandler } from "../utils/customError.js";

export const postTodos = async (req, res, next) => {
  try {
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

    const newTodo = new Todo({
      title: title.trim(),
      description: description.trim(),
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
    console.error("Error saving todo:", err.message);
    return next(errorHandler(500, "Internal server error while saving todo"));
  }
};

export const updateTodoPriority = async (req, res, next) => {
  try {
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

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, user: userId },
      { priority },
      { new: true }
    );

    if (!updatedTodo) {
      return next(errorHandler(404, "Todo not found or unauthorized"));
    }

    return res.status(200).json({
      message: "Priority updated successfully",
      todo: {
        id: updatedTodo._id,
        title: updatedTodo.title,
        description: updatedTodo.description,
        priority: updatedTodo.priority,
        completed: updatedTodo.completed,
        dueDate: updatedTodo.dueDate,
        updatedAt: updatedTodo.updatedAt,
      },
    });
  } catch (err) {
    console.error("Error updating priority:", err);
    return next(errorHandler(500, "Server error while updating priority"));
  }
};
