import { useState } from "react";
import Button from "../shared/Button.jsx";
import { apiRequest } from "../../services/api.js";
import "../../CSS/renderTodo.css";
import { useGlobal } from "../../hooks/useGlobal.jsx";

export default function TodoActions({ item, dispatch, state, setEditingTodo }) {
  const { dispatch: globalDispatch } = useGlobal();
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [loadingDoneId, setLoadingDoneId] = useState(null);
  const isCompleted = state.completed?.some((t) => t.id === item.id);

  const clearFlowMessage = (delay = 2000) => {
    setTimeout(() => {
      globalDispatch({ type: "clearMessage" });
    }, delay);
  };

  const deleteTodo = async (todoId) => {
    setLoadingDeleteId(todoId);
    try {
      if (state.isGuest) {
        dispatch({ type: "delete", payload: todoId });
        globalDispatch({
          type: "successMessage",
          payload: "Todo deleted locally!",
        });
        clearFlowMessage();
        return;
      }

      await apiRequest(`/user/deleteTodo/${todoId}`, "DELETE");
      dispatch({
        type: "SET_TODOS",
        payload: state.todo.filter((t) => t.id !== todoId),
      });
      globalDispatch({
        type: "successMessage",
        payload: "Todo deleted successfully!",
      });
    } catch {
      globalDispatch({
        type: "errorMessage",
        payload: "Failed to delete todo. Please try again.",
      });
    } finally {
      setLoadingDeleteId(null);
      clearFlowMessage();
    }
  };

  const markDone = async (todoId) => {
    setLoadingDoneId(todoId);
    try {
      if (state.isGuest) {
        dispatch({ type: "markDone", payload: todoId });
        globalDispatch({
          type: "successMessage",
          payload: "Todo marked as done locally!",
        });
        clearFlowMessage();
        return;
      }

      await apiRequest(`/user/markDone/${todoId}`, "PATCH");
      dispatch({
        type: "SET_TODOS",
        payload: state.todo.filter((t) => t.id !== todoId),
      });
      globalDispatch({
        type: "successMessage",
        payload: "Todo marked as done successfully!",
      });
    } catch {
      globalDispatch({
        type: "errorMessage",
        payload: "Failed to mark todo as done. Please try again.",
      });
    } finally {
      setLoadingDoneId(null);
      clearFlowMessage();
    }
  };

  return (
    <div className="edit-buttons">
      <Button
        className={loadingDeleteId === item.id ? "delete-loading" : undefined}
        onClick={() => deleteTodo(item.id)}
        disabled={
          isCompleted ||
          loadingDeleteId === item.id ||
          loadingDoneId === item.id
        }
      >
        Delete
      </Button>

      <Button
        onClick={() => setEditingTodo(item)}
        disabled={
          isCompleted ||
          loadingDeleteId === item.id ||
          loadingDoneId === item.id
        }
      >
        Update
      </Button>

      <Button
        className={loadingDoneId === item.id ? "delete-loading" : undefined}
        style={{ backgroundColor: "blue" }}
        onClick={() => markDone(item.id)}
        disabled={
          isCompleted ||
          loadingDoneId === item.id ||
          loadingDeleteId === item.id
        }
      >
        Mark Done
      </Button>
    </div>
  );
}
