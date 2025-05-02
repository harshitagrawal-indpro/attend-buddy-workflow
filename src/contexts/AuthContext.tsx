
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from "sonner";

export type UserRole = 'employee' | 'teamlead' | 'hr' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
  teamLeadId?: string;
  employeeId?: string;
  position?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string, adminKey?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'Employee User',
    email: 'employee@example.com',
    password: 'employee123',
    role: 'employee' as UserRole,
    teamId: 'team1',
    teamLeadId: '3',
    employeeId: 'EMP001',
    position: 'Software Developer',
    phoneNumber: '123-456-7890'
  },
  {
    id: '2',
    name: 'HR Manager',
    email: 'hr@example.com',
    password: 'hr123',
    adminKey: 'hr-admin-key',
    role: 'hr' as UserRole
  },
  {
    id: '3',
    name: 'Team Lead',
    email: 'teamlead@example.com',
    password: 'teamlead123',
    adminKey: 'team-admin-key',
    role: 'teamlead' as UserRole,
    teamId: 'team1'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isLoading
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
