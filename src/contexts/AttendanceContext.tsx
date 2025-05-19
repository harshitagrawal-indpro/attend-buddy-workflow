
import React, { createContext, useState, useContext, ReactNode } from 'react';
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
  entryLocation?: {
    lat: number;
    lng: number;
  };
  exitLocation?: {
    lat: number;
    lng: number;
  };
  locationVerified?: boolean;
  locationReason?: string;
}

interface AttendanceContextType {
  attendanceRecords: AttendanceRecord[];
  todayRecord: AttendanceRecord | null;
  markEntry: (currentLocation?: { lat: number; lng: number }) => Promise<boolean>;
  markExit: (currentLocation?: { lat: number; lng: number }) => Promise<boolean>;
  updateAttendanceStatus: (recordId: string, status: AttendanceStatus, notes?: string) => void;
  getEmployeeRecords: (employeeId: string) => AttendanceRecord[];
  getTeamRecords: (teamId: string) => AttendanceRecord[];
  getAllRecords: () => AttendanceRecord[];
  getPendingRecords: () => AttendanceRecord[];
  updateAttendanceReason: (recordId: string, reason: string) => void;
  isLoading: boolean;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

// Function to calculate distance between two coordinates in meters
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
           Math.cos(φ1) * Math.cos(φ2) *
           Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

// Generate mock data for the last 30 days
const generateMockAttendanceData = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  
  // Mock employees
  const employees = [
    { id: 'EMP001', name: 'Employee User', teamId: 'team1', location: { lat: 40.7128, lng: -74.006 } },
    { id: 'EMP002', name: 'John Doe', teamId: 'team1', location: { lat: 40.7178, lng: -74.016 } },
    { id: 'EMP003', name: 'Jane Smith', teamId: 'team1', location: { lat: 40.7148, lng: -74.009 } },
    { id: 'EMP004', name: 'Mike Johnson', teamId: 'team2', location: { lat: 40.7238, lng: -74.002 } },
    { id: 'EMP005', name: 'Sara Williams', teamId: 'team2', location: { lat: 40.7198, lng: -73.998 } }
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

      // Add small random variation to location for entry and exit
      const entryLocation = {
        lat: employee.location.lat + (Math.random() * 0.001 - 0.0005),
        lng: employee.location.lng + (Math.random() * 0.001 - 0.0005),
      };

      const exitLocation = {
        lat: employee.location.lat + (Math.random() * 0.001 - 0.0005),
        lng: employee.location.lng + (Math.random() * 0.001 - 0.0005),
      };
      
      records.push({
        id: `att-${dateString}-${employee.id}`,
        employeeId: employee.id,
        employeeName: employee.name,
        date: dateString,
        entryTime,
        exitTime,
        status,
        teamId: employee.teamId,
        notes: null,
        entryLocation: !isToday ? entryLocation : undefined,
        exitLocation: !isToday ? exitLocation : undefined,
        locationVerified: !isToday ? true : undefined,
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
  
  // Mark entry time with location verification
  const markEntry = async (currentLocation?: { lat: number; lng: number }): Promise<boolean> => {
    if (!currentUser || !currentUser.employeeId) {
      toast.error("User information is incomplete");
      return false;
    }

    // Check if location is provided
    if (!currentLocation) {
      toast.error("Location information is required");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const today = new Date().toISOString().split('T')[0];
      const currentTime = new Date();
      const timeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
      
      // Verify if within 100 meters of office location
      const isWithinRange = currentUser.location ? 
        calculateDistance(
          currentLocation.lat, 
          currentLocation.lng, 
          currentUser.location.lat, 
          currentUser.location.lng
        ) <= 100 : false;
      
      // Check if a record for today already exists
      const existingRecord = attendanceRecords.find(
        record => record.employeeId === currentUser.employeeId && record.date === today
      );
      
      if (existingRecord) {
        // Update existing record
        setAttendanceRecords(prev => 
          prev.map(record => 
            record.id === existingRecord.id
              ? { 
                  ...record, 
                  entryTime: timeString,
                  entryLocation: currentLocation,
                  locationVerified: isWithinRange,
                  status: isWithinRange ? 'pending' : 'half-day',
                }
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
          status: isWithinRange ? 'pending' : 'half-day',
          teamId: currentUser.teamId || null,
          notes: null,
          entryLocation: currentLocation,
          locationVerified: isWithinRange,
        };
        
        setAttendanceRecords(prev => [...prev, newRecord]);
      }
      
      if (isWithinRange) {
        toast.success("Entry time recorded successfully");
      } else {
        toast.warning("Entry recorded, but you're not at the office location. Please provide a reason.");
      }
      
      return true;
    } catch (error) {
      toast.error("Failed to record entry time");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mark exit time with location verification
  const markExit = async (currentLocation?: { lat: number; lng: number }): Promise<boolean> => {
    if (!currentUser || !currentUser.employeeId) {
      toast.error("User information is incomplete");
      return false;
    }

    // Check if location is provided
    if (!currentLocation) {
      toast.error("Location information is required");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const today = new Date().toISOString().split('T')[0];
      const currentTime = new Date();
      const timeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
      
      // Verify if within 100 meters of office location
      const isWithinRange = currentUser.location ? 
        calculateDistance(
          currentLocation.lat, 
          currentLocation.lng, 
          currentUser.location.lat, 
          currentUser.location.lng
        ) <= 100 : false;
      
      // Find today's record
      const existingRecord = attendanceRecords.find(
        record => record.employeeId === currentUser.employeeId && record.date === today
      );
      
      if (existingRecord) {
        // Update existing record with exit time
        setAttendanceRecords(prev => 
          prev.map(record => 
            record.id === existingRecord.id
              ? { 
                  ...record, 
                  exitTime: timeString,
                  exitLocation: currentLocation,
                  locationVerified: record.locationVerified && isWithinRange,
                  status: record.locationVerified && isWithinRange ? record.status : 'half-day',
                }
              : record
          )
        );
        
        if (isWithinRange) {
          toast.success("Exit time recorded successfully");
        } else {
          toast.warning("Exit recorded, but you're not at the office location. Please provide a reason.");
        }
        
        return true;
      } else {
        toast.error("No entry record found for today");
        return false;
      }
    } catch (error) {
      toast.error("Failed to record exit time");
      return false;
    } finally {
      setIsLoading(false);
    }
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

  // Update attendance reason for location mismatch
  const updateAttendanceReason = (recordId: string, reason: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setAttendanceRecords(prev => 
        prev.map(record => 
          record.id === recordId
            ? { ...record, locationReason: reason }
            : record
        )
      );
      
      toast.success("Reason submitted successfully");
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
    updateAttendanceReason,
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
