import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, AlertTriangle, XCircle, Share2, Lock, Repeat, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday, addDays, isBefore, isAfter, getISOWeek } from "date-fns";
import { sv } from "date-fns/locale";
import { AddEventDialog } from "@/components/AddEventDialog";
import { ViewEventDialog } from "@/components/ViewEventDialog";
import { RecurringActionDialog } from "@/components/RecurringActionDialog";
import { TemporarySchemaPeriodDialog } from "@/components/TemporarySchemaPeriodDialog";
import { ClosurePeriodDialog } from "@/components/ClosurePeriodDialog";
import { FilterChip } from "@/components/FilterChip";
import { ColorLegend } from "@/components/ColorLegend";
import { EventLimitBanner } from "@/components/calendar/EventLimitBanner";
import { AdministrativeEvent, TemporarySchemaPeriod, ClosurePeriod, CalendarEvent, EventCategory, EventType } from "@/types/administration";
import { getCategoryColor, getCategoryBgClass } from "@/lib/calendarUtils";
import { cn } from "@/lib/utils";
import { useDepartmentFilter } from "@/contexts/DepartmentFilterContext";
import { filterByDepartmentsAndGroups } from "@/lib/groupFilterUtils";
import { mockEvents } from "@/data/calendar/mockEvents";

// Simulera produktions-API:ets gräns på 50 events per månadsanrop
const EVENT_LIMIT = 50;

// Generate recurring event instances

// Generate recurring event instances
const generateRecurringInstances = (events: CalendarEvent[]): CalendarEvent[] => {
  const instances: CalendarEvent[] = [];
  
  events.forEach(event => {
    if (event.isRecurring && event.recurrenceRule) {
      const { frequency, interval, endDate, seriesId, excludedDates } = event.recurrenceRule;
      const start = event.originalStartDate || event.date;
      const end = endDate || addMonths(start, 3); // Default 3 months if no end date
      
      let currentDate = new Date(start);
      
      while (isBefore(currentDate, end) || isSameDay(currentDate, end)) {
        // Check if this date should be excluded
        const isExcluded = excludedDates?.some(excludedDate => 
          isSameDay(new Date(excludedDate), currentDate)
        );
        
        if (!isExcluded) {
          instances.push({
            ...event,
            id: `${event.id}-${format(currentDate, "yyyy-MM-dd")}`,
            date: new Date(currentDate),
            instanceDate: new Date(currentDate),
          });
        }
        
        // Increment based on frequency
        if (frequency === "daily") {
          currentDate = addDays(currentDate, interval);
        } else if (frequency === "weekly") {
          currentDate = addDays(currentDate, interval * 7);
        } else if (frequency === "monthly") {
          currentDate = addMonths(currentDate, interval);
        } else if (frequency === "yearly") {
          currentDate = addMonths(currentDate, interval * 12);
        }
      }
    } else {
      instances.push(event);
    }
  });
  
  return instances;
};

const allEvents = generateRecurringInstances(mockEvents);

// Mock administrative data - will be shared with Administration.tsx later
const mockTemporaryPeriods: TemporarySchemaPeriod[] = [
  {
    id: "1",
    title: "Jul & Nyår 25/26",
    createdBy: "Beatrice Olofson",
    startDate: new Date(2025, 11, 22),
    endDate: new Date(2026, 0, 4),
    departments: ["Gräsparven", "laser kittens", "örg"],
    activateDate: new Date(2025, 10, 15),
    deadline: new Date(2025, 11, 1),
    submitted: 0,
    remaining: 29,
    limitedCapacityDays: [
      new Date(2025, 11, 24),
      new Date(2025, 11, 25),
      new Date(2025, 11, 31),
    ],
  },
];

const mockClosurePeriods: ClosurePeriod[] = [
  {
    id: "1",
    title: "Planeringsdag",
    startDate: new Date(2025, 11, 18),
    endDate: new Date(2025, 11, 18),
    departments: ["örg", "Gräsparven", "laser kittens"],
    publishDate: new Date(2025, 10, 4),
    isArchived: false,
  },
];

// Generate administrative events from periods
const generateAdministrativeEvents = (
  temporaryPeriods: TemporarySchemaPeriod[],
  closurePeriods: ClosurePeriod[]
): AdministrativeEvent[] => {
  const events: AdministrativeEvent[] = [];
  
  // Add limited capacity days
  temporaryPeriods.forEach(period => {
    period.limitedCapacityDays.forEach(day => {
      events.push({
        type: 'limited-capacity',
        date: day,
        title: 'Begränsad kapacitet',
        sourceId: period.id,
        color: '#f7d9a8',
        priority: 1,
        activateDate: period.activateDate
      });
    });
  });
  
  // Add closure periods
  closurePeriods.forEach(period => {
    const days = eachDayOfInterval({
      start: period.startDate,
      end: period.endDate
    });
    
    days.forEach(day => {
      events.push({
        type: 'closure',
        date: day,
        title: period.title,
        sourceId: period.id,
        color: '#f7b8b8',
        priority: 2,
        publishDate: period.publishDate
      });
    });
  });
  
  return events;
};

const administrativeEvents = generateAdministrativeEvents(mockTemporaryPeriods, mockClosurePeriods);

// Helper function to get category label in Swedish
const getCategoryLabel = (category: EventCategory): string => {
  const labels = {
    [EventCategory.CLOSURE]: 'Stängning',
    [EventCategory.WARNING]: 'Varning/Viktigt',
    [EventCategory.EXTERNAL]: 'Extern aktivitet',
    [EventCategory.INTERNAL]: 'Intern aktivitet',
  };
  return labels[category];
};

// Helper function to check if administrative event is published
const isPublished = (adminEvent: AdministrativeEvent): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (adminEvent.type === 'limited-capacity' && adminEvent.activateDate) {
    return !isBefore(today, adminEvent.activateDate);
  }
  
  if (adminEvent.type === 'closure' && adminEvent.publishDate) {
    return !isBefore(today, adminEvent.publishDate);
  }
  
  return true; // Default till publicerad om datum saknas
};

export default function Calendar() {
  const { selectedDepartments, selectedGroups } = useDepartmentFilter();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 30)); // April 2026 — matchar designprototyp
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("month");
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);
  const [isRecurringActionOpen, setIsRecurringActionOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [recurringActionType, setRecurringActionType] = useState<"delete" | "edit">("edit");
  const [editEventData, setEditEventData] = useState<CalendarEvent | null>(null);
  const [editScope, setEditScope] = useState<"single" | "future" | "all">("single");
  
  // Filter state
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  
  // Administrative periods state
  const [temporaryPeriods] = useState<TemporarySchemaPeriod[]>(mockTemporaryPeriods);
  const [closurePeriods] = useState<ClosurePeriod[]>(mockClosurePeriods);
  const [isTemporaryPeriodDialogOpen, setIsTemporaryPeriodDialogOpen] = useState(false);
  const [isClosurePeriodDialogOpen, setIsClosurePeriodDialogOpen] = useState(false);
  const [selectedTemporaryPeriod, setSelectedTemporaryPeriod] = useState<TemporarySchemaPeriod | null>(null);
  const [selectedClosurePeriod, setSelectedClosurePeriod] = useState<ClosurePeriod | null>(null);

  // === DEMO: Simulera produktions-API:ets gräns på 50 events per månad ===
  const [simulateApiLimit, setSimulateApiLimit] = useState(false);
  const [loadedBatches, setLoadedBatches] = useState(1);

  // Återställ batch-räknaren när användaren byter månad (simulerar nytt API-anrop)
  useEffect(() => {
    setLoadedBatches(1);
  }, [currentDate.getFullYear(), currentDate.getMonth()]);

  // Helper function to filter by department and groups
  const filterByDepartmentAndGroups = (departments?: string[], groups?: string[]) => {
    if (selectedDepartments.length === 0 && selectedGroups.length === 0) return true;
    if (!departments || departments.length === 0) return true;
    
    // If groups are selected, check if event has any matching group
    if (selectedGroups.length > 0 && groups && groups.length > 0) {
      const hasMatchingGroup = groups.some(group => selectedGroups.includes(group));
      if (hasMatchingGroup) return true;
    }
    
    // If departments are selected (and no matching groups), check departments
    if (selectedDepartments.length > 0) {
      return departments.some(dept => selectedDepartments.includes(dept));
    }
    
    return false;
  };

  // Filter events, temporary periods, and closure periods by department and groups
  const filteredEvents = allEvents.filter(event => 
    filterByDepartmentAndGroups(event.departments, event.groups)
  );
  
  const filteredTemporaryPeriods = temporaryPeriods.filter(period =>
    filterByDepartmentAndGroups(period.departments)
  );
  
  const filteredClosurePeriods = closurePeriods.filter(period =>
    filterByDepartmentAndGroups(period.departments)
  );

  // Generate administrative events from filtered periods
  const filteredAdministrativeEvents = generateAdministrativeEvents(
    filteredTemporaryPeriods,
    filteredClosurePeriods
  );

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // === DEMO: applicera 50-events-gränsen på månadsvyns events ===
  // Hämta alla events som faller inom månadsvyns synliga period (hela veckor),
  // sortera på datum, och returnera bara de första (loadedBatches * 50).
  // Detta simulerar exakt vad backend gör i prod.
  const monthEventsAll = useMemo(() => {
    return filteredEvents
      .filter(event =>
        !isBefore(event.date, calendarStart) && !isAfter(event.date, calendarEnd)
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredEvents, calendarStart, calendarEnd]);

  const monthEventsLimited = useMemo(() => {
    if (!simulateApiLimit) return monthEventsAll;
    return monthEventsAll.slice(0, loadedBatches * EVENT_LIMIT);
  }, [monthEventsAll, simulateApiLimit, loadedBatches]);

  const totalMonthEvents = monthEventsAll.length;
  const displayedMonthEvents = monthEventsLimited.length;
  const limitedEventIds = useMemo(
    () => new Set(monthEventsLimited.map(e => e.id)),
    [monthEventsLimited]
  );

  const weekDays = ["MÅN", "TIS", "ONS", "TORS", "FRE", "LÖR", "SÖN"];

  const goToPrevious = () => {
    if (viewMode === 'day') {
      setCurrentDate(addDays(currentDate, -1));
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const goToNext = () => {
    if (viewMode === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const goToToday = () => setCurrentDate(new Date());

  const toggleFilter = (filter: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(filter)) {
      newFilters.delete(filter);
    } else {
      newFilters.add(filter);
    }
    setActiveFilters(newFilters);
  };

  const filterEvents = (events: CalendarEvent[]): CalendarEvent[] => {
    if (activeFilters.size === 0) return events;
    
    return events.filter(event => {
      // Category filters
      if (activeFilters.has('closure') && event.category === EventCategory.CLOSURE) return true;
      if (activeFilters.has('warning') && event.category === EventCategory.WARNING) return true;
      if (activeFilters.has('external') && event.category === EventCategory.EXTERNAL) return true;
      if (activeFilters.has('internal') && event.category === EventCategory.INTERNAL) return true;
      
      // Metadata filters
      if (activeFilters.has('recurring') && event.isRecurring) return true;
      
      return false;
    });
  };

  const MAX_EVENTS_IN_MONTH_VIEW = 3;

  const getEventsForDay = (day: Date) => {
    const filtered = filterEvents(allEvents);
    let regularEvents = filtered.filter(event => isSameDay(event.date, day));

    // I månadsvyn: applicera API-gränsen så endast events som "kom med"
    // i de laddade batcharna visas. Detta speglar prod-beteendet där
    // events kan saknas på olika dagar när månaden har >50 events totalt.
    if (viewMode === 'month' && simulateApiLimit) {
      regularEvents = regularEvents.filter(e => limitedEventIds.has(e.id));
    }

    const adminEvents = administrativeEvents.filter(event => isSameDay(event.date, day));
    
    // Combine and sort: first by priority (admin events first), then by time
    return [...adminEvents, ...regularEvents].sort((a, b) => {
      // First sort by priority (admin events have higher priority)
      const priorityA = 'priority' in a ? a.priority : 0;
      const priorityB = 'priority' in b ? b.priority : 0;
      
      if (priorityA !== priorityB) {
        return priorityB - priorityA; // Higher priority first
      }
      
      // Then sort by time
      const getEventTime = (event: CalendarEvent | AdministrativeEvent) => {
        if ('startTime' in event && event.startTime) {
          const [hours, minutes] = event.startTime.split(':').map(Number);
          return hours * 60 + minutes; // Convert to minutes for comparison
        }
        if ('allDay' in event && event.allDay) {
          return -1; // All-day events first
        }
        return 0; // No time specified
      };
      
      return getEventTime(a) - getEventTime(b);
    });
  };

  const getVisibleAndHiddenEvents = (events: (CalendarEvent | AdministrativeEvent)[]) => {
    if (viewMode !== 'month') {
      return { visible: events, hidden: [] };
    }
    
    return {
      visible: events.slice(0, MAX_EVENTS_IN_MONTH_VIEW),
      hidden: events.slice(MAX_EVENTS_IN_MONTH_VIEW)
    };
  };

  const getDisplayDate = () => {
    if (viewMode === 'day') {
      return format(currentDate, 'd MMMM yyyy', { locale: sv });
    } else if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(weekStart, 'd MMM', { locale: sv })} - ${format(weekEnd, 'd MMM yyyy', { locale: sv })}`;
    } else {
      return format(currentDate, 'MMMM yyyy', { locale: sv });
    }
  };

  const handleEventClick = (event: CalendarEvent | AdministrativeEvent) => {
    if ('type' in event && 'sourceId' in event) {
      // It's an administrative event
      const adminEvent = event as AdministrativeEvent;
      if (adminEvent.type === 'limited-capacity') {
        const period = temporaryPeriods.find(p => p.id === adminEvent.sourceId);
        if (period) {
          setSelectedTemporaryPeriod(period);
          setIsTemporaryPeriodDialogOpen(true);
        }
      } else if (adminEvent.type === 'closure') {
        const period = closurePeriods.find(p => p.id === adminEvent.sourceId);
        if (period) {
          setSelectedClosurePeriod(period);
          setIsClosurePeriodDialogOpen(true);
        }
      }
    } else {
      // Regular event — öppna direkt i edit-dialogen (matchar prototyp).
      const calEvent = event as CalendarEvent;
      setSelectedEvent(calEvent);
      if (calEvent.isRecurring) {
        // Återkommande: fråga via RecurringActionDialog innan edit
        setRecurringActionType("edit");
        setIsRecurringActionOpen(true);
      } else {
        setEditEventData(calEvent);
        setIsAddEventOpen(true);
      }
    }
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    
    if (selectedEvent.isRecurring) {
      setIsViewEventOpen(false);
      setRecurringActionType("delete");
      setIsRecurringActionOpen(true);
    } else {
      // Delete single event
      console.log("Deleting single event:", selectedEvent.id);
      setIsViewEventOpen(false);
    }
  };

  const handleEditEvent = () => {
    if (!selectedEvent) return;
    
    if (selectedEvent.isRecurring) {
      setIsViewEventOpen(false);
      setRecurringActionType("edit");
      setIsRecurringActionOpen(true);
    } else {
      // Edit single event
      setEditEventData(selectedEvent);
      setIsViewEventOpen(false);
      setIsAddEventOpen(true);
    }
  };

  const handleRecurringActionConfirm = (scope: "single" | "future" | "all") => {
    if (!selectedEvent) return;
    
    setEditScope(scope);
    
    if (recurringActionType === "delete") {
      console.log("Deleting recurring event with scope:", scope);
      // Delete logic here
    } else if (recurringActionType === "edit") {
      // Prepare event data based on scope
      const eventToEdit = { ...selectedEvent };
      
      if (scope === "single") {
        // Edit only this instance - use clicked date
        eventToEdit.date = selectedEvent.instanceDate || selectedEvent.date;
        eventToEdit.isRecurring = false;
        delete eventToEdit.recurrenceRule;
      } else if (scope === "future") {
        // Edit this and future - start from clicked date
        eventToEdit.date = selectedEvent.instanceDate || selectedEvent.date;
        eventToEdit.originalStartDate = selectedEvent.instanceDate || selectedEvent.date;
      } else if (scope === "all") {
        // Edit all - use original start date
        eventToEdit.date = selectedEvent.originalStartDate || selectedEvent.date;
      }
      
      setEditEventData(eventToEdit);
      setIsAddEventOpen(true);
    }
  };

  const renderMonthView = () => {
    // Bygg veckorader (en rad = 7 dagar) så vi kan visa veckonummer i en vänsterkolumn.
    const weeks: Date[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }

    return (
      <div className="bg-white border border-gray-200 overflow-hidden">
        {/* Veckodagar header — vänsterkolumn lämnas tom för veckonummer */}
        <div className="grid grid-cols-[40px_repeat(7,1fr)] border-b border-gray-200">
          <div className="border-r border-gray-200" />
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-[11px] font-medium tracking-wider text-gray-500 border-r border-gray-200 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Rader */}
        {weeks.map((week, weekIdx) => (
          <div
            key={weekIdx}
            className="grid grid-cols-[40px_repeat(7,1fr)] border-b border-gray-200 last:border-b-0"
          >
            {/* Veckonummer */}
            <div className="flex items-start justify-center pt-2 text-[11px] font-medium text-gray-400 border-r border-gray-200 bg-white">
              {getISOWeek(week[0])}
            </div>

            {week.map((day, idx) => {
              const events = getEventsForDay(day);
              const { visible, hidden } = getVisibleAndHiddenEvents(events);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isTodayDate = isToday(day);

              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-[120px] p-1.5 border-r border-gray-200 last:border-r-0",
                    !isCurrentMonth ? "bg-gray-50" : "bg-white"
                  )}
                >
                  {/* Dagnummer — vänsterställt */}
                  <div className="mb-1 px-1">
                    {isTodayDate ? (
                      <div className="inline-flex w-7 h-7 rounded-full bg-[#2a9d8f] text-white items-center justify-center text-sm font-medium">
                        {format(day, "d")}
                      </div>
                    ) : (
                      <span
                        className={cn(
                          "text-sm",
                          !isCurrentMonth ? "text-gray-400" : "text-gray-600"
                        )}
                      >
                        {format(day, "d")}
                      </span>
                    )}
                  </div>

                  {/* Event-chips */}
                  <div className="space-y-0.5">
                    {visible.map((event) => {
                      const isAdmin = 'type' in event && 'sourceId' in event;
                      const calEvent = !isAdmin ? event as CalendarEvent : null;
                      const adminEvent = isAdmin ? event as AdministrativeEvent : null;
                      const published = adminEvent ? isPublished(adminEvent) : true;

                      // Pink-stil: closure & limited-capacity för "calendar events" eller admin-events
                      const isPinkChip =
                        isAdmin ||
                        calEvent!.category === EventCategory.CLOSURE ||
                        calEvent!.category === EventCategory.WARNING;

                      const showXIcon =
                        (adminEvent && adminEvent.type === 'closure') ||
                        (calEvent && calEvent.category === EventCategory.CLOSURE) ||
                        (calEvent && calEvent.category === EventCategory.WARNING);

                      return (
                        <Tooltip key={isAdmin ? `${adminEvent!.sourceId}-${format(day, 'yyyy-MM-dd')}` : calEvent!.id}>
                          <TooltipTrigger asChild>
                            <div
                              onClick={() => handleEventClick(event)}
                              className={cn(
                                "text-[11px] px-1.5 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1 overflow-hidden",
                                isPinkChip
                                  ? "bg-[#fadcdc] text-gray-800 hover:bg-[#f5cccc]"
                                  : "bg-[#287E95] text-white hover:bg-[#236b80]",
                                !published && "opacity-60"
                              )}
                            >
                              {showXIcon && (
                                <XCircle className="w-3 h-3 flex-shrink-0" strokeWidth={2} />
                              )}
                              <span className="truncate">{event.title}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <div className="space-y-1">
                              <p className="font-semibold">{event.title}</p>
                              {isAdmin ? (
                                <p className="text-xs text-muted-foreground">
                                  {adminEvent!.type === 'closure' ? 'Stängningsperiod' : 'Begränsad kapacitet'}
                                </p>
                              ) : (
                                <>
                                  {calEvent!.description && (
                                    <p className="text-xs">{calEvent!.description}</p>
                                  )}
                                  {calEvent!.startTime && (
                                    <p className="text-xs text-muted-foreground">
                                      {calEvent!.startTime} - {calEvent!.endTime}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}

                    {hidden.length > 0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-[11px] px-1.5 py-0.5 cursor-pointer text-gray-500 hover:text-gray-700">
                            +{hidden.length} mer
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <div className="space-y-1.5">
                            <p className="font-semibold text-sm mb-2">
                              {hidden.length} dolda händelser:
                            </p>
                            {hidden.map((event, idx) => {
                              const time = 'startTime' in event && event.startTime ? event.startTime : 'Heldag';
                              return (
                                <div key={idx} className="flex items-start gap-2 text-xs">
                                  <span className="text-muted-foreground">{time}</span>
                                  <span className="flex-1">{event.title}</span>
                                </div>
                              );
                            })}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 15 }, (_, i) => i + 6); // 6:00 to 20:00
    const dayEvents = getEventsForDay(currentDate);
    
    return (
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="border-b p-4 bg-gray-50">
          <h3 className="font-semibold text-lg">
            {format(currentDate, 'EEEE d MMMM yyyy', { locale: sv })}
          </h3>
        </div>
        
        <div className="relative">
          {/* Time slots */}
          {hours.map((hour) => (
            <div key={hour} className="flex border-b" style={{ height: '60px' }}>
              <div className="w-20 p-2 text-sm text-gray-600 border-r flex-shrink-0">
                {hour.toString().padStart(2, '0')}:00
              </div>
              <div className="flex-1 relative"></div>
            </div>
          ))}
          
          {/* Overlay events */}
          <div className="absolute inset-0 left-20 pointer-events-none">
            {dayEvents.map((event, eventIdx) => {
              const isAdmin = 'type' in event && 'sourceId' in event;
              const calEvent = !isAdmin ? event as CalendarEvent : null;
              
              if (!calEvent || !calEvent.startTime || !calEvent.endTime) return null;
              
              const [startHour, startMin] = calEvent.startTime.split(':').map(Number);
              const [endHour, endMin] = calEvent.endTime.split(':').map(Number);
              
              const startMinutes = (startHour - 6) * 60 + startMin;
              const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
              
              const top = startMinutes;
              const height = Math.max(duration, 30);
              
              return (
                <div
                  key={eventIdx}
                  className={cn(
                    "absolute left-1 right-1 rounded p-2 cursor-pointer pointer-events-auto shadow-sm",
                    getCategoryBgClass(calEvent.category)
                  )}
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                  }}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="text-xs font-semibold">{calEvent.title}</div>
                  <div className="text-xs opacity-90">
                    {calEvent.startTime} - {calEvent.endTime}
                  </div>
                  {calEvent.description && height > 50 && (
                    <div className="text-[10px] opacity-75 mt-1 line-clamp-2">{calEvent.description}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDaysArray = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 15 }, (_, i) => i + 6);
    
    return (
      <div className="bg-white rounded-lg border overflow-hidden">
        {/* Header with dates */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b bg-gray-50">
          <div className="p-2"></div>
          {weekDaysArray.map((day, idx) => (
            <div key={idx} className="p-2 text-center border-l">
              <div className="text-xs text-gray-600">{weekDays[idx]}</div>
              <div className={cn(
                "text-sm font-medium",
                isToday(day) && "text-[#2a9d8f] font-bold"
              )}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
        
        {/* Time grid */}
        <div className="relative overflow-auto" style={{ maxHeight: '600px' }}>
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-[80px_repeat(7,1fr)] border-b" style={{ height: '60px' }}>
              <div className="p-2 text-sm text-gray-600 border-r">
                {hour.toString().padStart(2, '0')}:00
              </div>
              {weekDaysArray.map((day, idx) => (
                <div key={idx} className="border-l relative"></div>
              ))}
            </div>
          ))}
          
          {/* Overlay events for each day */}
          {weekDaysArray.map((day, dayIdx) => {
            const dayEvents = getEventsForDay(day);
            
            return (
              <div
                key={dayIdx}
                className="absolute top-0 pointer-events-none"
                style={{
                  left: `calc(80px + ${dayIdx * (100 / 7)}%)`,
                  width: `calc(${100 / 7}%)`,
                  height: '100%'
                }}
              >
                {dayEvents.map((event, eventIdx) => {
                  const isAdmin = 'type' in event && 'sourceId' in event;
                  const calEvent = !isAdmin ? event as CalendarEvent : null;
                  
                  if (!calEvent || !calEvent.startTime || !calEvent.endTime) return null;
                  
                  const [startHour, startMin] = calEvent.startTime.split(':').map(Number);
                  const [endHour, endMin] = calEvent.endTime.split(':').map(Number);
                  
                  const startMinutes = (startHour - 6) * 60 + startMin;
                  const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
                  
                  return (
                    <div
                      key={eventIdx}
                      className={cn(
                        "absolute left-1 right-1 rounded p-1 cursor-pointer pointer-events-auto shadow-sm",
                        getCategoryBgClass(calEvent.category)
                      )}
                      style={{
                        top: `${startMinutes}px`,
                        height: `${Math.max(duration, 25)}px`,
                      }}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="text-xs font-semibold truncate">{calEvent.title}</div>
                      <div className="text-[10px] opacity-90">
                        {calEvent.startTime}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Calendar Grid */}
        <div className="px-6 py-4 relative min-h-[calc(100vh-2rem)]">
          {/* Liten månadsnav-strip ovanför griden — matchar prototyp */}
          <div className="flex items-center gap-2 mb-3">
            <Button variant="ghost" size="icon" onClick={goToPrevious} className="h-8 w-8 text-[#2a9d8f]">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={goToNext} className="h-8 w-8 text-[#2a9d8f]">
              <ChevronRight className="h-5 w-5" />
            </Button>
            <span className="ml-2 text-sm text-gray-700 lowercase">
              {format(currentDate, 'MMM yyyy', { locale: sv })}
            </span>
          </div>

          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}

          {/* Add Event Button — bottom-right, matchar prototyp */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => setIsAddEventOpen(true)}
              className="bg-[#2a9d8f] hover:bg-[#238276] text-white uppercase tracking-wide font-medium"
            >
              LÄGG TILL HÄNDELSE
            </Button>
          </div>
        </div>

      {/* Add/Edit Event Dialog */}
      <AddEventDialog 
        open={isAddEventOpen} 
        onOpenChange={setIsAddEventOpen}
        mode={editEventData ? "edit" : "add"}
        eventData={editEventData || undefined}
        editScope={editScope}
        closurePeriods={mockClosurePeriods}
        temporaryPeriods={mockTemporaryPeriods}
      />

      {/* View Event Dialog */}
      <ViewEventDialog
        open={isViewEventOpen}
        onOpenChange={setIsViewEventOpen}
        event={selectedEvent}
        onDelete={handleDeleteEvent}
        onEdit={handleEditEvent}
      />

      {/* Recurring Action Dialog */}
      <RecurringActionDialog
        open={isRecurringActionOpen}
        onOpenChange={setIsRecurringActionOpen}
        actionType={recurringActionType}
        onConfirm={handleRecurringActionConfirm}
      />

      {/* Temporary Schema Period Dialog */}
      <TemporarySchemaPeriodDialog
        open={isTemporaryPeriodDialogOpen}
        onOpenChange={setIsTemporaryPeriodDialogOpen}
        period={selectedTemporaryPeriod}
        onSave={() => setIsTemporaryPeriodDialogOpen(false)}
      />

      {/* Closure Period Dialog */}
      <ClosurePeriodDialog
        open={isClosurePeriodDialogOpen}
        onOpenChange={setIsClosurePeriodDialogOpen}
        period={selectedClosurePeriod}
        onSave={() => setIsClosurePeriodDialogOpen(false)}
      />
      </div>
    </TooltipProvider>
  );
}
