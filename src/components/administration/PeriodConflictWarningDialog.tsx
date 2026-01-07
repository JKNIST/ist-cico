import { useState } from "react";
import { format } from "date-fns";
import { AlertTriangle, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/useLocale";
import type { PeriodValidationResult } from "@/lib/periodConflictValidation";
import { getCategoryColor } from "@/lib/calendarUtils";

interface PeriodConflictWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conflicts: PeriodValidationResult;
  periodType: "closure" | "temporary";
  onAbort: () => void;
  onCreateAnyway: () => void;
}

export const PeriodConflictWarningDialog = ({
  open,
  onOpenChange,
  conflicts,
  periodType,
  onAbort,
  onCreateAnyway,
}: PeriodConflictWarningDialogProps) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [showAll, setShowAll] = useState(false);

  if (!conflicts.hasConflicts) return null;

  const displayedConflicts = showAll
    ? conflicts.conflicts
    : conflicts.conflicts.slice(0, 5);

  const handleAbort = () => {
    onAbort();
    onOpenChange(false);
  };

  const handleCreateAnyway = () => {
    onCreateAnyway();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            {t("periodConflict.title")}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p className="font-medium text-foreground">
                {t("periodConflict.warningMessage", {
                  conflicting: conflicts.conflictingDates,
                  total: conflicts.totalDates,
                })}
              </p>

              <p className="text-sm text-muted-foreground">
                {t("periodConflict.conflictingEvents")}
              </p>

              {/* List of conflicts */}
              <div className="max-h-64 overflow-y-auto space-y-2 rounded-md border p-3 bg-muted/30">
                {displayedConflicts.map((conflict, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 py-2 border-b last:border-b-0"
                  >
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">
                          {format(conflict.date, "d MMM yyyy", { locale })}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-xs"
                          style={{
                            backgroundColor: getCategoryColor(conflict.event.category),
                            color: "white",
                          }}
                        >
                          {conflict.event.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground mt-1">
                        {conflict.event.title}
                      </p>
                      {conflict.event.startTime && (
                        <p className="text-xs text-muted-foreground">
                          {conflict.event.allDay
                            ? t("calendar.allDay")
                            : `${conflict.event.startTime}${
                                conflict.event.endTime
                                  ? ` - ${conflict.event.endTime}`
                                  : ""
                              }`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {conflicts.conflicts.length > 5 && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-sm"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      {t("periodConflict.showFewer")}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      {t("periodConflict.showAll", {
                        count: conflicts.conflicts.length,
                      })}
                    </>
                  )}
                </Button>
              )}

              <p className="text-sm font-medium pt-2">
                {t("periodConflict.confirmQuestion")}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={handleAbort}>
            {t("periodConflict.abort")}
          </Button>
          <Button onClick={handleCreateAnyway}>
            {t("periodConflict.createAnyway")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
