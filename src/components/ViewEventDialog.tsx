import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { CalendarIcon, Clock, Users, Repeat, Building2, User, Share2 } from "lucide-react";
import { CalendarEvent, EventCategory } from "@/types/administration";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/useLocale";
import { getCategoryColor } from "@/lib/calendarUtils";

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

  const categoryColor = getCategoryColor(event.category);

  const categoryLabel = (() => {
    switch (event.category) {
      case EventCategory.CLOSURE: return t('eventDialog.category.closure', { defaultValue: 'Stängning' });
      case EventCategory.WARNING: return t('eventDialog.category.warning', { defaultValue: 'Varning' });
      case EventCategory.EXTERNAL: return t('eventDialog.category.external', { defaultValue: 'Extern' });
      case EventCategory.INTERNAL: return t('eventDialog.category.internal', { defaultValue: 'Intern' });
      default: return '';
    }
  })();

  const getRecurrenceSummary = () => {
    if (!event.recurrenceRule) return null;
    const { frequency, interval, endDate, selectedDays } = event.recurrenceRule;

    if (frequency === "weekly" && selectedDays && selectedDays.length > 0) {
      const dayNames: Record<string, string> = {
        mon: t('eventDialog.weekdays.monday'),
        tue: t('eventDialog.weekdays.tuesday'),
        wed: t('eventDialog.weekdays.wednesday'),
        thu: t('eventDialog.weekdays.thursday'),
        fri: t('eventDialog.weekdays.friday'),
        sat: t('eventDialog.weekdays.saturday'),
        sun: t('eventDialog.weekdays.sunday'),
      };
      const days = selectedDays.map(d => dayNames[d]).join(", ");
      let text = `${t('eventDialog.occursEvery')} ${days}`;
      if (endDate) text += ` ${t('eventDialog.until')} ${format(endDate, "d MMM yyyy", { locale })}`;
      return text;
    }

    const frequencyNames: Record<string, string> = {
      daily: t('eventDialog.day'),
      weekly: t('eventDialog.week'),
      monthly: t('eventDialog.month'),
      yearly: t('eventDialog.year'),
    };
    let text = interval > 1
      ? `${t('eventDialog.occursEveryNumber')} ${interval} ${frequencyNames[frequency]}`
      : `${t('eventDialog.occursEvery')} ${frequencyNames[frequency]}`;
    if (endDate) text += ` ${t('eventDialog.until')} ${format(endDate, "d MMM yyyy", { locale })}`;
    return text;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-l-4"
        style={{ borderLeftColor: categoryColor }}
      >
        <div className="p-6">
          {/* Top status chips */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: categoryColor, color: '#1f2937' }}
            >
              {categoryLabel}
            </span>
            {event.isSharedWithGuardians && (
              <span className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-xs text-gray-700">
                <Share2 className="h-3 w-3" />
                {t('eventDialog.sharedWithGuardians')}
              </span>
            )}
          </div>

          {/* Title */}
          <DialogHeader className="space-y-0">
            <DialogTitle className="text-xl font-medium text-gray-800 text-left">
              {event.title}
            </DialogTitle>
          </DialogHeader>

          {/* Description */}
          {event.description && (
            <p className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          )}

          <div className="my-5 border-t border-gray-200" />

          {/* WHEN section */}
          <section>
            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-2 font-medium">
              {t('eventDialog.sections.when', { defaultValue: 'När' })}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span>{format(event.date, "EEEE, d MMMM yyyy", { locale })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>
                  {event.allDay
                    ? t('eventDialog.allDay')
                    : `${event.startTime ?? ''} – ${event.endTime ?? ''}`}
                </span>
              </div>
              {event.isRecurring && event.recurrenceRule && (
                <div className="flex items-center gap-2 text-sm text-gray-800">
                  <Repeat className="h-4 w-4 text-gray-500" />
                  <span>{getRecurrenceSummary()}</span>
                </div>
              )}
            </div>
          </section>

          {/* WHO section */}
          {((event.departments && event.departments.length > 0) || event.participants) && (
            <>
              <div className="my-5 border-t border-gray-200" />
              <section>
                <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-2 font-medium">
                  {t('eventDialog.sections.who', { defaultValue: 'Vem' })}
                </p>
                <div className="space-y-2.5">
                  {event.departments && event.departments.length > 0 && (
                    <div className="flex items-start gap-2 text-sm text-gray-800">
                      <Building2 className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                      <div className="flex flex-wrap gap-1.5">
                        {event.departments.map((dept) => (
                          <span
                            key={dept}
                            className="inline-flex items-center border border-gray-300 rounded-full px-2.5 py-0.5 text-xs text-gray-700 bg-white"
                          >
                            {dept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {event.participants && (
                    <div className="flex items-center gap-2 text-sm text-gray-800">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{event.participants} {t('eventDialog.participants')}</span>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {/* Metadata footer */}
          {(event.createdBy || event.updatedAt) && (
            <>
              <div className="my-5 border-t border-gray-200" />
              <div className="space-y-1 text-[11px] text-gray-500">
                {event.createdBy && event.createdAt && (
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    <span>
                      {t('eventDialog.createdBy')}: {event.createdBy} · {format(event.createdAt, "yyyy-MM-dd HH:mm", { locale })}
                    </span>
                  </div>
                )}
                {event.updatedAt && (
                  <div className="pl-5">
                    {t('eventDialog.lastUpdated', { defaultValue: 'Senast uppdaterad' })}: {format(event.updatedAt, "yyyy-MM-dd HH:mm", { locale })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Action buttons — uppercase text-only, matches edit dialog */}
        <div className="flex items-center px-6 pb-5 pt-1">
          <button
            type="button"
            onClick={onDelete}
            className="text-sm font-medium uppercase tracking-wide text-red-500 hover:text-red-600"
          >
            {t('eventDialog.delete')}
          </button>
          <div className="ml-auto flex items-center gap-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-sm font-medium uppercase tracking-wide text-[#2a9d8f] hover:text-[#238276]"
            >
              {t('eventDialog.cancel')}
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="text-sm font-medium uppercase tracking-wide text-[#2a9d8f] hover:text-[#238276]"
            >
              {t('eventDialog.edit')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
