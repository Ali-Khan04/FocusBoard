import { getOverdueTodos } from "../utils/chartUtils.js";
import "../../../CSS/Analytics.css";

export default function OverdueList({ todos }) {
  const overdue = getOverdueTodos(todos);
  if (!overdue.length) return null;

  return (
    <div className="overdue-section">
      <h3>⚠️ Overdue Tasks ({overdue.length})</h3>
      <ul className="overdue-list">
        {overdue.map((t) => (
          <li key={t.id} className="overdue-item">
            <span className={`priority-badge ${t.priority.toLowerCase()}`}>
              {t.priority}
            </span>
            <div>
              <h4>{t.title}</h4>
              <p>Due: {t.dueDate}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
