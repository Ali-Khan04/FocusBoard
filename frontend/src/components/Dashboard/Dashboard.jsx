import { useState, useEffect } from "react";
import { useGlobal } from "../../hooks/useGlobal.jsx";
import { useNavigate } from "react-router-dom";
import ChartsContainer from "./Analytics/ChartsContainer.jsx";
import StatsSummary from "./Analytics/StatsSummary.jsx";
import OverdueList from "./Analytics/OverdueList.jsx";
import UserProfile from "./Profile/UserProfile.jsx";
import "../../CSS/mainDashBoard.css";
import { apiRequest } from "../../services/api.js";

export default function Dashboard() {
  const { state, dispatch } = useGlobal();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await apiRequest("/user/getTodos?limit=1000", "GET");
        dispatch({ type: "SET_TODOS", payload: data.todos || [] });
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", "POST");
      dispatch({ type: "logout" });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const todos = state.todo || [];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

        <button
          className="back-btn"
          onClick={() => navigate("/todo")}
          title="Go back to your todo list"
        >
          ← Back to Todos
        </button>
      </div>

      <h1>
        {state.user?.name ? `${state.user.name}'s Dashboard` : "Dashboard"}
      </h1>

      {loading ? (
        <p>Loading analytics...</p>
      ) : todos.length === 0 ? (
        <div className="no-todos-section">
          <p>You have not added any todos yet.</p>
          <p>Add tasks to see your analytics dashboard 📊</p>
        </div>
      ) : (
        <>
          <StatsSummary todos={todos} />
          <ChartsContainer todos={todos} />
          <OverdueList todos={todos} />
        </>
      )}

      <UserProfile />
    </div>
  );
}
