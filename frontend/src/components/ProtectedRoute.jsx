import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { accessToken } = useAuth();
  const token = accessToken || sessionStorage.getItem("accessToken");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;