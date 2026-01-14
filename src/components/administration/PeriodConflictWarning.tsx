import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import type { PeriodValidationResult } from "@/lib/periodConflictValidation";
import type { CalendarEvent } from "@/types/administration";
import { ConflictEventItem } from "./ConflictEventItem";

type RecurringScope = "single" | "future" | "all";

interface PeriodConflictWarningProps {
  conflicts: PeriodValidationResult;
  acknowledgeConflicts: boolean;
  onAcknowledgeChange: (checked: boolean) => void;
  onEditEvent?: (event: CalendarEvent, date: Date, scope?: RecurringScope) => void;
  onDeleteEvent?: (event: CalendarEvent, date: Date, scope?: RecurringScope) => void;
}

export const PeriodConflictWarning = ({
  conflicts,
  acknowledgeConflicts,
  onAcknowledgeChange,
  onEditEvent,
  onDeleteEvent,
}: PeriodConflictWarningProps) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  if (!conflicts.hasConflicts) return null;

  const displayedConflicts = showAll
    ? conflicts.conflicts
    : conflicts.conflicts.slice(0, 5);

  const handleToggleExpand = (eventId: string, idx: number) => {
    const uniqueId = `${eventId}-${idx}`;
    setExpandedEventId(expandedEventId === uniqueId ? null : uniqueId);
  };

  const handleEdit = (event: CalendarEvent, date: Date, scope?: RecurringScope) => {
    if (onEditEvent) {
      onEditEvent(event, date, scope);
    }
  };

  const handleDelete = (event: CalendarEvent, date: Date, scope?: RecurringScope) => {
    if (onDeleteEvent) {
      onDeleteEvent(event, date, scope);
    }
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{t("periodConflict.warning")}</AlertTitle>
      <AlertDescription>
        <div className="space-y-4 mt-3">
          <p className="text-sm text-foreground">
            {t("periodConflict.description")}
          </p>

          {/* List of conflicts with inline expansion */}
          <div className="max-h-64 overflow-y-auto space-y-2 rounded-md border p-2 bg-muted/30">
            {displayedConflicts.map((conflict, idx) => (
              <ConflictEventItem
                key={`${conflict.event.id}-${idx}`}
                event={conflict.event}
                date={conflict.date}
                isExpanded={expandedEventId === `${conflict.event.id}-${idx}`}
                onToggleExpand={() => handleToggleExpand(conflict.event.id, idx)}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
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
