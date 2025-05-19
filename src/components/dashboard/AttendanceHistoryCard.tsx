
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import AttendanceTable from "@/components/AttendanceTable";
import { AttendanceRecord } from "@/contexts/AttendanceContext";

interface AttendanceHistoryCardProps {
  records: AttendanceRecord[];
}

const AttendanceHistoryCard: React.FC<AttendanceHistoryCardProps> = ({ records }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance History</CardTitle>
        <CardDescription>View your past attendance records</CardDescription>
      </CardHeader>
      <CardContent>
        <AttendanceTable records={records.slice(0, 10)} />
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Showing the last 10 records
        </div>
      </CardFooter>
    </Card>
  );
};

export default AttendanceHistoryCard;
