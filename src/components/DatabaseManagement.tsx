
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Cog } from "lucide-react";
import { toast } from "sonner";

interface DatabaseManagementProps {
  onResetDatabase: () => void;
}

const DatabaseManagement = ({ onResetDatabase }: DatabaseManagementProps) => {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = () => {
    setIsResetting(true);
    
    // Simulate a delay for the reset operation
    setTimeout(() => {
      onResetDatabase();
      setIsResetting(false);
      toast.success("Database has been reset successfully");
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Cog className="h-5 w-5 mr-2" />
          Database Management
        </CardTitle>
        <CardDescription>Reset database and system settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border p-4 rounded-md bg-destructive/5">
            <h3 className="text-lg font-medium text-destructive flex items-center mb-2">
              <Trash2 className="h-5 w-5 mr-2" />
              Database Reset
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              This action will remove all employees, attendance records, and system data. Only HR accounts will remain. This action cannot be undone.
            </p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  Reset Database
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete all employees, attendance records, and system data. Only HR accounts will remain. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleReset}
                    disabled={isResetting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isResetting ? "Resetting..." : "Reset Database"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseManagement;
