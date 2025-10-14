import "../../../CSS/Analytics.css";

export default function StatsSummary({ todos }) {
  const pending = todos.filter((t) => !t.completed);

  const countByPriority = (priority) =>
    pending.filter((t) => t.priority === priority).length;

  return (
    <div className="stats-summary">
      <div className="stat-card total">
        <h3>{pending.length}</h3>
        <p>Total Pending</p>
      </div>
      <div className="stat-card high">
        <h3>{countByPriority("High")}</h3>
        <p>High Priority</p>
      </div>
      <div className="stat-card medium">
        <h3>{countByPriority("Medium")}</h3>
        <p>Medium Priority</p>
      </div>
      <div className="stat-card low">
        <h3>{countByPriority("Low")}</h3>
        <p>Low Priority</p>
      </div>
    </div>
  );
}
