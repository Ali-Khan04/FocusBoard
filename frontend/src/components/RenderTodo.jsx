import { useState } from "react";
import UserInput from "./userInput.jsx";
import "../CSS/renderTodo.css";
import { useGlobal } from "../hooks/useGlobal.jsx";
import { useTodos } from "../hooks/useTodos.jsx";
import Button from "./Button.jsx";
import { apiRequest } from "../services/api.js";
import UpdateTodo from "./UpdateTodo.jsx";

function RenderTodo() {
  const { state, dispatch } = useGlobal();
  const { loading, error, fetchTodos } = useTodos();
  const [updatingPriority, setUpdatingPriority] = useState({});
  const [editingTodo, setEditingTodo] = useState(null);

  const updateTodoPriority = async (todoId, newPriority) => {
    // for guest mode
    if (state.isGuest) {
      dispatch({
        type: "updateTodoPriority",
        payload: { id: todoId, priority: newPriority },
      });

      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      const sortedTodos = [...state.todo].sort((a, b) => {
        const aPriority = priorityOrder[a.priority] || 2;
        const bPriority = priorityOrder[b.priority] || 2;
        return aPriority - bPriority;
      });
      dispatch({ type: "SET_TODOS", payload: sortedTodos });

      return;
    }

    setUpdatingPriority((prev) => ({ ...prev, [todoId]: true }));

    try {
      await apiRequest(`/user/updatePriority/${todoId}`, "PATCH", {
        priority: newPriority,
      });

      dispatch({
        type: "updateTodoPriority",
        payload: { id: todoId, priority: newPriority },
      });

      // Fetch todos for immdediate re-order
      await fetchTodos();
    } catch (error) {
      console.error("Error updating priority:", error);
      alert("Failed to update priority. Please try again.");
    } finally {
      setUpdatingPriority((prev) => ({ ...prev, [todoId]: false }));
    }
  };

  const handlePriorityChange = (todoId, newPriority) => {
    updateTodoPriority(todoId, newPriority);
  };

  const handleTodoUpdated = (updatedTodo) => {
    dispatch({
      type: "SET_TODOS",
      payload: state.todo.map((t) =>
        t.id === updatedTodo.id ? updatedTodo : t
      ),
    });
  };

  const markTodoAsDone = async (todoId) => {
    if (state.isGuest) {
      dispatch({
        type: "delete",
        payload: todoId,
      });
      return;
    }

    try {
      const response = await apiRequest(`/user/markDone/${todoId}`, "PATCH");

      if (response.success) {
        dispatch({
          type: "SET_TODOS",
          payload: state.todo.filter((t) => t.id !== todoId),
        });

        alert("Todo marked as done!");
      } else {
        alert("Failed to mark todo as done.");
      }
    } catch (error) {
      console.error("Error marking todo as done:", error);
      alert("An error occurred while marking todo done.");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#ff5252";
      case "Medium":
        return "#ff9800";
      case "Low":
        return "#4caf50";
      default:
        return "#757575";
    }
  };

  if (loading && !state.isGuest) {
    return (
      <div className="loading-container">
        <p>Loading your todos...</p>
      </div>
    );
  }

  if (error && !state.isGuest) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={fetchTodos}>Retry</button>
      </div>
    );
  }

  const todos = state.todo;
  const deleteTodo = async (todoId) => {
    // Guest mode to delete locally
    if (state.isGuest) {
      dispatch({ type: "delete", payload: todoId });
      return;
    }

    try {
      const response = await apiRequest(`/user/deleteTodo/${todoId}`, "DELETE");

      if (response.success) {
        dispatch({
          type: "SET_TODOS",
          payload: state.todo.filter((t) => t.id !== todoId),
        });
        alert("Todo deleted successfully!");
      } else {
        alert("Failed to delete todo.");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("An error occurred while deleting todo.");
    }
  };

  return (
    <>
      <div className="input-section">
        <UserInput />
      </div>
      <>
        <div className="welcome-header">
          <h2>
            {state.isGuest ? (
              <>
                Welcome, Guest! 👋
                <span
                  style={{
                    fontSize: "14px",
                    display: "block",
                    marginTop: "8px",
                    color: "#666",
                  }}
                >
                  Your todos are stored locally
                </span>
              </>
            ) : !state.user ? (
              "Sign In for more functionality"
            ) : (
              <>
                Welcome back,
                <span> {state.user.name}</span> 👋
              </>
            )}
          </h2>
          <p>
            {todos.length > 0
              ? "Here are your todos (sorted by priority):"
              : "Add todos to get started!"}
          </p>
        </div>
        <div className="render-container">
          {todos.map((item) => {
            const itemPriority = item.priority || "Medium";
            const isUpdating = updatingPriority[item.id];

            return (
              <div
                key={item.id}
                className="todo-container"
                style={{
                  borderLeft: `4px solid ${getPriorityColor(itemPriority)}`,
                  opacity: isUpdating ? 0.7 : 1,
                }}
              >
                <div className="todo-header">
                  <h1>{item.title}</h1>
                  <span
                    className="priority-badge"
                    style={{
                      backgroundColor: getPriorityColor(itemPriority),
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {itemPriority}
                  </span>
                </div>
                <p>{item.description}</p>
                <p>Due: {item.dueDate}</p>
                {item.createdAt && (
                  <p style={{ fontSize: "12px", color: "#666" }}>
                    Created: {item.createdAt}
                  </p>
                )}

                <div className="priority-section">
                  <label>Change Priority:</label>
                  <select
                    value={itemPriority}
                    onChange={(e) =>
                      handlePriorityChange(item.id, e.target.value)
                    }
                    disabled={isUpdating}
                    style={{
                      borderColor: getPriorityColor(itemPriority),
                      cursor: isUpdating ? "not-allowed" : "pointer",
                    }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  {isUpdating && (
                    <span className="updating-text">Updating...</span>
                  )}
                </div>

                <div className="edit-buttons">
                  <Button onClick={() => deleteTodo(item.id)}>Delete</Button>
                  <Button onClick={() => setEditingTodo(item)}>Update</Button>
                  <Button
                    style={{ backgroundColor: "blue" }}
                    onClick={() => markTodoAsDone(item.id)}
                  >
                    Mark Done
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        {editingTodo && (
          <UpdateTodo
            todo={editingTodo}
            onClose={() => setEditingTodo(null)}
            onUpdated={handleTodoUpdated}
          />
        )}
      </>
    </>
  );
}

export default RenderTodo;
