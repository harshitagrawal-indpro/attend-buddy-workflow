
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface LocationReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reasonText: string;
  setReasonText: (reason: string) => void;
  onSubmit: () => void;
}

const LocationReasonDialog: React.FC<LocationReasonDialogProps> = ({
  open,
  onOpenChange,
  reasonText,
  setReasonText,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Provide Reason</DialogTitle>
          <DialogDescription>
            You were not within 100 meters of your office location. Please provide a reason.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Textarea
            placeholder="Enter your reason here..."
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={onSubmit} disabled={!reasonText.trim()}>Submit Reason</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationReasonDialog;
