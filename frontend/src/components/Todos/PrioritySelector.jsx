import { useState } from "react";
import { apiRequest } from "../../services/api.js";
import "../../CSS/renderTodo.css";

export default function PrioritySelector({
  item,
  dispatch,
  fetchTodos,
  state,
}) {
  const [loading, setLoading] = useState(false);

  const handlePriorityChange = async (e) => {
    const newPriority = e.target.value;
    setLoading(true);

    try {
      await apiRequest(`/user/updatePriority/${item.id}`, "PATCH", {
        priority: newPriority,
      });

      dispatch({
        type: "updateTodoPriority",
        payload: { id: item.id, priority: newPriority },
      });

      await fetchTodos();
    } catch (error) {
      console.error("Error updating priority:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="priority-section">
      <label>Change Priority:</label>
      <select
        value={item.priority || "Medium"}
        onChange={handlePriorityChange}
        disabled={loading}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      {loading && <span className="updating-text">Updating...</span>}
    </div>
  );
}
