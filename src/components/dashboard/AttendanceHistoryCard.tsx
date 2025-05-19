
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AttendanceHistoryCardProps {
  records: AttendanceRecord[];
}

const AttendanceHistoryCard: React.FC<AttendanceHistoryCardProps> = ({ records }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const recordsPerPage = 10;
  
  const totalPages = Math.ceil(records.length / recordsPerPage);
  const startIndex = currentPage * recordsPerPage;
  const displayedRecords = records.slice(startIndex, startIndex + recordsPerPage);
  
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance History</CardTitle>
        <CardDescription>View your past attendance records</CardDescription>
      </CardHeader>
      <CardContent>
        <AttendanceTable records={displayedRecords} />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing records {Math.min(records.length, startIndex + 1)}-{Math.min(records.length, startIndex + recordsPerPage)} of {records.length}
        </div>
        
        {totalPages > 1 && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrevPage} 
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNextPage} 
              disabled={currentPage >= totalPages - 1}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AttendanceHistoryCard;
