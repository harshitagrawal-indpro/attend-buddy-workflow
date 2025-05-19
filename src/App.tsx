
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
              
              <Route path="/employee-dashboard" element={
                <ProtectedRoute allowedRoles={["employee", "teamlead", "hr"]}>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<EmployeeDashboard />} />
              </Route>
              
              <Route path="/teamlead-dashboard" element={
                <ProtectedRoute allowedRoles={["teamlead", "hr"]}>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<TeamLeadDashboard />} />
                <Route path="attendance" element={<TeamLeadDashboard />} />
                <Route path="reports" element={<TeamLeadDashboard />} />
              </Route>
              
              <Route path="/hr-dashboard" element={
                <ProtectedRoute allowedRoles={["hr"]}>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<HRDashboard />} />
                <Route path="attendance" element={<HRDashboard />} />
                <Route path="approvals" element={<HRDashboard />} />
                <Route path="reports" element={<HRDashboard />} />
              </Route>
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Profile />} />
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
