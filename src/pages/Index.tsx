
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Redirect based on user role
      switch (currentUser.role) {
        case 'employee':
          navigate('/employee-dashboard', { replace: true });
          break;
        case 'teamlead':
          navigate('/teamlead-dashboard', { replace: true });
          break;
        case 'hr':
          navigate('/hr-dashboard', { replace: true });
          break;
        default:
          navigate('/login', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate, isAuthenticated, currentUser]);
  
  return null;
};

export default Index;
