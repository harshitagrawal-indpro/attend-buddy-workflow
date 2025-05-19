
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, UserMinus, Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserRole } from "@/contexts/AuthContext";

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
  teamLeadId?: string;
  position?: string;
}

interface EmployeeManagementProps {
  employees: Employee[];
  onAddEmployee: (employee: Omit<Employee, "id">) => void;
  onRemoveEmployee: (id: string) => void;
  onAssignManager: (employeeId: string, managerId: string) => void;
}

const EmployeeManagement = ({
  employees,
  onAddEmployee,
  onRemoveEmployee,
  onAssignManager,
}: EmployeeManagementProps) => {
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    role: "employee" as UserRole,
    position: "",
    teamId: "",
  });

  const teamLeads = employees.filter(emp => emp.role === "teamlead");

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email) {
      toast.error("Name and email are required");
      return;
    }
    
    onAddEmployee(newEmployee);
    setNewEmployee({
      name: "",
      email: "",
      role: "employee" as UserRole,
      position: "",
      teamId: "",
    });
    toast.success("Employee added successfully");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Employee Management
        </CardTitle>
        <CardDescription>Add, remove, and assign employees to managers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add Employee Form */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-medium flex items-center">
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Employee
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newEmployee.role || "employee"}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, role: value as UserRole })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="teamlead">Team Lead</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  placeholder="Software Developer"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamId">Team ID</Label>
                <Input
                  id="teamId"
                  placeholder="team1"
                  value={newEmployee.teamId}
                  onChange={(e) => setNewEmployee({ ...newEmployee, teamId: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddEmployee}>Add Employee</Button>
              </div>
            </div>
          </div>

          {/* Employee List */}
          <div>
            <h3 className="text-lg font-medium mb-4">Employee List</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No employees added yet
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell className="capitalize">{employee.role}</TableCell>
                      <TableCell>{employee.position || "-"}</TableCell>
                      <TableCell>{employee.teamId || "-"}</TableCell>
                      <TableCell>
                        {employee.role === "employee" ? (
                          <Select
                            value={employee.teamLeadId || ""}
                            onValueChange={(value) => onAssignManager(employee.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Assign manager" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">None</SelectItem>
                              {teamLeads.map((lead) => (
                                <SelectItem key={lead.id} value={lead.id}>
                                  {lead.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            onRemoveEmployee(employee.id);
                            toast.success("Employee removed");
                          }}
                        >
                          <UserMinus className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeManagement;
