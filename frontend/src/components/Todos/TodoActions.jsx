import Button from "../shared/Button.jsx";
import { apiRequest } from "../../services/api.js";
import "../../CSS/renderTodo.css";
import { useGlobal } from "../../hooks/useGlobal.jsx";

export default function TodoActions({ item, dispatch, state, setEditingTodo }) {
  const { dispatch: globalDispatch } = useGlobal();
  const isCompleted = state.completed?.some((t) => t.id === item.id);

  const clearFlowMessage = (delay = 2000) => {
    setTimeout(() => {
      globalDispatch({ type: "clearMessage" });
    }, delay);
  };

  const deleteTodo = async (todoId) => {
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
    } catch (err) {
      console.error("Delete error:", err);
      globalDispatch({
        type: "errorMessage",
        payload: "Failed to delete todo. Please try again.",
      });
    } finally {
      clearFlowMessage();
    }
  };

  const markDone = async (todoId) => {
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
    } catch (err) {
      console.error("Mark Done error:", err);
      globalDispatch({
        type: "errorMessage",
        payload: "Failed to mark todo as done. Please try again.",
      });
    } finally {
      clearFlowMessage();
    }
  };

  return (
    <div className="edit-buttons">
      <Button onClick={() => deleteTodo(item.id)} disabled={isCompleted}>
        Delete
      </Button>
      <Button onClick={() => setEditingTodo(item)} disabled={isCompleted}>
        Update
      </Button>
      <Button
        style={{ backgroundColor: "blue" }}
        onClick={() => markDone(item.id)}
        disabled={isCompleted}
      >
        Mark Done
      </Button>
    </div>
  );
}
