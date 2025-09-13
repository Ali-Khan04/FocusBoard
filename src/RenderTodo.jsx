import { useState } from "react";
import UserInput from "./userInput";
import "./CSS/renderTodo.css";
import { useGlobal } from "./hooks/useGlobal.jsx";
import { useTodos } from "./hooks/useTodos.jsx";

function RenderTodo() {
  const { state, dispatch } = useGlobal();
  const { loading, error, fetchTodos } = useTodos();
  const [updatingPriority, setUpdatingPriority] = useState({});

  const updateTodoPriority = async (todoId, newPriority) => {
    setUpdatingPriority((prev) => ({ ...prev, [todoId]: true }));

    try {
      const response = await fetch(
        `http://localhost:3000/user/updatePriority/${todoId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ priority: newPriority }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update priority");
      }

      const updatedTodo = await response.json();
      dispatch({
        type: "updateTodoPriority",
        payload: { id: todoId, priority: newPriority },
      });
      //fetch todos for latest re-order
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

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading your todos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={fetchTodos}>Retry</button>
      </div>
    );
  }
  const todos = state.todo;

  return (
    <>
      <div className="input-section">
        <UserInput />
      </div>
      <>
        <div className="welcome-header">
          <h2>
            {!state.user ? (
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
                  <button
                    onClick={() =>
                      dispatch({ type: "delete", payload: item.id })
                    }
                  >
                    Delete
                  </button>
                  <button>Update</button>
                </div>
              </div>
            );
          })}
        </div>
      </>
    </>
  );
}

export default RenderTodo;
