import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/useLocale";

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
  const { t } = useTranslation();
  const locale = useLocale();
  
  if (!period) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("temporaryPeriodDialog.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">{t("temporaryPeriodDialog.titleLabel")}</Label>
            <p className="text-lg font-semibold">{period.title}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">{t("temporaryPeriodDialog.departmentsLabel")}</Label>
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
              <Label className="text-muted-foreground">{t("temporaryPeriodDialog.schedulePeriodFrom")}</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{format(period.startDate, "PPP", { locale })}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">{t("temporaryPeriodDialog.schedulePeriodTo")}</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{format(period.endDate, "PPP", { locale })}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">{t("temporaryPeriodDialog.activated")}</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{format(period.activateDate, "PPP", { locale })}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">{t("temporaryPeriodDialog.deadline")}</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{format(period.deadline, "PPP", { locale })}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Status</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <p className="text-sm text-muted-foreground">{t("temporaryPeriodDialog.submissionStatus")}</p>
                <p className="text-2xl font-bold text-green-600">{period.submitted}</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-sm text-muted-foreground">{t("temporaryPeriodDialog.remainingSubmissions")}</p>
                <p className="text-2xl font-bold text-amber-600">{period.remaining}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">{t("temporaryPeriodDialog.limitedCapacityDays")}</Label>
            <p className="text-sm font-medium mb-2">
              {period.limitedCapacityDays.length > 0 
                ? `${period.limitedCapacityDays.length} ${t("temporaryPeriodDialog.limitedCapacityDays").toLowerCase()}`
                : t("temporaryPeriodDialog.noDays")}
            </p>
            {period.limitedCapacityDays.length > 0 && (
              <div className="border rounded-lg p-4 bg-amber-50 space-y-1">
                {period.limitedCapacityDays.map((day, idx) => (
                  <div key={idx} className="text-sm">
                    {format(day, "EEEE, d MMMM yyyy", { locale })}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">{t("temporaryPeriodDialog.createdBy")}</Label>
            <p className="font-medium">{period.createdBy}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Button onClick={() => onOpenChange(false)}>
            {t("temporaryPeriodDialog.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
