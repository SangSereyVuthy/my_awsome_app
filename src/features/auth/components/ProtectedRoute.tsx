import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");

  // ប្រសិនបើគ្មាន Token ទេ ត្រូវ Redirect ទៅ Login Page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};