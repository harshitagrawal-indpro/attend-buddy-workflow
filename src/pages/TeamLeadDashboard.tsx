
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";
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
import { BarChart, PieChart, LineChart } from "lucide-react";
import AttendanceTable from "@/components/AttendanceTable";
import AttendanceChart from "@/components/AttendanceChart";

const TeamLeadDashboard = () => {
  const { currentUser } = useAuth();
  const { getTeamRecords, updateAttendanceStatus } = useAttendance();
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!currentUser || !currentUser.teamId) {
    return null;
  }
  
  const teamRecords = getTeamRecords(currentUser.teamId);
  const pendingRecords = teamRecords.filter(record => record.status === 'pending');
  
  // Get today's date
  const today = format(new Date(), "MMMM d, yyyy");
  
  // Calculate team stats
  const totalEmployees = new Set(teamRecords.map(record => record.employeeId)).size;
  const presentToday = new Set(
    teamRecords
      .filter(record => 
        record.date === new Date().toISOString().split('T')[0] && 
        (record.status === 'approved' || record.status === 'half-day')
      )
      .map(record => record.employeeId)
  ).size;
  
  const absentToday = totalEmployees - presentToday;
  const pendingApprovals = pendingRecords.length;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team Lead Dashboard</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Team Members</div>
            <div className="text-3xl font-bold mt-1">{totalEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Present Today</div>
            <div className="text-3xl font-bold mt-1 text-success">{presentToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Absent Today</div>
            <div className="text-3xl font-bold mt-1 text-destructive">{absentToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Pending Approvals</div>
            <div className="text-3xl font-bold mt-1 text-brand-400">{pendingApprovals}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="charts">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Attendance</CardTitle>
              <CardDescription>Recent attendance records for your team</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceTable 
                records={teamRecords.slice(0, 10)} 
                showEmployeeName
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="approvals" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Attendance records waiting for approval</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceTable 
                records={pendingRecords} 
                showEmployeeName
                showActions
                onStatusChange={updateAttendanceStatus}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="charts" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-brand-400" />
                  Attendance Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <AttendanceChart type="bar" data={teamRecords} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-brand-400" />
                  Attendance Status
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <AttendanceChart type="pie" data={teamRecords} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamLeadDashboard;
