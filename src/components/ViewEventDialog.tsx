import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, Clock, Users } from "lucide-react";
import { CalendarEvent } from "@/types/administration";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/useLocale";

interface ViewEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEvent | null;
  onDelete: () => void;
  onEdit: () => void;
}

export function ViewEventDialog({ open, onOpenChange, event, onDelete, onEdit }: ViewEventDialogProps) {
  const { t } = useTranslation();
  const locale = useLocale();
  
  if (!event) return null;

  const getRecurrenceSummary = () => {
    if (!event.recurrenceRule) return null;
    
    const { frequency, interval, endDate, selectedDays } = event.recurrenceRule;
    let text = t('eventDialog.occursEvery') + " ";
    
    if (frequency === "weekly" && selectedDays && selectedDays.length > 0) {
      const dayNames: { [key: string]: string } = {
        mon: t('eventDialog.weekdays.monday'),
        tue: t('eventDialog.weekdays.tuesday'),
        wed: t('eventDialog.weekdays.wednesday'),
        thu: t('eventDialog.weekdays.thursday'),
        fri: t('eventDialog.weekdays.friday'),
        sat: t('eventDialog.weekdays.saturday'),
        sun: t('eventDialog.weekdays.sunday')
      };
      const days = selectedDays.map(d => dayNames[d]).join(", ");
      text = t('eventDialog.occursEvery') + " " + days;
    } else {
      const frequencyNames: { [key: string]: string } = {
        daily: t('eventDialog.day'),
        weekly: t('eventDialog.week'),
        monthly: t('eventDialog.month'),
        yearly: t('eventDialog.year')
      };
      text = interval > 1 
        ? `${t('eventDialog.occursEveryNumber')} ${interval} ${frequencyNames[frequency]}` 
        : `${t('eventDialog.occursEvery')} ${frequencyNames[frequency]}`;
    }
    
    if (endDate) {
      text += ` ${t('eventDialog.until')} ${format(endDate, "EEEE, dd-MM-yyyy", { locale })}`;
    }
    
    return text;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          {event.description && (
            <div>
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </div>
          )}

          {/* Share with Guardians */}
          {event.isSharedWithGuardians && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{t('eventDialog.sharedWithGuardians')}</Badge>
            </div>
          )}

          {/* Departments */}
          {event.departments && event.departments.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('eventDialog.departments')}:</p>
              <div className="flex flex-wrap gap-2">
                {event.departments.map((dept, idx) => (
                  <Badge key={idx} variant="outline">{dept}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Participants */}
          {event.participants && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{event.participants} {t('eventDialog.participants')}</span>
            </div>
          )}

          {/* Date and Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>{format(event.date, "EEEE, d MMMM yyyy", { locale })}</span>
            </div>
            {!event.allDay && event.startTime && event.endTime && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{event.startTime} - {event.endTime}</span>
              </div>
            )}
            {event.allDay && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{t('eventDialog.allDay')}</span>
              </div>
            )}
          </div>

          {/* Recurring Event Info */}
          {event.isRecurring && event.recurrenceRule && (
            <div className="text-sm text-muted-foreground">
              {getRecurrenceSummary()}
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t space-y-1 text-xs text-muted-foreground">
            {event.createdBy && event.createdAt && (
              <p>{t('eventDialog.createdBy')}: {event.createdBy} {t('eventDialog.at')} {format(event.createdAt, "yyyy-MM-dd HH:mm", { locale })}</p>
            )}
            {event.updatedAt && (
              <p>{t('eventDialog.lastUpdated')}: {format(event.updatedAt, "yyyy-MM-dd HH:mm", { locale })}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t('eventDialog.cancel')}
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            {t('eventDialog.delete')}
          </Button>
          <Button className="bg-[#2a9d8f] hover:bg-[#238276]" onClick={onEdit}>
            {t('eventDialog.edit')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
