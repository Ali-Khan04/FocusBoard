import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CSS/userInput.css";
import { useGlobal } from "./hooks/useGlobal";
import { useTodos } from "./hooks/useTodos";

function UserInput() {
  const { state, dispatch } = useGlobal();
  const { fetchTodos } = useTodos();
  const [selectedPriority, setSelectedPriority] = useState("Medium");

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    dispatch({
      type: "userInput",
      payload: { id: "dueDate", value: today },
    });
  }, []);

  const handleUserInput = (e) => {
    dispatch({
      type: "userInput",
      payload: { id: e.target.id, value: e.target.value },
    });
  };

  const sortTodosByPriority = () => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    const sortedTodos = [...state.todo].sort((a, b) => {
      const aPriority = priorityOrder[a.priority] || 2;
      const bPriority = priorityOrder[b.priority] || 2;
      return aPriority - bPriority;
    });
    dispatch({ type: "SET_TODOS", payload: sortedTodos });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { title, description, dueDate } = state.userInput;

    if (!title.trim() || !description.trim()) {
      dispatch({
        type: "errorMessage",
        payload: "Please fill in all fields",
      });
      return;
    }
    if (state.isGuest || !state.user) {
      const newTodo = {
        id: Date.now() + Math.random(),
        title: title.trim(),
        description: description.trim(),
        dueDate,
        priority: selectedPriority || "Medium",
        createdAt: new Date().toLocaleDateString(),
      };

      dispatch({ type: "todo", payload: newTodo });
      sortTodosByPriority();

      dispatch({
        type: "successMessage",
        payload: "Todo added locally!",
      });
      dispatch({ type: "reset" });
      setSelectedPriority("Medium");

      // Reset date to today after submission
      const today = new Date().toISOString().split("T")[0];
      dispatch({
        type: "userInput",
        payload: { id: "dueDate", value: today },
      });
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/user/saveTodos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          dueDate,
          priority: selectedPriority || "Medium",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save todo");
      }

      const savedTodo = await response.json();
      dispatch({
        type: "todo",
        payload: {
          ...savedTodo,
          id: savedTodo.id,
        },
      });

      await fetchTodos();

      dispatch({
        type: "successMessage",
        payload: "Todo saved to your account!",
      });
      dispatch({ type: "reset" });
      setSelectedPriority("Medium");

      // Reset date to today after submission
      const today = new Date().toISOString().split("T")[0];
      dispatch({
        type: "userInput",
        payload: { id: "dueDate", value: today },
      });
    } catch (err) {
      console.error("Error saving todo:", err);
      dispatch({
        type: "errorMessage",
        payload: "Failed to save todo. Please try again.",
      });
    }
  };

  return (
    <div className="input-container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            type="text"
            value={state.userInput.title}
            onChange={handleUserInput}
            id="title"
            maxLength={30}
            required
          />
          <label>Description</label>
          <textarea
            required
            placeholder="Description"
            value={state.userInput.description}
            onChange={handleUserInput}
            id="description"
            rows="5"
            maxLength={500}
          />
          <label>Due Date</label>
          <input
            type="date"
            value={state.userInput.dueDate}
            onChange={handleUserInput}
            id="dueDate"
            min={new Date().toISOString().split("T")[0]}
            required
          />

          <label>Priority</label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginBottom: "10px",
            }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button type="submit">Add Todo</button>

          {state.isGuest && (
            <p
              style={{
                fontSize: "12px",
                color: "#6c757d",
                textAlign: "center",
                marginTop: "8px",
              }}
            >
              📝 Guest Mode - Todos stored locally
            </p>
          )}

          <Link
            to="/dashboard"
            style={{
              color: "#ff5252",
              textDecoration: "none",
              fontWeight: "bold",
              textAlign: "center",
              display: "block",
              marginTop: "10px",
            }}
          >
            Go to Dashboard
          </Link>
        </form>
        {state.flowMessage && (
          <p
            className={
              state.messageType === "error"
                ? "error-message"
                : "success-message"
            }
            style={{
              marginTop: "10px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {state.flowMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default UserInput;
