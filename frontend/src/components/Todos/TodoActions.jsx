import Button from "../Button.jsx";
import { apiRequest } from "../../services/api.js";
import "../../CSS/renderTodo.css";

export default function TodoActions({ item, dispatch, state, setEditingTodo }) {
  const isCompleted = state.completed?.some((t) => t.id === item.id);

  const deleteTodo = async (todoId) => {
    if (state.isGuest) {
      dispatch({ type: "delete", payload: todoId });
      return;
    }
    await apiRequest(`/user/deleteTodo/${todoId}`, "DELETE");
    dispatch({
      type: "SET_TODOS",
      payload: state.todo.filter((t) => t.id !== todoId),
    });
  };

  const markDone = async (todoId) => {
    if (state.isGuest) {
      dispatch({ type: "markDone", payload: todoId });
      return;
    }
    await apiRequest(`/user/markDone/${todoId}`, "PATCH");
    dispatch({
      type: "SET_TODOS",
      payload: state.todo.filter((t) => t.id !== todoId),
    });
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
