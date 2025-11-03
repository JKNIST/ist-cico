import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { CalendarIcon, Clock, Users } from "lucide-react";

interface ViewEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    id: string;
    title: string;
    description?: string;
    date: Date;
    startTime?: string;
    endTime?: string;
    isAllDay?: boolean;
    shareWithGuardians?: boolean;
    departments?: string[];
    participants?: string;
    isRecurring?: boolean;
    recurrenceRule?: {
      frequency: string;
      interval: number;
      endDate?: Date;
      selectedDays?: string[];
    };
    createdBy?: string;
    createdAt?: Date;
    updatedBy?: string;
    updatedAt?: Date;
  } | null;
  onDelete: () => void;
  onEdit: () => void;
}

export function ViewEventDialog({ open, onOpenChange, event, onDelete, onEdit }: ViewEventDialogProps) {
  if (!event) return null;

  const getRecurrenceSummary = () => {
    if (!event.recurrenceRule) return null;
    
    const { frequency, interval, endDate, selectedDays } = event.recurrenceRule;
    let text = "Inträffar ";
    
    if (frequency === "weekly" && selectedDays && selectedDays.length > 0) {
      const dayNames: { [key: string]: string } = {
        mon: "måndag", tue: "tisdag", wed: "onsdag", 
        thu: "torsdag", fri: "fredag", sat: "lördag", sun: "söndag"
      };
      const days = selectedDays.map(d => dayNames[d]).join(", ");
      text += `varje ${days}`;
    } else {
      const frequencyNames: { [key: string]: string } = {
        daily: "dag", weekly: "vecka", monthly: "månad", yearly: "år"
      };
      text += interval > 1 ? `var ${interval} ${frequencyNames[frequency]}` : `varje ${frequencyNames[frequency]}`;
    }
    
    if (endDate) {
      text += ` till ${format(endDate, "EEEE, dd-MM-yyyy", { locale: sv })}`;
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
          {event.shareWithGuardians && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Delas med vårdnadshavare</Badge>
            </div>
          )}

          {/* Departments */}
          {event.departments && event.departments.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Avdelningar:</p>
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
              <span>{event.participants} deltagare</span>
            </div>
          )}

          {/* Date and Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>{format(event.date, "EEEE, d MMMM yyyy", { locale: sv })}</span>
            </div>
            {!event.isAllDay && event.startTime && event.endTime && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{event.startTime} - {event.endTime}</span>
              </div>
            )}
            {event.isAllDay && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Heldag</span>
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
              <p>Skapad av: {event.createdBy} vid {format(event.createdAt, "yyyy-MM-dd HH:mm", { locale: sv })}</p>
            )}
            {event.updatedBy && event.updatedAt && (
              <p>Uppdaterad av: {event.updatedBy} vid {format(event.updatedAt, "yyyy-MM-dd HH:mm", { locale: sv })}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            AVBRYT
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            TA BORT
          </Button>
          <Button className="bg-[#2a9d8f] hover:bg-[#238276]" onClick={onEdit}>
            REDIGERA
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
