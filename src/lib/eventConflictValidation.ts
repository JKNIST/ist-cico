import { isSameDay, isBefore, isAfter, addDays, addWeeks, addMonths } from "date-fns";
import type { ClosurePeriod, TemporarySchemaPeriod, RecurrenceRule } from "@/types/administration";

export interface ConflictWarning {
  date: Date;
  type: 'closure' | 'limited-capacity';
  title: string;
  periodId: string;
}

export interface ValidationResult {
  hasConflicts: boolean;
  conflicts: ConflictWarning[];
  totalInstances: number;
  conflictingInstances: number;
}

interface EventData {
  startDate: Date;
  endDate?: Date;
  isRecurring: boolean;
  recurrenceRule?: Partial<RecurrenceRule>;
}

const generateEventInstances = (eventData: EventData): Date[] => {
  const instances: Date[] = [eventData.startDate];

  if (!eventData.isRecurring || !eventData.recurrenceRule) {
    return instances;
  }

  const { frequency, interval = 1, endDate, selectedDays } = eventData.recurrenceRule;
  
  if (!frequency) return instances;

  const maxDate = endDate || addMonths(eventData.startDate, 12); // Default 12 months if no end date
  let currentDate = eventData.startDate;

  while (isBefore(currentDate, maxDate)) {
    // Generate next instance based on frequency
    switch (frequency) {
      case "daily":
        currentDate = addDays(currentDate, interval);
        break;
      case "weekly":
        if (selectedDays && selectedDays.length > 0) {
          // Weekly with specific days - more complex logic
          const currentDay = currentDate.getDay();
          let nextDate = addDays(currentDate, 1);
          let foundNext = false;
          
          // Look for next selected day in current week
          for (let i = 1; i <= 7; i++) {
            const checkDate = addDays(currentDate, i);
            const checkDay = checkDate.getDay();
            if (selectedDays.includes(checkDay.toString()) && isBefore(checkDate, maxDate)) {
              currentDate = checkDate;
              foundNext = true;
              break;
            }
          }
          
          // If no next day in week, jump to next week's first selected day
          if (!foundNext) {
            currentDate = addWeeks(currentDate, interval);
            const weekStart = currentDate;
            for (let i = 0; i < 7; i++) {
              const checkDate = addDays(weekStart, i);
              const checkDay = checkDate.getDay();
              if (selectedDays.includes(checkDay.toString())) {
                currentDate = checkDate;
                break;
              }
            }
          }
        } else {
          currentDate = addWeeks(currentDate, interval);
        }
        break;
      case "monthly":
        currentDate = addMonths(currentDate, interval);
        break;
      default:
        return instances;
    }

    if (isBefore(currentDate, maxDate) || isSameDay(currentDate, maxDate)) {
      instances.push(currentDate);
    } else {
      break;
    }

    // Safety limit
    if (instances.length > 365) break;
  }

  return instances;
};

export const validateEventConflicts = (
  eventData: EventData,
  closurePeriods: ClosurePeriod[],
  temporaryPeriods: TemporarySchemaPeriod[]
): ValidationResult => {
  const instances = generateEventInstances(eventData);
  const conflicts: ConflictWarning[] = [];

  instances.forEach((instanceDate) => {
    // Check against closure periods
    closurePeriods.forEach((period) => {
      const isWithinClosure =
        (isSameDay(instanceDate, period.startDate) || isAfter(instanceDate, period.startDate)) &&
        (isSameDay(instanceDate, period.endDate) || isBefore(instanceDate, period.endDate));

      if (isWithinClosure) {
        conflicts.push({
          date: instanceDate,
          type: "closure",
          title: period.title,
          periodId: period.id,
        });
      }
    });

    // Check against limited capacity days
    temporaryPeriods.forEach((period) => {
      const hasLimitedCapacity = period.limitedCapacityDays.some((day) =>
        isSameDay(day, instanceDate)
      );

      if (hasLimitedCapacity) {
        conflicts.push({
          date: instanceDate,
          type: "limited-capacity",
          title: period.title,
          periodId: period.id,
        });
      }
    });
  });

  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
    totalInstances: instances.length,
    conflictingInstances: conflicts.length,
  };
};
