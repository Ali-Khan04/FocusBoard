import { Link } from "react-router-dom";
import "./CSS/userInput.css";
import { useGlobal } from "./hooks/useGlobal";

function UserInput() {
  const { state, dispatch } = useGlobal();
  const handleUserInput = (e) => {
    dispatch({
      type: "userInput",
      payload: { id: e.target.id, value: e.target.value },
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { title, description, date } = state.userInput;
    dispatch({
      type: "todo",
      payload: {
        title: title,
        description: description,
        date: date,
      },
    });
    try {
      await fetch("http://localhost:3000/user/saveTodos", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title, description, date }),
        credentials: "include",
      });
    } catch (err) {
      console.error("Error saving todo:", err);
    }
    dispatch({ type: "reset" });
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
            type="Date"
            value={state.userInput.date}
            onChange={handleUserInput}
            id="date"
            required
          />
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
