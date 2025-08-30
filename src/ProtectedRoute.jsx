import { Outlet, Navigate } from "react-router-dom";
import { useGlobal } from "./context/useGlobal";

function ProtectedRoute() {
  const { state } = useGlobal();

  return !state.user ? <Navigate to="/signIn" replace /> : <Outlet />;
}

export default ProtectedRoute;
