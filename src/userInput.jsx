import { useState } from "react";
import { Link } from "react-router-dom";
import "./CSS/userInput.css";
import { useGlobal } from "./hooks/useGlobal";

function UserInput() {
  const { state, dispatch } = useGlobal();
  const [selectedPriority, setSelectedPriority] = useState("Medium");

  const handleUserInput = (e) => {
    dispatch({
      type: "userInput",
      payload: { id: e.target.id, value: e.target.value },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { title, description, date } = state.userInput;

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
          date,
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
      dispatch({
        type: "successMessage",
        payload: "Todo added successfully!",
      });
      dispatch({ type: "reset" });
      setSelectedPriority("Medium");
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
          />
          <label>Date</label>
          <input
            type="date"
            value={state.userInput.date}
            onChange={handleUserInput}
            id="date"
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
          <button type="submit">Add</button>
          <Link
            to="/dashboard"
            style={{
              color: "#ff5252",
              textDecoration: "none",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Go to Dashboard
          </Link>
        </form>
      </div>
    </div>
  );
}

export default UserInput;
