
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: Array<"employee" | "teamlead" | "hr">;
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role (if specified)
  if (allowedRoles && currentUser?.role && !allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard based on role
    if (currentUser.role === "employee") {
      return <Navigate to="/employee-dashboard" replace />;
    } else if (currentUser.role === "teamlead") {
      return <Navigate to="/teamlead-dashboard" replace />;
    } else if (currentUser.role === "hr") {
      return <Navigate to="/hr-dashboard" replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute;
