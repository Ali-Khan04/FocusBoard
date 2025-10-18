import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getPriorityDistribution } from "../utils/chartUtils.js";
import "../../../CSS/Analytics.css";

export default function PieChartTodos({ todos }) {
  const data = getPriorityDistribution(todos);
  return (
    <div className="chart-wrapper">
      <h3>Priority Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
