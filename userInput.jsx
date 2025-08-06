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
  const handleSubmit = (event) => {
    event.preventDefault();
    const todos = {
      title,
      description,
      date,
    };
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
          <input type="text" value={title} onChange={handleTitle} />
          <label>Description</label>
          <input type="text" value={description} onChange={handleDescription} />
          <label>Date</label>
          <input type="Date" value={date} onChange={handleDate} />
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  );
}

export default UserInput;
