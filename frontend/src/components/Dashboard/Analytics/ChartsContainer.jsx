import BarChartTodos from "./BarChartTodos.jsx";
import PieChartTodos from "./PieChartTodos.jsx";
import "../../../CSS/Analytics.css";

export default function ChartsContainer({ todos }) {
  return (
    <div className="charts-container">
      <BarChartTodos todos={todos} />
      <PieChartTodos todos={todos} />
    </div>
  );
}
