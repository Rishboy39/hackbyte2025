
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PreOrder from "./pages/PreOrder";
import Voting from "./pages/Voting";
import OrderManagement from "./pages/OrderManagement";
import AdminPortal from "./pages/AdminPortal";
import FoodStock from "./pages/FoodStock";
import FoodBanks from "./pages/FoodBanks";
import TeacherPortal from "./pages/TeacherPortal";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import authService, { AuthState } from "./lib/authService";

const queryClient = new QueryClient();

const App = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true
  });
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'admin' | 'staff' | null>(null);
  
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = authService.onAuthStateChange((session, user) => {
      setAuthState({
        session,
        user,
        isLoading: false
      });
      
      // Fetch user role
      if (user) {
        authService.getUserRole(user.id).then(role => {
          setUserRole(role);
          console.log("User role set to:", role); // Debug log
        });
      } else {
        setUserRole(null);
      }
    });

    // Check for existing session
    const checkSession = async () => {
      const session = await authService.getCurrentSession();
      const user = await authService.getCurrentUser();
      setAuthState({
        session,
        user,
        isLoading: false
      });
      
      // Fetch user role
      if (user) {
        const role = await authService.getUserRole(user.id);
        console.log("Initial user role:", role); // Debug log
        setUserRole(role);
      }
    };

    checkSession();
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  
  // Show a loading state while checking auth
  if (authState.isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  const isLoggedIn = !!authState.session;
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LandingPage />} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
            
            {/* All Routes - No role restrictions */}
            <Route 
              path="/dashboard" 
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/pre-order" 
              element={isLoggedIn ? <PreOrder /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/voting" 
              element={isLoggedIn ? <Voting /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/order-management" 
              element={isLoggedIn ? <OrderManagement /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={isLoggedIn ? <AdminPortal /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin/food-stock" 
              element={isLoggedIn ? <FoodStock /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin/food-banks" 
              element={isLoggedIn ? <FoodBanks /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/teacher" 
              element={isLoggedIn ? <TeacherPortal /> : <Navigate to="/login" />} 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
