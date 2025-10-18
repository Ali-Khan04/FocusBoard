import { useState } from "react";
import { apiRequest } from "../services/api.js";
import Button from "./Button.jsx";
import "../CSS/updateTodo.css";

function UpdateTodo({ todo, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    title: todo.title || "",
    description: todo.description || "",
    dueDate: todo.dueDate
      ? new Date(todo.dueDate).toISOString().split("T")[0]
      : "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequest(
        `/user/updateTodo/${todo.id}`,
        "PATCH",
        formData
      );
      if (res.success) {
        onUpdated(res.todo);
        onClose();
      } else {
        alert(res.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating todo:", err);
      alert("Server error while updating todo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-modal">
      <div className="update-content">
        <h2>Update Todo</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />

          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />

          <div className="update-actions">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateTodo;
