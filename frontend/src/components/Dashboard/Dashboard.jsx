import { useState, useEffect } from "react";
import { useGlobal } from "../../hooks/useGlobal.jsx";
import ChartsContainer from "./Analytics/ChartsContainer.jsx";
import StatsSummary from "./Analytics/StatsSummary.jsx";
import OverdueList from "./Analytics/OverdueList.jsx";
import UserProfile from "./Profile/UserProfile.jsx";
import "../../CSS/mainDashBoard.css";
import { apiRequest } from "../../services/api.js";

export default function Dashboard() {
  const { state, dispatch } = useGlobal();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await apiRequest("/user/getTodos?limit=1000", "GET");
        setTodos(data.todos || []);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", "POST");
      dispatch({ type: "logout" });
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Error logging out. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <h1>{state.user?.name}'s Dashboard</h1>

      {loading ? (
        <p>Loading analytics...</p>
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
