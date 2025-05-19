
import { useAttendance } from "@/contexts/AttendanceContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, PieChart, LineChart, UserRound, Clock, AlertCircle, Users, MapPin, Cog } from "lucide-react";
import AttendanceTable from "@/components/AttendanceTable";
import AttendanceChart from "@/components/AttendanceChart";
import { Input } from "@/components/ui/input";
import LocationSelector from "@/components/LocationSelector";
import EmployeeManagement from "@/components/EmployeeManagement";
import DatabaseManagement from "@/components/DatabaseManagement";
import { toast } from "sonner";

const HRDashboard = () => {
  const { getAllRecords, getPendingRecords, updateAttendanceStatus } = useAttendance();
  const { getAllUsers, addUser, removeUser, assignManager, resetDatabase, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  
  const allRecords = getAllRecords();
  const pendingRecords = getPendingRecords();
  const employees = getAllUsers();

  // Filter records by search term
  const filteredRecords = searchTerm
    ? allRecords.filter(record => 
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.teamId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allRecords;
  
  // Get today's date
  const today = format(new Date(), "MMMM d, yyyy");
  
  // Calculate stats
  const totalEmployees = new Set(allRecords.map(record => record.employeeId)).size;
  const totalTeams = new Set(allRecords.filter(r => r.teamId).map(record => record.teamId)).size;
  
  const presentToday = new Set(
    allRecords
      .filter(record => 
        record.date === new Date().toISOString().split('T')[0] && 
        (record.status === 'approved' || record.status === 'half-day')
      )
      .map(record => record.employeeId)
  ).size;
  
  const pendingApprovals = pendingRecords.length;

  // Handle location selection
  const handleLocationSelect = (employeeId: string, location: { lat: number; lng: number; address: string }) => {
    updateUser(employeeId, { location });
    toast.success("Location updated successfully");
  };
  
  // Handle database reset
  const handleResetDatabase = () => {
    resetDatabase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">HR Dashboard</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Employees</div>
            <div className="flex items-center mt-1">
              <UserRound className="h-5 w-5 mr-2 text-brand-400" />
              <div className="text-3xl font-bold">{totalEmployees}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Teams</div>
            <div className="text-3xl font-bold mt-1">{totalTeams}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Present Today</div>
            <div className="flex items-center mt-1">
              <Clock className="h-5 w-5 mr-2 text-success" />
              <div className="text-3xl font-bold text-success">{presentToday}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Pending Approvals</div>
            <div className="flex items-center mt-1">
              <AlertCircle className="h-5 w-5 mr-2 text-warning" />
              <div className="text-3xl font-bold text-warning">{pendingApprovals}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">All Attendance</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="employees">Employee Management</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search by employee name, ID, or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>All Attendance Records</CardTitle>
              <CardDescription>View and manage all employee attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceTable 
                records={filteredRecords.slice(0, 20)} 
                showEmployeeName
                showTeamId
                showActions
                onStatusChange={updateAttendanceStatus}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="approvals" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>All attendance records pending approval</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceTable 
                records={pendingRecords} 
                showEmployeeName
                showTeamId
                showActions
                onStatusChange={updateAttendanceStatus}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-brand-400" />
                  Weekly Attendance Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <AttendanceChart type="bar" data={allRecords} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-brand-400" />
                  Overall Attendance Status
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <AttendanceChart type="pie" data={allRecords} />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-brand-400" />
                Attendance Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <AttendanceChart type="line" data={allRecords} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="employees" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-6">
            <EmployeeManagement 
              employees={employees}
              onAddEmployee={(employee) => {
                const id = addUser(employee);
                return id;
              }}
              onRemoveEmployee={removeUser}
              onAssignManager={assignManager}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-brand-400" />
                  Employee Locations
                </CardTitle>
                <CardDescription>Set and update employee work locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Select Employee:</label>
                    <select 
                      className="border rounded-md px-3 py-2 bg-background"
                      defaultValue=""
                      onChange={(e) => {
                        const selectedEmployee = employees.find(emp => emp.id === e.target.value);
                        if (selectedEmployee && e.target.value) {
                          setSelectedEmployeeId(e.target.value);
                        }
                      }}
                    >
                      <option value="" disabled>Select an employee</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedEmployeeId && (
                    <LocationSelector
                      onLocationSelect={(location) => handleLocationSelect(selectedEmployeeId, location)}
                      initialLocation={employees.find(emp => emp.id === selectedEmployeeId)?.location}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 mt-6">
          <DatabaseManagement onResetDatabase={handleResetDatabase} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// State for employee location selection
const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

export default HRDashboard;
