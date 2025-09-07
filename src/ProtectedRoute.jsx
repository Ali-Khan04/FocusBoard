import { Outlet, Navigate } from "react-router-dom";
import { useGlobal } from "./hooks/useGlobal.jsx";

function ProtectedRoute() {
  const { state } = useGlobal();

  return !state.user ? <Navigate to="/signIn" replace /> : <Outlet />;
}

export default ProtectedRoute;
