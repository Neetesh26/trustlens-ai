import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const { token } = useSelector((state) => state.auth);
  console.log(">>>>.token protyected",token);
  
  return token ? <Outlet /> : <Navigate to="/" />;
}