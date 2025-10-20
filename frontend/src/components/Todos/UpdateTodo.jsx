import { useState } from "react";
import { apiRequest } from "../../services/api.js";
import Button from "../shared/Button.jsx";
import "../../CSS/updateTodo.css";
import { useGlobal } from "../../hooks/useGlobal.jsx";

function UpdateTodo({ todo, onClose }) {
  const { state, dispatch } = useGlobal();
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

    if (state.isGuest) {
      dispatch({
        type: "update",
        payload: { id: todo.id, update: formData },
      });
      dispatch({
        type: "successMessage",
        payload: "Todo updated locally!",
      });
      onClose();
      setLoading(false);
      return;
    }

    try {
      const res = await apiRequest(
        `/user/updateTodo/${todo.id}`,
        "PATCH",
        formData
      );
      if (res.success) {
        dispatch({
          type: "successMessage",
          payload: "Todo updated successfully!",
        });
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
