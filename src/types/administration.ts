export enum EventCategory {
  CLOSURE = 'closure',
  WARNING = 'warning',
  EXTERNAL = 'external',
  INTERNAL = 'internal'
}

export enum EventType {
  // Closure (Röd)
  CLOSURE = 'closure',
  
  // Warning (Amber)
  LIMITED_CAPACITY = 'limited_capacity',
  DEADLINE = 'deadline',
  SCHEDULE_CHANGE = 'schedule_change',
  
  // External (Grön)
  EXCURSION = 'excursion',
  CELEBRATION = 'celebration',
  PARENT_MEETING = 'parent_meeting',
  EXTERNAL_VISIT = 'external_visit',
  SHARED_ACTIVITY = 'shared_activity',
  
  // Internal (Blå)
  STAFF_MEETING = 'staff_meeting',
  PLANNING_TIME = 'planning_time',
  INTERNAL_ACTIVITY = 'internal_activity',
  RECURRING_ROUTINE = 'recurring_routine'
}

export interface RecurrenceRule {
  frequency: string;
  interval: number;
  endDate?: Date;
  seriesId: string;
  selectedDays?: string[];
  excludedDates?: Date[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  category: EventCategory;
  type: EventType;
  date: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  allDay: boolean;
  
  // Metadata
  isSharedWithGuardians: boolean;
  isRecurring: boolean;
  recurrenceRule?: RecurrenceRule;
  departments: string[];
  groups?: string[];
  participants?: string;
  
  // System metadata
  source: 'manual' | 'system' | 'integration';
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  
  // For recurring instances
  instanceDate?: Date;
  originalStartDate?: Date;
}

export interface TemporarySchemaPeriod {
  id: string;
  title: string;
  createdBy: string;
  startDate: Date;
  endDate: Date;
  departments: string[];
  activateDate: Date;
  deadline: Date;
  submitted: number;
  remaining: number;
  limitedCapacityDays: Date[];
}

export interface ClosurePeriod {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  departments: string[];
  publishDate: Date;
  isArchived: boolean;
}

export interface AdministrativeEvent {
  type: 'limited-capacity' | 'closure';
  date: Date;
  title: string;
  sourceId: string;
  color: string;
  priority: number;
  activateDate?: Date;  // För limited-capacity
  publishDate?: Date;   // För closure
}
