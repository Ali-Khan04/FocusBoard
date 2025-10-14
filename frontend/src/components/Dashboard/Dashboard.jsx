import { useState, useEffect } from "react";
import { useGlobal } from "../../hooks/useGlobal.jsx";
import ChartsContainer from "./Analytics/ChartsContainer.jsx";
import StatsSummary from "./Analytics/StatsSummary.jsx";
import OverdueList from "./Analytics/OverdueList.jsx";
import UserProfile from "./Profile/UserProfile.jsx";
import "../../CSS/mainDashBoard.css";

export default function Dashboard() {
  const { state, dispatch } = useGlobal();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/user/getTodos?limit=1000",
          { credentials: "include" }
        );
        const data = await response.json();
        setTodos(data.todos || []);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleLogout = () => {
    dispatch({ type: "logout" });
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
