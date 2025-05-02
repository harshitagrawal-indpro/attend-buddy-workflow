
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AttendanceRecord, AttendanceStatus } from "@/contexts/AttendanceContext";
import { format, parseISO } from "date-fns";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  showEmployeeName?: boolean;
  showTeamId?: boolean;
  showActions?: boolean;
  onStatusChange?: (recordId: string, status: AttendanceStatus, notes?: string) => void;
}

const AttendanceTable = ({
  records,
  showEmployeeName = false,
  showTeamId = false,
  showActions = false,
  onStatusChange,
}: AttendanceTableProps) => {
  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success">Present</Badge>;
      case "rejected":
        return <Badge variant="destructive">Absent</Badge>;
      case "half-day":
        return <Badge className="bg-warning">Half-day</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            {showEmployeeName && <TableHead>Employee</TableHead>}
            {showTeamId && <TableHead>Team</TableHead>}
            <TableHead>Entry Time</TableHead>
            <TableHead>Exit Time</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? 7 : 6} className="text-center py-8">
                No attendance records found
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  {format(parseISO(record.date), "MMM d, yyyy")}
                </TableCell>
                {showEmployeeName && (
                  <TableCell>{record.employeeName}</TableCell>
                )}
                {showTeamId && (
                  <TableCell>{record.teamId || "—"}</TableCell>
                )}
                <TableCell>{record.entryTime || "—"}</TableCell>
                <TableCell>{record.exitTime || "—"}</TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                {showActions && onStatusChange && (
                  <TableCell>
                    {record.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onStatusChange(record.id, "approved")}
                          className="px-2 py-1 text-xs bg-success text-white rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onStatusChange(record.id, "half-day")}
                          className="px-2 py-1 text-xs bg-warning text-white rounded hover:bg-amber-600"
                        >
                          Half-day
                        </button>
                        <button
                          onClick={() => onStatusChange(record.id, "rejected")}
                          className="px-2 py-1 text-xs bg-destructive text-white rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {record.status !== "pending" && (
                      <span className="text-sm text-muted-foreground">
                        Status finalized
                      </span>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;
