
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "@/lib/authService";

const Index = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if the user is already logged in
        const isLoggedIn = await authService.isLoggedIn();
        
        if (isLoggedIn) {
          navigate('/dashboard');
        } else {
          navigate('/');  // Navigate to landing page instead of login
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/');
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAuthStatus();
  }, [navigate]);
  
  if (isChecking) {
    return <div className="flex items-center justify-center h-screen">Checking authentication...</div>;
  }
  
  return null; // No UI needed as we're redirecting
};

export default Index;
