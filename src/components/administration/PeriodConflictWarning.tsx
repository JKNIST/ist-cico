import { useState } from "react";
import { format } from "date-fns";
import { AlertTriangle, ChevronDown, ChevronUp, Calendar, ExternalLink, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/useLocale";
import type { PeriodValidationResult } from "@/lib/periodConflictValidation";
import { getCategoryColor } from "@/lib/calendarUtils";

interface PeriodConflictWarningProps {
  conflicts: PeriodValidationResult;
  acknowledgeConflicts: boolean;
  onAcknowledgeChange: (checked: boolean) => void;
  onNavigateToEvent?: (eventId: string, date: Date) => void;
}

export const PeriodConflictWarning = ({
  conflicts,
  acknowledgeConflicts,
  onAcknowledgeChange,
  onNavigateToEvent,
}: PeriodConflictWarningProps) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [showAll, setShowAll] = useState(false);

  if (!conflicts.hasConflicts) return null;

  const displayedConflicts = showAll
    ? conflicts.conflicts
    : conflicts.conflicts.slice(0, 5);

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{t("periodConflict.warning")}</AlertTitle>
      <AlertDescription>
        <div className="space-y-4 mt-3">
          <p className="text-sm text-foreground">
            {t("periodConflict.description")}
          </p>

          {/* List of conflicts with deep links */}
          <div className="max-h-48 overflow-y-auto space-y-1 text-sm rounded-md border p-2 bg-muted/30">
            {displayedConflicts.map((conflict, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 py-1.5 border-b last:border-b-0"
              >
                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <span className="font-medium text-xs whitespace-nowrap">
                    {format(conflict.date, "d MMM yyyy", { locale })}
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-xs py-0 px-1.5 shrink-0"
                    style={{
                      backgroundColor: getCategoryColor(conflict.event.category),
                      color: "white",
                    }}
                  >
                    {t(`calendar.categories.${conflict.event.category}`)}
                  </Badge>
                  <span className="text-xs text-foreground truncate">
                    {conflict.event.title}
                  </span>
                </div>
                {onNavigateToEvent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs shrink-0"
                    onClick={() => onNavigateToEvent(conflict.event.id, conflict.date)}
                  >
                    {t("periodConflict.viewEvent")}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                )}
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

          {/* Tip */}
          <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-md p-2">
            <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{t("periodConflict.tip")}</p>
          </div>

          {/* Acknowledgment checkbox */}
          <div className="flex items-start space-x-2 pt-2 border-t">
            <Checkbox
              id="acknowledge-period"
              checked={acknowledgeConflicts}
              onCheckedChange={onAcknowledgeChange}
            />
            <Label
              htmlFor="acknowledge-period"
              className="text-sm font-normal cursor-pointer leading-tight"
            >
              {t("periodConflict.acknowledge")}
            </Label>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
