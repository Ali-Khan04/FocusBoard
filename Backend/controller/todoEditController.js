import mongoose from "mongoose";
import { errorHandler } from "../utils/customError.js";
import Todo from "../db/TodoSchema.js";
import User from "../db/userSchema.js";
export const editTodo = {
  updateTodo: async (req, res, next) => {
    try {
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

      const updatedTodo = await Todo.findOneAndUpdate(
        { _id: todoId, user: userId },
        { title, description, dueDate },
        { new: true, runValidators: true }
      );

      if (!updatedTodo)
        return next(errorHandler(404, "Todo not found or unauthorized"));

      res.status(200).json({
        success: true,
        message: "Todo updated successfully!",
        todo: {
          id: updatedTodo._id,
          title: updatedTodo.title,
          description: updatedTodo.description,
          dueDate: updatedTodo.dueDate,
          priority: updatedTodo.priority,
          completed: updatedTodo.completed,
          updatedAt: updatedTodo.updatedAt,
        },
      });
    } catch (error) {
      next(errorHandler(500, "Internal server error while updating todo"));
    }
  },
  markAsDone: async (req, res, next) => {
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
      await Todo.updateOne({ _id: todoId, user: userId }, { completed: true });
      res.status(200).json({ success: true, message: "Todo Marked As Done!" });
    } catch (error) {
      next(errorHandler(500, "Internal Server Error while marking todo done"));
    }
  },
  deleteTodo: async (req, res, next) => {
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
      await Todo.deleteOne({ _id: todoId, user: userId });
      res
        .status(200)
        .json({ success: true, message: "Todo Deleted Successfully" });
    } catch (error) {
      next(errorHandler(500, "Internal Server Error while Deleting Todo"));
    }
  },
};
