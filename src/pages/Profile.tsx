
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserRound, Mail, Phone, Briefcase, Users } from "lucide-react";

const Profile = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return null;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile information updated");
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">View and edit your profile information</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-brand-100 flex items-center justify-center mb-4">
                <UserRound className="h-12 w-12 text-brand-400" />
              </div>
              
              <h3 className="font-medium text-lg">{currentUser.name}</h3>
              <p className="text-muted-foreground capitalize">{currentUser.role}</p>
              
              <div className="mt-6 space-y-3 w-full">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{currentUser.email}</span>
                </div>
                
                {currentUser.phoneNumber && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{currentUser.phoneNumber}</span>
                  </div>
                )}
                
                {currentUser.position && (
                  <div className="flex items-center text-sm">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{currentUser.position}</span>
                  </div>
                )}
                
                {currentUser.teamId && (
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Team: {currentUser.teamId}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={currentUser.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={currentUser.email} readOnly />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue={currentUser.phoneNumber || ''} />
                </div>
                {currentUser.role === 'employee' && (
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" defaultValue={currentUser.position || ''} />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Current Password</Label>
                <Input id="password" type="password" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="submit" className="bg-brand-300 hover:bg-brand-400">Update Profile</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
