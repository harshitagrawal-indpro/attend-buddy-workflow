
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Clock, 
  CalendarCheck, 
  FileBarChart, 
  User, 
  LogOut, 
  ChevronLeft, 
  MenuIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const Layout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  // Define navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        icon: User,
        label: "Profile",
        path: "/profile"
      }
    ];
    
    if (currentUser?.role === "employee") {
      return [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/employee-dashboard"
        },
        ...baseItems
      ];
    } else if (currentUser?.role === "teamlead") {
      return [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/teamlead-dashboard"
        },
        {
          icon: Clock,
          label: "Attendance",
          path: "/teamlead-dashboard/attendance"
        },
        {
          icon: FileBarChart,
          label: "Reports",
          path: "/teamlead-dashboard/reports"
        },
        ...baseItems
      ];
    } else if (currentUser?.role === "hr") {
      return [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/hr-dashboard"
        },
        {
          icon: Clock,
          label: "Attendance",
          path: "/hr-dashboard/attendance"
        },
        {
          icon: CalendarCheck,
          label: "Approvals",
          path: "/hr-dashboard/approvals"
        },
        {
          icon: FileBarChart,
          label: "Reports",
          path: "/hr-dashboard/reports"
        },
        ...baseItems
      ];
    }
    
    return baseItems;
  };
  
  const navigationItems = getNavigationItems();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-sidebar h-full flex flex-col border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-[70px]" : "w-[250px]"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="font-semibold text-brand-500 text-lg">AttendBuddy</div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(prev => !prev)}
            className={cn("ml-auto text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent")}
          >
            {collapsed ? <MenuIcon size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>
        
        {/* Nav Links */}
        <div className="flex-1 py-6 flex flex-col justify-between">
          <nav className="space-y-2 px-2">
            {navigationItems.map((item, index) => (
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 font-normal",
                      location.pathname === item.path 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      collapsed && "justify-center px-0"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon size={20} />
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>
          
          <div className="px-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    collapsed && "justify-center px-0"
                  )}
                  onClick={handleLogout}
                >
                  <LogOut size={20} />
                  {!collapsed && <span>Logout</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  Logout
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="h-16 border-b border-border bg-background flex items-center px-6">
          <div className="flex items-center gap-2">
            <div className="font-semibold">{currentUser?.name}</div>
            <div className="text-sm text-muted-foreground px-2 py-0.5 bg-muted rounded-full capitalize">
              {currentUser?.role}
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
