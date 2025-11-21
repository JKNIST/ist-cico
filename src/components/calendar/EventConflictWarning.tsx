import { useState } from "react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
      <AlertTitle>Varning: Eventet krockar med administrativa perioder</AlertTitle>
      <AlertDescription>
        <div className="space-y-4 mt-3">
          <p className="font-medium">
            {conflicts.conflictingInstances} av {conflicts.totalInstances} händelser påverkas
          </p>

          {/* List of conflicts */}
          <div className="space-y-1 text-sm">
            {displayedConflicts.map((conflict, idx) => (
              <div key={idx} className="flex items-center gap-2 py-1">
                <span className={conflict.type === "closure" ? "text-red-600" : "text-amber-600"}>
                  {conflict.type === "closure" ? "🔴" : "🟠"}
                </span>
                <span className="font-medium">
                  {format(conflict.date, "d MMM yyyy", { locale: sv })}
                </span>
                <span className="text-muted-foreground">
                  {conflict.type === "closure" ? "Stängning" : "Begränsad kapacitet"}
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
                    Visa färre
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Visa alla {conflicts.conflicts.length} konflikter
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Resolution options */}
          <div className="border-t pt-3 space-y-3">
            <p className="text-sm font-medium">Hur vill du hantera detta?</p>
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
                      Hoppa över dagar med konflikter (rekommenderat)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {eventsToCreate} händelser kommer att skapas
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
                      Skapa alla händelser (inklusive de som krockar)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Alla {conflicts.totalInstances} händelser kommer att skapas
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
                  Jag förstår att detta event krockar med administrativa perioder och vill ändå
                  skapa det
                </Label>
              </div>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
