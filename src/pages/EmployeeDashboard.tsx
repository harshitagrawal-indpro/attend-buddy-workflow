
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import AttendanceTable from "@/components/AttendanceTable";

const EmployeeDashboard = () => {
  const { currentUser } = useAuth();
  const { todayRecord, markEntry, markExit, getEmployeeRecords, isLoading } = useAttendance();
  
  if (!currentUser) {
    return null;
  }
  
  const employeeRecords = getEmployeeRecords(currentUser.employeeId || '');
  
  // Calculate attendance stats
  const totalWorkingDays = 22; // Assuming 22 working days in a month
  const presentDays = employeeRecords.filter(record => 
    record.status === 'approved' || record.status === 'half-day'
  ).length;
  const halfDays = employeeRecords.filter(record => record.status === 'half-day').length;
  const absentDays = employeeRecords.filter(record => record.status === 'rejected').length;
  const presentPercentage = Math.round((presentDays / totalWorkingDays) * 100);
  
  // Get today's date
  const today = format(new Date(), "MMMM d, yyyy");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>
      
      {/* Today's Card */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
          <CardDescription>Mark your attendance for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="w-full max-w-xs">
              <div className="text-center sm:text-left mb-4">
                <div className="text-sm text-muted-foreground mb-1">Current Status</div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {!todayRecord ? (
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Not Marked</span>
                    </div>
                  ) : todayRecord.status === 'pending' ? (
                    <div className="flex items-center text-yellow-500">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Pending</span>
                    </div>
                  ) : todayRecord.status === 'approved' ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      <span>Present</span>
                    </div>
                  ) : todayRecord.status === 'half-day' ? (
                    <div className="flex items-center text-orange-500">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Half-day</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      <span>Absent</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border rounded-lg p-3">
                  <div className="text-sm text-muted-foreground mb-1">Entry Time</div>
                  <div className="font-medium">{todayRecord?.entryTime || 'Not Marked'}</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-sm text-muted-foreground mb-1">Exit Time</div>
                  <div className="font-medium">{todayRecord?.exitTime || 'Not Marked'}</div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={markEntry} 
                  disabled={isLoading || !!todayRecord?.entryTime}
                  className="bg-brand-200 hover:bg-brand-300 text-black"
                >
                  Mark Entry Time
                </Button>
                <Button 
                  onClick={markExit} 
                  disabled={isLoading || !todayRecord?.entryTime || !!todayRecord?.exitTime}
                  className="bg-brand-300 hover:bg-brand-400 text-white"
                >
                  Mark Exit Time
                </Button>
              </div>
            </div>
            
            <div className="border-t sm:border-t-0 sm:border-l h-full w-full pt-6 sm:pt-0 sm:pl-6">
              <h3 className="font-medium mb-4">Monthly Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Present</span>
                    <span className="font-medium">{presentDays} days</span>
                  </div>
                  <Progress value={presentPercentage} className="h-2" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Working Days</div>
                    <div className="font-medium">{totalWorkingDays}</div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Half-days</div>
                    <div className="font-medium">{halfDays}</div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Absent</div>
                    <div className="font-medium">{absentDays}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>View your past attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceTable records={employeeRecords.slice(0, 10)} />
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Showing the last 10 records
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
