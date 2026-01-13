import { useState } from "react";
import { format } from "date-fns";
import { AlertTriangle, Calendar, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/useLocale";
import type { PeriodValidationResult } from "@/lib/periodConflictValidation";
import { getCategoryColor } from "@/lib/calendarUtils";

interface PeriodConflictBadgeProps {
  conflicts: PeriodValidationResult;
}

export const PeriodConflictBadge = ({ conflicts }: PeriodConflictBadgeProps) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!conflicts.hasConflicts) return null;

  const handleNavigateToEvent = (eventId: string, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    navigate(`/calendar?date=${dateStr}&eventId=${eventId}&mode=edit`);
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
            <p className="text-xs text-amber-700 dark:text-amber-300 mb-2">
              {t("periodConflictBadge.description")}
            </p>
            
            <div className="space-y-1.5">
              {displayedConflicts.map((conflict, idx) => (
                <div
                  key={`${conflict.event.id}-${idx}`}
                  className="flex items-center gap-2 py-1.5 px-2 rounded bg-white/50 dark:bg-black/20"
                >
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="font-medium text-xs whitespace-nowrap text-foreground">
                      {format(conflict.date, "d MMM", { locale })}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs shrink-0 text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateToEvent(conflict.event.id, conflict.date);
                    }}
                  >
                    {t("periodConflictBadge.view")}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
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
