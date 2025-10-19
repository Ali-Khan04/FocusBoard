import { errorHandler } from "../utils/customError.js";
import Todo from "../db/TodoSchema.js";

export const editTodo = {
  updateTodo: async (req, res, next) => {
    const { userId, todoId, title, description, dueDate } = req;
    try {
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
    const { userId, todoId } = req;
    try {
      await Todo.updateOne({ _id: todoId, user: userId }, { completed: true });
      res.status(200).json({ success: true, message: "Todo Marked As Done!" });
    } catch (error) {
      next(errorHandler(500, "Internal Server Error while marking todo done"));
    }
  },

  deleteTodo: async (req, res, next) => {
    const { userId, todoId } = req;
    try {
      await Todo.deleteOne({ _id: todoId, user: userId });
      res
        .status(200)
        .json({ success: true, message: "Todo Deleted Successfully" });
    } catch (error) {
      next(errorHandler(500, "Internal Server Error while Deleting Todo"));
    }
  },
  updateTodoPriority: async (req, res, next) => {
    const { userId, todoId, priority } = req;
    try {
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
  },
};
