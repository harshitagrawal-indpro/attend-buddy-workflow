
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, CheckCircle } from "lucide-react";

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [role, setRole] = useState<UserRole>("employee");

  if (isAuthenticated) {
    const destination = role === 'employee' 
      ? '/employee-dashboard' 
      : role === 'teamlead' 
        ? '/teamlead-dashboard' 
        : '/hr-dashboard';
    navigate(destination, { replace: true });
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    const success = await login(email, password, adminKey);
    
    if (success) {
      const destination = role === 'employee' 
        ? '/employee-dashboard' 
        : role === 'teamlead' 
          ? '/teamlead-dashboard' 
          : '/hr-dashboard';
      navigate(destination, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100">
      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-brand-800 mb-4">AttendBuddy</h1>
            <p className="text-xl text-brand-600">Streamlined attendance management for the modern workplace</p>
          </div>
          
          <div className="hidden lg:flex flex-col space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white p-3 rounded-full shadow-md">
                <Clock className="h-6 w-6 text-brand-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-brand-700">Easy Time Tracking</h3>
                <p className="text-brand-500">Mark your attendance with a single click</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white p-3 rounded-full shadow-md">
                <Calendar className="h-6 w-6 text-brand-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-brand-700">Attendance Management</h3>
                <p className="text-brand-500">Seamless workflows for approvals and tracking</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white p-3 rounded-full shadow-md">
                <CheckCircle className="h-6 w-6 text-brand-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-brand-700">Performance Insights</h3>
                <p className="text-brand-500">Visualize attendance data and trends</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Login</CardTitle>
              <CardDescription className="text-center">
                Access your attendance dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="employee" className="w-full" onValueChange={(value) => setRole(value as UserRole)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="employee">Employee</TabsTrigger>
                  <TabsTrigger value="teamlead">Team Lead</TabsTrigger>
                  <TabsTrigger value="hr">HR</TabsTrigger>
                </TabsList>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <TabsContent value="teamlead" className="space-y-2 mt-0">
                      <Label htmlFor="admin-key">Admin Key</Label>
                      <Input 
                        id="admin-key"
                        type="password"
                        placeholder="Team Lead Admin Key"
                        value={adminKey}
                        onChange={(e) => setAdminKey(e.target.value)}
                      />
                    </TabsContent>
                    
                    <TabsContent value="hr" className="space-y-2 mt-0">
                      <Label htmlFor="admin-key">Admin Key</Label>
                      <Input 
                        id="admin-key"
                        type="password"
                        placeholder="HR Admin Key"
                        value={adminKey}
                        onChange={(e) => setAdminKey(e.target.value)}
                      />
                    </TabsContent>
                    
                    <Button type="submit" className="w-full bg-brand-300 hover:bg-brand-400" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Log in"}
                    </Button>
                  </div>
                </form>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground">
                Demo Credentials:
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Employee: employee@example.com / employee123
              </div>
              <div className="text-xs text-muted-foreground">
                Team Lead: teamlead@example.com / teamlead123 / team-admin-key
              </div>
              <div className="text-xs text-muted-foreground">
                HR: hr@example.com / hr123 / hr-admin-key
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
