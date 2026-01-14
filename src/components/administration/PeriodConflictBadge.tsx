import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useTranslation } from "react-i18next";
import type { PeriodValidationResult } from "@/lib/periodConflictValidation";
import type { CalendarEvent } from "@/types/administration";
import { ConflictEventItem } from "./ConflictEventItem";

type RecurringScope = "single" | "future" | "all";

interface PeriodConflictBadgeProps {
  conflicts: PeriodValidationResult;
  onEditEvent?: (event: CalendarEvent, date: Date, scope?: RecurringScope) => void;
  onDeleteEvent?: (event: CalendarEvent, date: Date, scope?: RecurringScope) => void;
}

export const PeriodConflictBadge = ({ 
  conflicts, 
  onEditEvent,
  onDeleteEvent 
}: PeriodConflictBadgeProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  if (!conflicts.hasConflicts) return null;

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

  const displayedConflicts = isOpen
    ? conflicts.conflicts
    : conflicts.conflicts.slice(0, 3);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-3 text-left hover:bg-amber-100/50 dark:hover:bg-amber-900/20 transition-colors rounded-t-md">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 shrink-0" />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                {t("periodConflictBadge.conflictCount", { count: conflicts.conflicts.length })}
              </span>
            </div>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            )}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-amber-200 dark:border-amber-900/50 p-3 space-y-2">
            <p className="text-xs text-amber-700 dark:text-amber-300 mb-3">
              {t("periodConflictBadge.description")}
            </p>
            
            <div className="space-y-2">
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

            {conflicts.conflicts.length > 3 && !isOpen && (
              <p className="text-xs text-amber-600 dark:text-amber-400 pt-1">
                {t("periodConflictBadge.andMore", { count: conflicts.conflicts.length - 3 })}
              </p>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
