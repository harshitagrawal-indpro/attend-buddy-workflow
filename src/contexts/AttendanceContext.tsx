
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from "sonner";

export type AttendanceStatus = 'pending' | 'approved' | 'rejected' | 'half-day';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  entryTime: string | null;
  exitTime: string | null;
  status: AttendanceStatus;
  teamId: string | null;
  notes: string | null;
}

interface AttendanceContextType {
  attendanceRecords: AttendanceRecord[];
  todayRecord: AttendanceRecord | null;
  markEntry: () => void;
  markExit: () => void;
  updateAttendanceStatus: (recordId: string, status: AttendanceStatus, notes?: string) => void;
  getEmployeeRecords: (employeeId: string) => AttendanceRecord[];
  getTeamRecords: (teamId: string) => AttendanceRecord[];
  getAllRecords: () => AttendanceRecord[];
  getPendingRecords: () => AttendanceRecord[];
  isLoading: boolean;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

// Generate mock data for the last 30 days
const generateMockAttendanceData = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  
  // Mock employees
  const employees = [
    { id: 'EMP001', name: 'Employee User', teamId: 'team1' },
    { id: 'EMP002', name: 'John Doe', teamId: 'team1' },
    { id: 'EMP003', name: 'Jane Smith', teamId: 'team1' },
    { id: 'EMP004', name: 'Mike Johnson', teamId: 'team2' },
    { id: 'EMP005', name: 'Sara Williams', teamId: 'team2' }
  ];
  
  const today = new Date();
  
  // Generate records for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // For each employee
    employees.forEach(employee => {
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      // Skip weekends or randomly skip some days
      if (isWeekend || (Math.random() > 0.9)) {
        return;
      }
      
      const isToday = i === 0;
      let entryTime: string | null = null;
      let exitTime: string | null = null;
      let status: AttendanceStatus = 'pending';
      
      // For past days
      if (!isToday) {
        const entryHour = 8 + Math.floor(Math.random() * 2); // Random entry between 8-9 AM
        const entryMinute = Math.floor(Math.random() * 60);
        entryTime = `${entryHour.toString().padStart(2, '0')}:${entryMinute.toString().padStart(2, '0')}`;
        
        const exitHour = 17 + Math.floor(Math.random() * 2); // Random exit between 5-6 PM
        const exitMinute = Math.floor(Math.random() * 60);
        exitTime = `${exitHour.toString().padStart(2, '0')}:${exitMinute.toString().padStart(2, '0')}`;
        
        // Random status for past days
        const statuses: AttendanceStatus[] = ['approved', 'approved', 'approved', 'half-day', 'rejected'];
        status = statuses[Math.floor(Math.random() * statuses.length)];
      }
      
      records.push({
        id: `att-${dateString}-${employee.id}`,
        employeeId: employee.id,
        employeeName: employee.name,
        date: dateString,
        entryTime,
        exitTime,
        status,
        teamId: employee.teamId,
        notes: null
      });
    });
  }
  
  return records;
};

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(generateMockAttendanceData());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Get today's record for the current user
  const todayRecord = currentUser ? attendanceRecords.find(
    record => 
      record.employeeId === currentUser.employeeId && 
      record.date === new Date().toISOString().split('T')[0]
  ) || null : null;
  
  // Mark entry time
  const markEntry = () => {
    if (!currentUser || !currentUser.employeeId) {
      toast.error("User information is incomplete");
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      const currentTime = new Date();
      const timeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
      
      // Check if a record for today already exists
      const existingRecord = attendanceRecords.find(
        record => record.employeeId === currentUser.employeeId && record.date === today
      );
      
      if (existingRecord) {
        // Update existing record
        setAttendanceRecords(prev => 
          prev.map(record => 
            record.id === existingRecord.id
              ? { ...record, entryTime: timeString }
              : record
          )
        );
      } else {
        // Create new record
        const newRecord: AttendanceRecord = {
          id: `att-${today}-${currentUser.employeeId}`,
          employeeId: currentUser.employeeId,
          employeeName: currentUser.name,
          date: today,
          entryTime: timeString,
          exitTime: null,
          status: 'pending',
          teamId: currentUser.teamId || null,
          notes: null
        };
        
        setAttendanceRecords(prev => [...prev, newRecord]);
      }
      
      toast.success("Entry time recorded successfully");
      setIsLoading(false);
    }, 1000);
  };
  
  // Mark exit time
  const markExit = () => {
    if (!currentUser || !currentUser.employeeId) {
      toast.error("User information is incomplete");
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      const currentTime = new Date();
      const timeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
      
      // Find today's record
      const existingRecord = attendanceRecords.find(
        record => record.employeeId === currentUser.employeeId && record.date === today
      );
      
      if (existingRecord) {
        // Update existing record with exit time
        setAttendanceRecords(prev => 
          prev.map(record => 
            record.id === existingRecord.id
              ? { ...record, exitTime: timeString }
              : record
          )
        );
        toast.success("Exit time recorded successfully");
      } else {
        toast.error("No entry record found for today");
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  // Update attendance status (for Team Lead and HR)
  const updateAttendanceStatus = (recordId: string, status: AttendanceStatus, notes?: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setAttendanceRecords(prev => 
        prev.map(record => 
          record.id === recordId
            ? { ...record, status, notes: notes || record.notes }
            : record
        )
      );
      
      toast.success(`Attendance status updated to ${status}`);
      setIsLoading(false);
    }, 1000);
  };
  
  // Get records for a specific employee
  const getEmployeeRecords = (employeeId: string) => {
    return attendanceRecords.filter(record => record.employeeId === employeeId);
  };
  
  // Get records for a specific team
  const getTeamRecords = (teamId: string) => {
    return attendanceRecords.filter(record => record.teamId === teamId);
  };
  
  // Get all records (for HR)
  const getAllRecords = () => {
    return attendanceRecords;
  };
  
  // Get pending records
  const getPendingRecords = () => {
    if (currentUser?.role === 'teamlead' && currentUser.teamId) {
      return attendanceRecords.filter(
        record => record.teamId === currentUser.teamId && record.status === 'pending'
      );
    } else if (currentUser?.role === 'hr') {
      return attendanceRecords.filter(record => record.status === 'pending');
    }
    
    return [];
  };
  
  const value = {
    attendanceRecords,
    todayRecord,
    markEntry,
    markExit,
    updateAttendanceStatus,
    getEmployeeRecords,
    getTeamRecords,
    getAllRecords,
    getPendingRecords,
    isLoading
  };

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
};

export const useAttendance = (): AttendanceContextType => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
