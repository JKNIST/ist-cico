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
  const { t } = useTranslation();
  const locale = useLocale();
  
  if (!period) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("closurePeriodDialog.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">{t("closurePeriodDialog.titleLabel")}</Label>
            <p className="text-lg font-semibold">{period.title}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">{t("closurePeriodDialog.departmentsLabel")}</Label>
            <div className="flex flex-wrap gap-2">
              {period.departments.map((dept) => (
                <Badge key={dept} variant="secondary">
                  {dept}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">{t("closurePeriodDialog.closurePeriodLabel")}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{t("closurePeriodDialog.from")}</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{format(period.startDate, "dd MMM yyyy", { locale })}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{t("closurePeriodDialog.to")}</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{format(period.endDate, "dd MMM yyyy", { locale })}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">
              {t("closurePeriodDialog.publishedNotification")}
            </Label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium">{format(period.publishDate, "dd MMM yyyy", { locale })}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Button onClick={() => onOpenChange(false)}>
            {t("closurePeriodDialog.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
