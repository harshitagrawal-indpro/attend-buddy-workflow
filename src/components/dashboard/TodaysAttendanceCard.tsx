
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle, Clock, AlertCircle, MapPin } from "lucide-react";
import { AttendanceRecord } from "@/contexts/AttendanceContext";
import LocationSelector from "@/components/LocationSelector";
import MonthlyOverview from "./MonthlyOverview";

interface TodaysAttendanceCardProps {
  todayRecord: AttendanceRecord | null;
  isLoading: boolean;
  markEntry: (currentLocation?: { lat: number; lng: number }) => Promise<boolean>;
  markExit: (currentLocation?: { lat: number; lng: number }) => Promise<boolean>;
  onShowReasonDialog: () => void;
  userLocation?: { lat: number; lng: number; address: string };
  employeeRecords: AttendanceRecord[];
}

const TodaysAttendanceCard: React.FC<TodaysAttendanceCardProps> = ({
  todayRecord,
  isLoading,
  markEntry,
  markExit,
  onShowReasonDialog,
  userLocation,
  employeeRecords
}) => {
  const [showLocationPicker, setShowLocationPicker] = useState<'entry' | 'exit' | null>(null);

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    if (showLocationPicker === 'entry') {
      markEntry({ lat: location.lat, lng: location.lng }).then((success) => {
        setShowLocationPicker(null);
        
        // If location is not verified, show reason dialog
        if (success && todayRecord && !todayRecord.locationVerified) {
          onShowReasonDialog();
        }
      });
    } else if (showLocationPicker === 'exit') {
      markExit({ lat: location.lat, lng: location.lng }).then((success) => {
        setShowLocationPicker(null);
        
        // If location is not verified, show reason dialog
        if (success && todayRecord && !todayRecord.locationVerified && !todayRecord.locationReason) {
          onShowReasonDialog();
        }
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
          <CardDescription>Mark your attendance for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="w-full max-w-xs">
              <div className="text-center sm:text-left mb-4">
                <div className="text-sm text-muted-foreground mb-1">Current Status</div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {!todayRecord ? (
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Not Marked</span>
                    </div>
                  ) : todayRecord.status === 'pending' ? (
                    <div className="flex items-center text-yellow-500">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Pending</span>
                    </div>
                  ) : todayRecord.status === 'approved' ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      <span>Present</span>
                    </div>
                  ) : todayRecord.status === 'half-day' ? (
                    <div className="flex items-center text-orange-500">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Half-day</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      <span>Absent</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border rounded-lg p-3">
                  <div className="text-sm text-muted-foreground mb-1">Entry Time</div>
                  <div className="font-medium">{todayRecord?.entryTime || 'Not Marked'}</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-sm text-muted-foreground mb-1">Exit Time</div>
                  <div className="font-medium">{todayRecord?.exitTime || 'Not Marked'}</div>
                </div>
              </div>

              {todayRecord && !todayRecord.locationVerified && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-yellow-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-yellow-700 font-medium">Location not verified</p>
                      <p className="text-xs text-yellow-600">
                        {todayRecord.locationReason ? 
                          `Reason provided: ${todayRecord.locationReason}` : 
                          "You must be within 100 meters of the office to mark attendance normally."
                        }
                      </p>
                      {!todayRecord.locationReason && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2" 
                          onClick={onShowReasonDialog}
                        >
                          Provide Reason
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => setShowLocationPicker('entry')} 
                  disabled={isLoading || !!todayRecord?.entryTime}
                  className="bg-brand-200 hover:bg-brand-300 text-black"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Mark Entry Time
                </Button>
                <Button 
                  onClick={() => setShowLocationPicker('exit')} 
                  disabled={isLoading || !todayRecord?.entryTime || !!todayRecord?.exitTime}
                  className="bg-brand-300 hover:bg-brand-400 text-white"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Mark Exit Time
                </Button>
              </div>
            </div>
            
            <div className="border-t sm:border-t-0 sm:border-l h-full w-full pt-6 sm:pt-0 sm:pl-6">
              <MonthlyOverview employeeRecords={employeeRecords} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Picker Dialog */}
      <Dialog open={showLocationPicker !== null} onOpenChange={(open) => !open && setShowLocationPicker(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {showLocationPicker === 'entry' ? 'Mark Entry Location' : 'Mark Exit Location'}
            </DialogTitle>
            <DialogDescription>
              Select your current location to mark your {showLocationPicker === 'entry' ? 'entry' : 'exit'} time.
              You must be within 100 meters of your office location.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <LocationSelector 
              onLocationSelect={handleLocationSelect}
              initialLocation={userLocation}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TodaysAttendanceCard;
