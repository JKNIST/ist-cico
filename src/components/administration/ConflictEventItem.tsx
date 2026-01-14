import { useState } from "react";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  Building,
  Repeat,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/useLocale";
import type { CalendarEvent } from "@/types/administration";
import { getCategoryColor } from "@/lib/calendarUtils";

type RecurringScope = "single" | "future" | "all";

interface ConflictEventItemProps {
  event: CalendarEvent;
  date: Date;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: (event: CalendarEvent, date: Date, scope?: RecurringScope) => void;
  onDelete: (event: CalendarEvent, date: Date, scope?: RecurringScope) => void;
}

export const ConflictEventItem = ({
  event,
  date,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
}: ConflictEventItemProps) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showScopeDialog, setShowScopeDialog] = useState<"edit" | "delete" | null>(null);
  const [selectedScope, setSelectedScope] = useState<RecurringScope>("single");

  const handleEditClick = () => {
    if (event.isRecurring) {
      setShowScopeDialog("edit");
    } else {
      onEdit(event, date);
    }
  };

  const handleDeleteClick = () => {
    if (event.isRecurring) {
      setShowScopeDialog("delete");
    } else {
      setShowDeleteDialog(true);
    }
  };

  const handleScopeConfirm = () => {
    if (showScopeDialog === "edit") {
      onEdit(event, date, selectedScope);
    } else if (showScopeDialog === "delete") {
      onDelete(event, date, selectedScope);
    }
    setShowScopeDialog(null);
    setSelectedScope("single");
  };

  const handleDeleteConfirm = () => {
    onDelete(event, date);
    setShowDeleteDialog(false);
  };

  const categoryColor = getCategoryColor(event.category);

  return (
    <>
      <div className="rounded-lg border bg-card overflow-hidden">
        {/* Collapsed header - always visible */}
        <button
          onClick={onToggleExpand}
          className="w-full flex items-center gap-2 p-3 text-left hover:bg-muted/50 transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          
          <span className="font-medium text-sm whitespace-nowrap text-foreground">
            {format(date, "d MMM", { locale })}
          </span>
          
          {/* Category indicator - dot style for better readability */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: categoryColor }}
            />
            <span className="text-xs text-muted-foreground">
              {t(`calendar.categories.${event.category}`)}
            </span>
          </div>
          
          <span className="text-sm text-foreground truncate flex-1">
            {event.title}
          </span>
          
          {event.isRecurring && (
            <Repeat className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          )}
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="border-t px-4 py-3 space-y-3 bg-muted/20">
            {/* Description */}
            {event.description && (
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>
            )}

            {/* Event details */}
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {/* Date & Time */}
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {format(date, "d MMM yyyy", { locale })}
                  {event.endDate && event.endDate.getTime() !== date.getTime() && (
                    <> - {format(event.endDate, "d MMM yyyy", { locale })}</>
                  )}
                </span>
              </div>

              {!event.allDay && event.startTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {event.startTime}
                    {event.endTime && ` - ${event.endTime}`}
                  </span>
                </div>
              )}

              {event.allDay && (
                <Badge variant="secondary" className="text-xs py-0 h-5">
                  {t("calendar.allDay")}
                </Badge>
              )}
            </div>

            {/* Departments */}
            {event.departments && event.departments.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Building className="h-3.5 w-3.5" />
                <span>{event.departments.join(", ")}</span>
              </div>
            )}

            {/* Recurring info */}
            {event.isRecurring && (
              <div className="flex items-center gap-1.5 text-xs">
                <Repeat className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {t("conflictEvent.recurring")}
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                className="gap-1.5"
              >
                <Pencil className="h-3.5 w-3.5" />
                {t("conflictEvent.editEvent")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteClick}
                className="gap-1.5 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t("conflictEvent.deleteEvent")}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog (non-recurring) */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("conflictEvent.confirmDeleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("conflictEvent.confirmDeleteDescription", { title: event.title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("eventDialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t("eventDialog.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Scope selection dialog (recurring events) */}
      <AlertDialog open={!!showScopeDialog} onOpenChange={() => setShowScopeDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {showScopeDialog === "edit"
                ? t("conflictEvent.editRecurringTitle")
                : t("conflictEvent.deleteRecurringTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("conflictEvent.recurringDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <RadioGroup
            value={selectedScope}
            onValueChange={(value) => setSelectedScope(value as RecurringScope)}
            className="space-y-2 py-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id="scope-single" />
              <Label htmlFor="scope-single" className="cursor-pointer">
                {t("conflictEvent.thisInstance")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="future" id="scope-future" />
              <Label htmlFor="scope-future" className="cursor-pointer">
                {t("conflictEvent.thisAndFuture")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="scope-all" />
              <Label htmlFor="scope-all" className="cursor-pointer">
                {t("conflictEvent.allInstances")}
              </Label>
            </div>
          </RadioGroup>

          <AlertDialogFooter>
            <AlertDialogCancel>{t("eventDialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleScopeConfirm}
              className={showScopeDialog === "delete" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            >
              {showScopeDialog === "edit" ? t("eventDialog.edit") : t("eventDialog.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
