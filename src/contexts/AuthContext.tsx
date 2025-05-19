import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from "sonner";

export type UserRole = 'employee' | 'teamlead' | 'hr' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
  teamLeadId?: string;
  employeeId?: string;
  position?: string;
  phoneNumber?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

// Internal user type that includes password and adminKey
interface InternalUser extends User {
  password: string;
  adminKey?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string, adminKey?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  getAllUsers: () => User[];
  addUser: (user: Omit<User, "id">) => string;
  removeUser: (id: string) => boolean;
  updateUser: (id: string, data: Partial<User>) => boolean;
  assignManager: (employeeId: string, managerId: string) => boolean;
  resetDatabase: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const initialMockUsers: InternalUser[] = [
  {
    id: '1',
    name: 'Employee User',
    email: 'employee@example.com',
    password: 'employee123',
    role: 'employee',
    teamId: 'team1',
    teamLeadId: '3',
    employeeId: 'EMP001',
    position: 'Software Developer',
    phoneNumber: '123-456-7890',
    location: {
      lat: 40.7128,
      lng: -74.006,
      address: 'New York, NY'
    }
  },
  {
    id: '2',
    name: 'HR Manager',
    email: 'hr@example.com',
    password: 'hr123',
    adminKey: 'hr-admin-key',
    role: 'hr'
  },
  {
    id: '3',
    name: 'Team Lead',
    email: 'teamlead@example.com',
    password: 'teamlead123',
    adminKey: 'team-admin-key',
    role: 'teamlead',
    teamId: 'team1'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mockUsers, setMockUsers] = useState<InternalUser[]>([...initialMockUsers]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Mock login function
  const login = async (email: string, password: string, adminKey?: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = mockUsers.find(user => user.email === email && user.password === password);
      
      if (!user) {
        toast.error("Invalid email or password");
        return false;
      }
      
      if ((user.role === 'hr' || user.role === 'teamlead') && user.adminKey !== adminKey) {
        toast.error("Invalid admin key");
        return false;
      }
      
      // Remove password from user object before setting to state
      const { password: _, adminKey: __, ...safeUserData } = user;
      setCurrentUser(safeUserData);
      toast.success(`Welcome back, ${safeUserData.name}!`);
      return true;
    } catch (error) {
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    toast.info("You have been logged out");
  };

  // Get all users (for HR management)
  const getAllUsers = () => {
    // Filter out sensitive data
    return mockUsers.map(({ password, adminKey, ...user }) => user);
  };

  // Add a new user
  const addUser = (userData: Omit<User, "id">) => {
    const id = `${mockUsers.length + 1}`;
    const employeeId = userData.employeeId || `EMP${String(mockUsers.length + 1).padStart(3, '0')}`;
    
    const newUser: InternalUser = {
      id,
      ...userData,
      employeeId,
      password: 'password123', // Default password
    };
    
    // Add adminKey only if the role is hr or teamlead
    if (userData.role === 'hr') {
      newUser.adminKey = 'hr-admin-key';
    } else if (userData.role === 'teamlead') {
      newUser.adminKey = 'team-admin-key';
    }
    
    setMockUsers([...mockUsers, newUser]);
    toast.success(`Added new ${userData.role}: ${userData.name}`);
    return id;
  };

  // Remove a user
  const removeUser = (id: string) => {
    // Don't remove the current user
    if (currentUser?.id === id) {
      toast.error("Cannot remove your own account");
      return false;
    }

    // Ensure we keep at least one HR user
    const isHR = mockUsers.find(user => user.id === id)?.role === 'hr';
    const hrCount = mockUsers.filter(user => user.role === 'hr').length;
    
    if (isHR && hrCount <= 1) {
      toast.error("Cannot remove the last HR account");
      return false;
    }

    setMockUsers(mockUsers.filter(user => user.id !== id));
    toast.success("User removed successfully");
    return true;
  };

  // Update user data
  const updateUser = (id: string, data: Partial<User>) => {
    setMockUsers(
      mockUsers.map(user => 
        user.id === id ? { ...user, ...data } : user
      )
    );
    
    // Update current user if it's the same
    if (currentUser?.id === id) {
      setCurrentUser({...currentUser, ...data});
    }
    
    return true;
  };

  // Assign manager to employee
  const assignManager = (employeeId: string, managerId: string) => {
    const result = updateUser(employeeId, { teamLeadId: managerId || undefined });
    if (result) {
      const managerName = mockUsers.find(user => user.id === managerId)?.name || "No manager";
      const employeeName = mockUsers.find(user => user.id === employeeId)?.name;
      
      if (managerId) {
        toast.success(`Assigned ${employeeName} to manager: ${managerName}`);
      } else {
        toast.info(`Removed manager assignment for ${employeeName}`);
      }
    }
    return result;
  };

  // Reset database (keep only HR accounts)
  const resetDatabase = () => {
    // Keep only HR users
    const hrUsers = mockUsers.filter(user => user.role === 'hr');
    setMockUsers(hrUsers);
    
    // If current user is not HR, log them out
    if (currentUser && currentUser.role !== 'hr') {
      logout();
    }
    
    toast.success("Database has been reset successfully");
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isLoading,
    getAllUsers,
    addUser,
    removeUser,
    updateUser,
    assignManager,
    resetDatabase
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
