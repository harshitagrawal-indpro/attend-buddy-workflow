
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AttendanceProvider } from "./contexts/AttendanceContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Index from "./pages/Index";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import TeamLeadDashboard from "./pages/TeamLeadDashboard";
import HRDashboard from "./pages/HRDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AttendanceProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Index />} />
              
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                <Route path="/teamlead-dashboard" element={<TeamLeadDashboard />} />
                <Route path="/hr-dashboard" element={<HRDashboard />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Adding nested routes for team lead dashboard */}
                <Route path="/teamlead-dashboard/attendance" element={<TeamLeadDashboard />} />
                <Route path="/teamlead-dashboard/reports" element={<TeamLeadDashboard />} />
                
                {/* Adding nested routes for HR dashboard */}
                <Route path="/hr-dashboard/attendance" element={<HRDashboard />} />
                <Route path="/hr-dashboard/approvals" element={<HRDashboard />} />
                <Route path="/hr-dashboard/reports" element={<HRDashboard />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AttendanceProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
