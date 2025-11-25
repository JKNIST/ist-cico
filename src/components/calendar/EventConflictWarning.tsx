import { useState } from "react";
import { format } from "date-fns";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/useLocale";
import type { ValidationResult } from "@/lib/eventConflictValidation";

interface EventConflictWarningProps {
  conflicts: ValidationResult;
  resolution: "include-all" | "skip-conflicts";
  acknowledgeConflicts: boolean;
  onResolutionChange: (value: "include-all" | "skip-conflicts") => void;
  onAcknowledgeChange: (checked: boolean) => void;
}

export const EventConflictWarning = ({
  conflicts,
  resolution,
  acknowledgeConflicts,
  onResolutionChange,
  onAcknowledgeChange,
}: EventConflictWarningProps) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [showAll, setShowAll] = useState(false);

  if (!conflicts.hasConflicts) return null;

  const displayedConflicts = showAll
    ? conflicts.conflicts
    : conflicts.conflicts.slice(0, 5);

  const eventsToCreate =
    resolution === "skip-conflicts"
      ? conflicts.totalInstances - conflicts.conflictingInstances
      : conflicts.totalInstances;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{t("eventConflict.warning")}</AlertTitle>
      <AlertDescription>
        <div className="space-y-4 mt-3">
          <p className="font-medium">
            {t("eventConflict.affectedEvents", {
              conflicting: conflicts.conflictingInstances,
              total: conflicts.totalInstances,
            })}
          </p>

          {/* List of conflicts */}
          <div className="space-y-1 text-sm">
            {displayedConflicts.map((conflict, idx) => (
              <div key={idx} className="flex items-center gap-2 py-1">
                <span className={conflict.type === "closure" ? "text-red-600" : "text-amber-600"}>
                  {conflict.type === "closure" ? "🔴" : "🟠"}
                </span>
                <span className="font-medium">
                  {format(conflict.date, "d MMM yyyy", { locale })}
                </span>
                <span className="text-muted-foreground">
                  {t(`eventDialog.conflicts.${conflict.type}`)}
                </span>
                <span className="text-muted-foreground">- {conflict.title}</span>
              </div>
            ))}
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
                    {t("eventDialog.conflicts.showFewer")}
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    {t("eventDialog.conflicts.showAll", { count: conflicts.conflicts.length })}
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Resolution options */}
          <div className="border-t pt-3 space-y-3">
            <p className="text-sm font-medium">{t("eventConflict.howToHandle")}</p>
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
                      {t("eventConflict.skipConflicts")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("eventConflict.eventsWillBeCreated", { count: eventsToCreate })}
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
                      {t("eventConflict.createAll")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("eventConflict.allEventsWillBeCreated", { count: conflicts.totalInstances })}
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
                  {t("eventConflict.acknowledge")}
                </Label>
              </div>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
