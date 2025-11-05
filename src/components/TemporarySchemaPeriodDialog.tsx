import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface TemporarySchemaPeriod {
  id: string;
  title: string;
  createdBy: string;
  startDate: Date;
  endDate: Date;
  departments: string[];
  activateDate: Date;
  deadline: Date;
  submitted: number;
  remaining: number;
  limitedCapacityDays: Date[];
}

interface TemporarySchemaPeriodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period: TemporarySchemaPeriod | null;
  onSave: (period: TemporarySchemaPeriod) => void;
}

export function TemporarySchemaPeriodDialog({
  open,
  onOpenChange,
  period,
}: TemporarySchemaPeriodDialogProps) {
  if (!period) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Temporär schemaperiod</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Titel</Label>
            <p className="text-lg font-semibold">{period.title}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Avdelningar</Label>
            <div className="flex flex-wrap gap-2">
              {period.departments.map((dept) => (
                <Badge key={dept} variant="secondary">
                  {dept}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Schemaperiod - Från</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{format(period.startDate, "PPP", { locale: sv })}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Schemaperiod - Till</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{format(period.endDate, "PPP", { locale: sv })}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Aktiverad</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{format(period.activateDate, "PPP", { locale: sv })}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Deadline</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{format(period.deadline, "PPP", { locale: sv })}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Status</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Inskickat</p>
                <p className="text-2xl font-bold text-green-600">{period.submitted}</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Återstår</p>
                <p className="text-2xl font-bold text-amber-600">{period.remaining}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Dagar med begränsad kapacitet</Label>
            <p className="text-sm font-medium mb-2">{period.limitedCapacityDays.length} dagar</p>
            <div className="border rounded-lg p-4 bg-amber-50 space-y-1">
              {period.limitedCapacityDays.map((day, idx) => (
                <div key={idx} className="text-sm">
                  {format(day, "EEEE, d MMMM yyyy", { locale: sv })}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Skapad av</Label>
            <p className="font-medium">{period.createdBy}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Button onClick={() => onOpenChange(false)}>
            Stäng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
