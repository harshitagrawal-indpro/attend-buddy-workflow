
import React from "react";
import { Progress } from "@/components/ui/progress";
import { AttendanceRecord } from "@/contexts/AttendanceContext";

interface MonthlyOverviewProps {
  employeeRecords: AttendanceRecord[];
}

const MonthlyOverview: React.FC<MonthlyOverviewProps> = ({ employeeRecords }) => {
  // Calculate attendance stats
  const totalWorkingDays = 22; // Assuming 22 working days in a month
  const presentDays = employeeRecords.filter(record => 
    record.status === 'approved' || record.status === 'half-day'
  ).length;
  const halfDays = employeeRecords.filter(record => record.status === 'half-day').length;
  const absentDays = employeeRecords.filter(record => record.status === 'rejected').length;
  const presentPercentage = Math.round((presentDays / totalWorkingDays) * 100);

  return (
    <>
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
    </>
  );
};

export default MonthlyOverview;
