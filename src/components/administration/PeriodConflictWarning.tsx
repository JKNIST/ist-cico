import { useState } from "react";
import { format } from "date-fns";
import { AlertTriangle, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/useLocale";
import type { PeriodValidationResult } from "@/lib/periodConflictValidation";
import { getCategoryColor } from "@/lib/calendarUtils";

interface PeriodConflictWarningProps {
  conflicts: PeriodValidationResult;
  resolution: "include-all" | "skip-conflicts";
  acknowledgeConflicts: boolean;
  onResolutionChange: (value: "include-all" | "skip-conflicts") => void;
  onAcknowledgeChange: (checked: boolean) => void;
}

export const PeriodConflictWarning = ({
  conflicts,
  resolution,
  acknowledgeConflicts,
  onResolutionChange,
  onAcknowledgeChange,
}: PeriodConflictWarningProps) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [showAll, setShowAll] = useState(false);

  if (!conflicts.hasConflicts) return null;

  const displayedConflicts = showAll
    ? conflicts.conflicts
    : conflicts.conflicts.slice(0, 5);

  const datesToCreate =
    resolution === "skip-conflicts"
      ? conflicts.totalDates - conflicts.conflictingDates
      : conflicts.totalDates;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{t("periodConflict.warning")}</AlertTitle>
      <AlertDescription>
        <div className="space-y-4 mt-3">
          <p className="font-medium">
            {t("periodConflict.affectedDates", {
              conflicting: conflicts.conflictingDates,
              total: conflicts.totalDates,
            })}
          </p>

          {/* List of conflicts */}
          <div className="max-h-48 overflow-y-auto space-y-1 text-sm rounded-md border p-2 bg-muted/30">
            {displayedConflicts.map((conflict, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 py-1.5 border-b last:border-b-0"
              >
                <Calendar className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-xs">
                      {format(conflict.date, "d MMM yyyy", { locale })}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs py-0 px-1.5"
                      style={{
                        backgroundColor: getCategoryColor(conflict.event.category),
                        color: "white",
                      }}
                    >
                      {conflict.event.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground mt-0.5 truncate">
                    {conflict.event.title}
                  </p>
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

          {/* Resolution options */}
          <div className="border-t pt-3 space-y-3">
            <p className="text-sm font-medium">{t("periodConflict.howToHandle")}</p>
            <RadioGroup value={resolution} onValueChange={onResolutionChange}>
              <div className="space-y-3">
                {/* Skip conflicts option */}
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="skip-conflicts" id="skip-conflicts" />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="skip-conflicts"
                      className="text-sm font-normal cursor-pointer"
                    >
                      {t("periodConflict.skipConflicts")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("periodConflict.datesWillBeCreated", { count: datesToCreate })}
                    </p>
                  </div>
                </div>

                {/* Include all option */}
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="include-all" id="include-all" />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="include-all"
                      className="text-sm font-normal cursor-pointer"
                    >
                      {t("periodConflict.createAll")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("periodConflict.allDatesWillBeCreated", { count: conflicts.totalDates })}
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>

            {/* Acknowledgment checkbox for include-all */}
            {resolution === "include-all" && (
              <div className="flex items-start space-x-2 pl-6 pt-2">
                <Checkbox
                  id="acknowledge"
                  checked={acknowledgeConflicts}
                  onCheckedChange={onAcknowledgeChange}
                />
                <Label
                  htmlFor="acknowledge"
                  className="text-sm font-normal cursor-pointer leading-tight"
                >
                  {t("periodConflict.acknowledge")}
                </Label>
              </div>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
