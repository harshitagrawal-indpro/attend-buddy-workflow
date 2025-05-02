
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Redirect based on user role
      switch (currentUser?.role) {
        case 'employee':
          navigate('/employee-dashboard');
          break;
        case 'teamlead':
          navigate('/teamlead-dashboard');
          break;
        case 'hr':
          navigate('/hr-dashboard');
          break;
        default:
          navigate('/login');
      }
    }
  }, [navigate, isAuthenticated, currentUser]);
  
  return null;
};

export default Index;
