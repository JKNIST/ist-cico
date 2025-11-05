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

interface ClosurePeriod {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  departments: string[];
  publishDate: Date;
  isArchived: boolean;
}

interface ClosurePeriodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period: ClosurePeriod | null;
  onSave: (period: ClosurePeriod) => void;
}

export function ClosurePeriodDialog({
  open,
  onOpenChange,
  period,
}: ClosurePeriodDialogProps) {
  if (!period) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Stängningsperiod</DialogTitle>
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

          <div className="space-y-2">
            <Label className="text-muted-foreground">Stängningsperiod</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Från</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{format(period.startDate, "dd MMM yyyy", { locale: sv })}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Till</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{format(period.endDate, "dd MMM yyyy", { locale: sv })}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Publicerad</Label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium">{format(period.publishDate, "dd MMM yyyy", { locale: sv })}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Vårdnadshavare notifierades om stängningen detta datum
            </p>
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
