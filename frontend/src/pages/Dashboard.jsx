import { useState, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import defaultImage from "../assets/imageSkeleton.png";
import "../CSS/Dashboard.css";
import { useGlobal } from "../hooks/useGlobal.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";

function Dashboard() {
  const { state, dispatch } = useGlobal();
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: state.user?.name || "",
    email: state.user?.email || "",
  });
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const imageRef = useRef(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/user/getTodos?limit=1000",
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log("Fetched todos:", data);
        setTodos(data.todos || []);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Process data for charts
  const getPendingTodos = () => {
    return todos.filter((todo) => !todo.completed);
  };

  const getOverdueTodos = () => {
    const now = new Date();
    return todos
      .filter((todo) => {
        if (!todo.dueDate || todo.completed) return false;
        const dueDate = new Date(todo.dueDate);
        return dueDate < now;
      })
      .sort((a, b) => {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .slice(0, 5);
  };

  const getNext7DaysData = () => {
    const pendingTodos = getPendingTodos();
    const next7Days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const dayData = {
        name: dateStr,
        High: 0,
        Medium: 0,
        Low: 0,
      };

      pendingTodos.forEach((todo) => {
        if (!todo.dueDate) return;
        const todoDueDate = new Date(todo.dueDate);
        todoDueDate.setHours(0, 0, 0, 0);

        if (todoDueDate.getTime() === date.getTime()) {
          dayData[todo.priority]++;
        }
      });

      next7Days.push(dayData);
    }

    return next7Days;
  };

  const getPriorityDistribution = () => {
    const pendingTodos = getPendingTodos();
    const distribution = {
      High: 0,
      Medium: 0,
      Low: 0,
    };

    pendingTodos.forEach((todo) => {
      distribution[todo.priority]++;
    });

    return [
      { name: "High Priority", value: distribution.High, priority: "High" },
      {
        name: "Medium Priority",
        value: distribution.Medium,
        priority: "Medium",
      },
      { name: "Low Priority", value: distribution.Low, priority: "Low" },
    ].filter((item) => item.value > 0);
  };

  const COLORS = {
    High: "#ff5252",
    Medium: "#ffa726",
    Low: "#66bb6a",
  };

  const handleInputChange = (e) => {
    setFormData((oldState) => ({
      ...oldState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds the minimum limit");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Invalid file format");
      return;
    }

    setIsUploading(true);
    setImageError(false);

    const reader = new FileReader();
    reader.onload = () => {
      const baseImage = reader.result;
      setImage(baseImage);
      setIsUploading(false);
      setUploaded(true);
      setTimeout(() => {
        setUploaded(false);
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setFormData({
      name: state.user?.name || "",
      email: state.user?.email || "",
    });
    setIsEditing(false);
  };

  const handleMarkDone = async (todoId) => {
    try {
      await fetch(`http://localhost:3000/api/todos/${todoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({ completed: true }),
      });
      // Refresh todos
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoId ? { ...todo, completed: true } : todo
        )
      );
    } catch (error) {
      console.error("Error marking todo as done:", error);
    }
  };

  const chartData = getNext7DaysData();
  const pieData = getPriorityDistribution();
  const overdueTodos = getOverdueTodos();
  const pendingTodos = getPendingTodos();

  return (
    <div className="dasboard-container">
      <button
        onClick={() => dispatch({ type: "logout" })}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 15px",
          backgroundColor: "#ff5252",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Logout
      </button>
      <h1>{state.user.name} Dashboard</h1>

      <div className="analytics-section">
        <h2 style={{ color: "#ff5252", marginBottom: 20 }}>
          Todo Analytics - Pending Tasks
        </h2>

        {loading ? (
          <p>Loading analytics...</p>
        ) : (
          <>
            <div className="stats-summary">
              <div className="stat-card">
                <h3>{pendingTodos.length}</h3>
                <p>Total Pending</p>
              </div>
              <div className="stat-card high">
                <h3>
                  {pendingTodos.filter((t) => t.priority === "High").length}
                </h3>
                <p>High Priority</p>
              </div>
              <div className="stat-card medium">
                <h3>
                  {pendingTodos.filter((t) => t.priority === "Medium").length}
                </h3>
                <p>Medium Priority</p>
              </div>
              <div className="stat-card low">
                <h3>
                  {pendingTodos.filter((t) => t.priority === "Low").length}
                </h3>
                <p>Low Priority</p>
              </div>
            </div>

            <div className="charts-container">
              <div className="chart-wrapper">
                <h3>Pending Todos - Next 7 Days</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    role="img"
                    aria-label="Bar chart showing pending todos for the next 7 days grouped by priority"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="High"
                      stackId="a"
                      fill={COLORS.High}
                      aria-label="High priority todos"
                    />
                    <Bar
                      dataKey="Medium"
                      stackId="a"
                      fill={COLORS.Medium}
                      aria-label="Medium priority todos"
                    />
                    <Bar
                      dataKey="Low"
                      stackId="a"
                      fill={COLORS.Low}
                      aria-label="Low priority todos"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-wrapper">
                <h3>Priority Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart
                    role="img"
                    aria-label="Pie chart showing distribution of pending todos by priority level"
                  >
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[entry.priority]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {overdueTodos.length > 0 && (
              <div className="overdue-section">
                <h3 style={{ color: "#ff5252" }}>
                  ⚠️ Overdue Tasks ({overdueTodos.length})
                </h3>
                <ul className="overdue-list">
                  {overdueTodos.map((todo) => (
                    <li key={todo.id} className="overdue-item">
                      <div className="overdue-content">
                        <span
                          className={`priority-badge ${todo.priority.toLowerCase()}`}
                        >
                          {todo.priority}
                        </span>
                        <div className="overdue-details">
                          <h4>{todo.title}</h4>
                          <p>Due: {todo.dueDate}</p>
                        </div>
                      </div>
                      <div className="overdue-actions">
                        <button
                          className="btn-done"
                          onClick={() => handleMarkDone(todo.id)}
                          aria-label={`Mark ${todo.title} as done`}
                        >
                          ✓ Done
                        </button>
                        <button
                          className="btn-open"
                          onClick={() => {}}
                          aria-label={`Open ${todo.title}`}
                        >
                          Open
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      <div className="user-profile">
        <h3 style={{ color: "#ff5252", marginBottom: 10 }}>Account Settings</h3>
        <div className="user-avatar">
          <div className="avatar-display">
            {!imageError && image ? (
              <img
                src={image}
                alt="profileImage"
                onError={() => setImageError(true)}
              />
            ) : (
              <img src={defaultImage} alt="default " />
            )}

            {isUploading && <p>Loading...</p>}
            {uploaded && !isUploading && <p>Uploaded</p>}
          </div>

          <div className="avatar-input">
            <Input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImage}
              disabled={isUploading}
              ref={imageRef}
            />
            <Button
              onClick={() => {
                if (!isUploading) {
                  imageRef.current.click();
                }
              }}
            >
              Upload
            </Button>
            <div className="user-details">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="user-name">
                  {isEditing ? (
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div>{state.user.name || formData.name}</div>
                  )}
                </div>
                <div className="user-email">
                  {isEditing ? (
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      id="email"
                    />
                  ) : (
                    <div>{state.user.email || formData.email}</div>
                  )}
                </div>
                <div className="form-buttons">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          dispatch({ type: "Update_User", payload: formData });
                        }}
                      >
                        Save
                      </Button>

                      <Button type="button" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => {
                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
