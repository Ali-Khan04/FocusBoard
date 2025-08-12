import { useState } from "react";
import "./CSS/userInput.css";
function UserInput({ getTodo }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const handleTitle = (event) => {
    setTitle(event.target.value);
  };
  const handleDescription = (event) => {
    setDescription(event.target.value);
  };
  const handleDate = (event) => {
    setDate(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const todos = {
      title,
      description,
      date,
    };
    try {
      await fetch("http://localhost:3000/user/saveTodos", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(todos),
      });
    } catch (err) {
      console.error("Error saving todo:", err);
    }
    getTodo(todos);
    setTitle("");
    setDescription("");
    setDate("");
  };
  return (
    <div className="input container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input type="text" value={title} onChange={handleTitle} required />
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={handleDescription}
            required
          />
          <label>Date</label>
          <input type="Date" value={date} onChange={handleDate} required />
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  );
}

export default UserInput;
