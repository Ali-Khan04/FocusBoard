import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getNext7DaysData } from "../utils/chartUtils.js";
import "../../../CSS/Analytics.css";

export default function BarChartTodos({ todos }) {
  const data = getNext7DaysData(todos);
  return (
    <div className="chart-wrapper">
      <h3>Pending Todos - Next 7 Days</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="High" stackId="a" fill="#ff5252" />
          <Bar dataKey="Medium" stackId="a" fill="#ffa726" />
          <Bar dataKey="Low" stackId="a" fill="#66bb6a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
