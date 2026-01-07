import { eachDayOfInterval, isSameDay } from "date-fns";
import { CalendarEvent } from "@/types/administration";

export interface PeriodEventConflict {
  date: Date;
  event: CalendarEvent;
}

export interface PeriodValidationResult {
  hasConflicts: boolean;
  conflicts: PeriodEventConflict[];
  totalDates: number;
  conflictingDates: number;
}

/**
 * Check if a single date conflicts with any calendar events
 */
const findConflictingEvents = (
  date: Date,
  events: CalendarEvent[]
): CalendarEvent[] => {
  return events.filter((event) => {
    // Check if event falls on this date
    if (isSameDay(event.date, date)) {
      return true;
    }
    
    // Check if multi-day event spans this date
    if (event.endDate) {
      const eventDays = eachDayOfInterval({
        start: event.date,
        end: event.endDate,
      });
      return eventDays.some((eventDay) => isSameDay(eventDay, date));
    }
    
    return false;
  });
};

/**
 * Validate closure period against existing calendar events
 * Checks all days in the date range
 */
export const validateClosurePeriodConflicts = (
  startDate: Date,
  endDate: Date,
  existingEvents: CalendarEvent[]
): PeriodValidationResult => {
  const periodDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const conflicts: PeriodEventConflict[] = [];
  const seenEventIds = new Set<string>();

  periodDays.forEach((day) => {
    const conflictingEvents = findConflictingEvents(day, existingEvents);
    
    conflictingEvents.forEach((event) => {
      // Avoid duplicate entries for the same event
      const conflictKey = `${event.id}-${day.toISOString()}`;
      if (!seenEventIds.has(conflictKey)) {
        seenEventIds.add(conflictKey);
        conflicts.push({
          date: day,
          event,
        });
      }
    });
  });

  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
    totalDates: periodDays.length,
    conflictingDates: new Set(conflicts.map((c) => c.date.toISOString())).size,
  };
};

/**
 * Validate temporary schedule period against existing calendar events
 * Only checks the specific limited capacity days
 */
export const validateTemporaryPeriodConflicts = (
  limitedCapacityDays: Date[],
  existingEvents: CalendarEvent[]
): PeriodValidationResult => {
  const conflicts: PeriodEventConflict[] = [];
  const seenEventIds = new Set<string>();

  limitedCapacityDays.forEach((day) => {
    const conflictingEvents = findConflictingEvents(day, existingEvents);
    
    conflictingEvents.forEach((event) => {
      const conflictKey = `${event.id}-${day.toISOString()}`;
      if (!seenEventIds.has(conflictKey)) {
        seenEventIds.add(conflictKey);
        conflicts.push({
          date: day,
          event,
        });
      }
    });
  });

  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
    totalDates: limitedCapacityDays.length,
    conflictingDates: new Set(conflicts.map((c) => c.date.toISOString())).size,
  };
};
