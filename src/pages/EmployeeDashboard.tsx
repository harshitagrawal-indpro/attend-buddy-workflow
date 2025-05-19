
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { format } from "date-fns";
import TodaysAttendanceCard from "@/components/dashboard/TodaysAttendanceCard";
import LocationReasonDialog from "@/components/dashboard/LocationReasonDialog";
import AttendanceHistoryCard from "@/components/dashboard/AttendanceHistoryCard";

const EmployeeDashboard = () => {
  const { currentUser } = useAuth();
  const { todayRecord, markEntry, markExit, updateAttendanceReason, getEmployeeRecords, isLoading } = useAttendance();
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [reasonText, setReasonText] = useState('');
  
  if (!currentUser) {
    return null;
  }
  
  const employeeRecords = getEmployeeRecords(currentUser.employeeId || '');
  
  // Get today's date
  const today = format(new Date(), "MMMM d, yyyy");

  const handleReasonSubmit = () => {
    if (todayRecord && reasonText) {
      updateAttendanceReason(todayRecord.id, reasonText);
      setShowReasonDialog(false);
      setReasonText('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>
      
      {/* Today's Card */}
      <div className="grid grid-cols-1 gap-y-6">
        <TodaysAttendanceCard 
          todayRecord={todayRecord}
          isLoading={isLoading}
          markEntry={markEntry}
          markExit={markExit}
          onShowReasonDialog={() => setShowReasonDialog(true)}
          userLocation={currentUser.location}
          employeeRecords={employeeRecords}
        />
        
        <AttendanceHistoryCard records={employeeRecords} />
      </div>

      {/* Reason Dialog */}
      <LocationReasonDialog 
        open={showReasonDialog}
        onOpenChange={setShowReasonDialog}
        reasonText={reasonText}
        setReasonText={setReasonText}
        onSubmit={handleReasonSubmit}
      />
    </div>
  );
};

export default EmployeeDashboard;
