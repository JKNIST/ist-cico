import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface StaffScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffName: string;
  dayName: string;
  currentSchedule: { start: string; end: string } | null;
  onSave: (schedule: { start: string; end: string } | null) => void;
}

export function StaffScheduleDialog({
  open,
  onOpenChange,
  staffName,
  dayName,
  currentSchedule,
  onSave,
}: StaffScheduleDialogProps) {
  const { t } = useTranslation();
  const [startTime, setStartTime] = useState(currentSchedule?.start || "07:00");
  const [endTime, setEndTime] = useState(currentSchedule?.end || "16:00");
  const [isDayOff, setIsDayOff] = useState(!currentSchedule);

  const handleSave = () => {
    if (isDayOff) {
      onSave(null);
    } else {
      onSave({ start: startTime, end: endTime });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {staffName} - {dayName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="dayOff"
              checked={isDayOff}
              onChange={(e) => setIsDayOff(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="dayOff">Ledig dag</Label>
          </div>

          {!isDayOff && (
            <>
              <div className="space-y-2">
                <Label htmlFor="startTime">Starttid</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Sluttid</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button onClick={handleSave}>Spara</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
