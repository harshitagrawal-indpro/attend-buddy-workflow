
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AttendanceRecord } from "@/contexts/AttendanceContext";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  showEmployeeName?: boolean;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, showEmployeeName = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'half-day':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Table>
      <TableCaption>Recent attendance records</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          {showEmployeeName && <TableHead>Employee</TableHead>}
          <TableHead>Entry Time</TableHead>
          <TableHead>Exit Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Location</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.length > 0 ? (
          records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.date}</TableCell>
              {showEmployeeName && <TableCell>{record.employeeName}</TableCell>}
              <TableCell>
                {record.entryTime || 'Not marked'}
                {record.entryLocation && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <MapPin className="h-3 w-3 inline-block ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Lat: {record.entryLocation.lat.toFixed(6)}</p>
                        <p>Lng: {record.entryLocation.lng.toFixed(6)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </TableCell>
              <TableCell>
                {record.exitTime || 'Not marked'}
                {record.exitLocation && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <MapPin className="h-3 w-3 inline-block ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Lat: {record.exitLocation.lat.toFixed(6)}</p>
                        <p>Lng: {record.exitLocation.lng.toFixed(6)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(record.status)}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </Badge>
                {!record.locationVerified && record.locationReason && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <MapPin className="h-3 w-3 inline-block ml-1 text-yellow-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reason: {record.locationReason}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </TableCell>
              <TableCell>
                {record.locationVerified === undefined ? (
                  <span className="text-gray-400">Unknown</span>
                ) : record.locationVerified ? (
                  <span className="text-green-500 flex items-center">
                    <CheckMark className="h-4 w-4 mr-1" />
                    Verified
                  </span>
                ) : (
                  <span className="text-yellow-500 flex items-center">
                    <AlertMark className="h-4 w-4 mr-1" />
                    Not Verified
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={showEmployeeName ? 6 : 5} className="text-center py-8">
              No attendance records found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

// Small utility components for the icons
const CheckMark = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const AlertMark = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default AttendanceTable;
