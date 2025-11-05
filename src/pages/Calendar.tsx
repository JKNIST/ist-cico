import { useState } from "react";
import { ChevronLeft, ChevronRight, AlertTriangle, XCircle, Share2, Lock, Repeat, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday, addDays, isBefore, isAfter } from "date-fns";
import { sv } from "date-fns/locale";
import { AddEventDialog } from "@/components/AddEventDialog";
import { ViewEventDialog } from "@/components/ViewEventDialog";
import { RecurringActionDialog } from "@/components/RecurringActionDialog";
import { TemporarySchemaPeriodDialog } from "@/components/TemporarySchemaPeriodDialog";
import { ClosurePeriodDialog } from "@/components/ClosurePeriodDialog";
import { FilterChip } from "@/components/FilterChip";
import { ColorLegend } from "@/components/ColorLegend";
import { AdministrativeEvent, TemporarySchemaPeriod, ClosurePeriod, CalendarEvent, EventCategory, EventType } from "@/types/administration";
import { getCategoryColor, getCategoryBgClass } from "@/lib/calendarUtils";
import { cn } from "@/lib/utils";

const mockEvents: CalendarEvent[] = [
  { 
    id: "1", 
    title: "Utflykt till museet", 
    date: new Date(2025, 10, 4),
    category: EventCategory.EXTERNAL,
    type: EventType.EXCURSION,
    description: "Gemensam träff för alla avdelningar",
    startTime: "09:00",
    endTime: "11:00",
    allDay: false,
    isSharedWithGuardians: true,
    isRecurring: false,
    departments: ["Blåbär", "Lingon", "Odon"],
    participants: "45",
    source: 'manual',
    createdBy: "Anna Andersson",
    createdAt: new Date(2025, 9, 15, 10, 30),
    updatedAt: new Date(2025, 9, 20, 14, 15),
  },
  { 
    id: "2", 
    title: "Biblioteksbesök", 
    date: new Date(2025, 10, 6),
    category: EventCategory.EXTERNAL,
    type: EventType.EXCURSION,
    description: "Besök på stadsbiblioteket",
    startTime: "10:00",
    endTime: "11:30",
    allDay: false,
    isSharedWithGuardians: true,
    isRecurring: false,
    departments: ["Blåbär"],
    participants: "15",
    source: 'manual',
    createdBy: "Erik Eriksson",
    createdAt: new Date(2025, 9, 10, 9, 0),
  },
  {
    id: "recurring-1",
    title: "Personalmöte",
    date: new Date(2025, 10, 4),
    category: EventCategory.INTERNAL,
    type: EventType.STAFF_MEETING,
    description: "Veckomöte för all personal",
    startTime: "08:30",
    endTime: "09:00",
    allDay: false,
    isSharedWithGuardians: false,
    isRecurring: true,
    recurrenceRule: {
      frequency: "weekly",
      interval: 1,
      endDate: new Date(2025, 10, 30),
      seriesId: "recurring-series-1",
      selectedDays: ["mon"],
    },
    departments: ["Blåbär", "Lingon", "Odon", "Vildhallon"],
    participants: "60",
    originalStartDate: new Date(2025, 10, 4),
    source: 'manual',
    createdBy: "Maria Larsson",
    createdAt: new Date(2025, 9, 1, 8, 0),
  },
  {
    id: "3",
    title: "Luciafirande",
    date: new Date(2025, 11, 13),
    category: EventCategory.EXTERNAL,
    type: EventType.CELEBRATION,
    description: "Luciafirande med föräldrar",
    startTime: "14:00",
    endTime: "16:00",
    allDay: false,
    isSharedWithGuardians: true,
    isRecurring: false,
    departments: ["Blåbär", "Lingon", "Odon", "Vildhallon"],
    participants: "80",
    source: 'manual',
    createdBy: "Anna Andersson",
    createdAt: new Date(2025, 10, 1, 10, 0),
  },
];

// Generate recurring event instances
const generateRecurringInstances = (events: CalendarEvent[]): CalendarEvent[] => {
  const instances: CalendarEvent[] = [];
  
  events.forEach(event => {
    if (event.isRecurring && event.recurrenceRule) {
      const { frequency, interval, endDate, seriesId } = event.recurrenceRule;
      const start = event.originalStartDate || event.date;
      const end = endDate || addMonths(start, 3); // Default 3 months if no end date
      
      let currentDate = new Date(start);
      
      while (isBefore(currentDate, end) || isSameDay(currentDate, end)) {
        instances.push({
          ...event,
          id: `${event.id}-${format(currentDate, "yyyy-MM-dd")}`,
          date: new Date(currentDate),
          instanceDate: new Date(currentDate),
        });
        
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
        color: '#f59e0b',
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
        color: '#ef4444',
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
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 3)); // November 2025
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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ["MÅN", "TIS", "ONS", "TORS", "FRE", "LÖR", "SÖN"];

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
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

  const getEventsForDay = (day: Date) => {
    const filteredEvents = filterEvents(allEvents);
    const regularEvents = filteredEvents.filter(event => isSameDay(event.date, day));
    const adminEvents = administrativeEvents.filter(event => isSameDay(event.date, day));
    
    // Combine and sort - administrative events first
    return [...adminEvents, ...regularEvents].sort((a, b) => 
      ('priority' in b ? b.priority : 0) - ('priority' in a ? a.priority : 0)
    );
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
      // Regular event
      setSelectedEvent(event as CalendarEvent);
      setIsViewEventOpen(true);
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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Calendar Controls */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="bg-[#2a9d8f] text-white hover:bg-[#238276] border-0"
            >
              IDAG
            </Button>
            <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900 ml-2">
              {format(currentDate, "MMMM yyyy", { locale: sv })}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("day")}
              className={viewMode === "day" ? "bg-gray-200" : ""}
            >
              DAG ☰
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("week")}
              className={viewMode === "week" ? "bg-gray-200" : ""}
            >
              VECKA ⚏
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("month")}
              className={viewMode === "month" ? "bg-[#2a9d8f] text-white border-0" : ""}
            >
              MÅNAD ⚏
            </Button>
          </div>
        </div>
      </div>


      {/* Calendar Grid */}
      <div className="px-6 py-4">
        <div className="flex justify-end mb-4">
          <ColorLegend />
        </div>
        
        <div className="bg-white rounded-lg border overflow-hidden">
          {/* Week days header */}
          <div className="grid grid-cols-7 border-b bg-gray-50">
            {weekDays.map((day) => (
              <div key={day} className="p-2 text-center text-xs font-semibold text-gray-700 border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const events = getEventsForDay(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isTodayDate = isToday(day);

              return (
                <div
                  key={idx}
                  className={`min-h-[120px] p-2 border-r border-b last:border-r-0 ${
                    !isCurrentMonth ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    {isTodayDate ? (
                      <div className="w-8 h-8 rounded-full bg-[#2a9d8f] text-white flex items-center justify-center text-sm font-medium">
                        {format(day, "d")}
                      </div>
                    ) : (
                      <div className={`text-sm ${!isCurrentMonth ? "text-gray-400" : "text-gray-700"}`}>
                        {format(day, "d")}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    {events.map((event) => {
                      const isAdminEvent = 'type' in event && 'sourceId' in event;
                      const adminEvent = isAdminEvent ? event as AdministrativeEvent : null;
                      const calEvent = !isAdminEvent ? event as CalendarEvent : null;
                      
                      return (
                        <Tooltip key={calEvent ? calEvent.id : `${adminEvent?.type}-${adminEvent?.sourceId}-${format(event.date, 'yyyy-MM-dd')}`}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "text-xs p-1.5 rounded cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-1.5",
                                calEvent && getCategoryBgClass(calEvent.category),
                                adminEvent?.type === 'limited-capacity' && "bg-calendar-warning text-calendar-warning-foreground border-l-4 border-l-amber-600",
                                adminEvent?.type === 'closure' && "bg-calendar-closure text-calendar-closure-foreground font-semibold border-l-4 border-l-red-700"
                              )}
                              onClick={() => handleEventClick(event)}
                            >
                              {adminEvent?.type === 'limited-capacity' && (
                                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                              )}
                              {adminEvent?.type === 'closure' && (
                                <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
                              )}
                              <span className="truncate flex-1">{event.title}</span>
                              
                              {/* Metadata badges for regular events */}
                              {calEvent && (
                                <div className="flex gap-0.5 flex-shrink-0">
                                  {calEvent.isRecurring && (
                                    <Repeat className="h-3 w-3 opacity-80" />
                                  )}
                                  {calEvent.isSharedWithGuardians ? (
                                    <Share2 className="h-3 w-3 opacity-80" />
                                  ) : (
                                    <Lock className="h-3 w-3 opacity-80" />
                                  )}
                                </div>
                              )}
                              
                              {/* Share2 badge for admin events (only if published) */}
                              {adminEvent && isPublished(adminEvent) && (
                                <Share2 className="h-3 w-3 opacity-80 flex-shrink-0" />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="space-y-1.5">
                              <div className="font-semibold">{event.title}</div>
                              
                              {calEvent && (
                                <>
                                  {calEvent.description && (
                                    <div className="text-sm">{calEvent.description}</div>
                                  )}
                                  
                                  {(calEvent.startTime || calEvent.endTime) && (
                                    <div className="text-sm">
                                      {calEvent.startTime && calEvent.endTime 
                                        ? `${calEvent.startTime} - ${calEvent.endTime}`
                                        : calEvent.startTime || calEvent.endTime}
                                    </div>
                                  )}
                                  
                                  <div className="text-sm pt-1 border-t space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                      {calEvent.isSharedWithGuardians ? (
                                        <>
                                          <Share2 className="h-3 w-3" />
                                          <span>Delat med vårdnadshavare</span>
                                        </>
                                      ) : (
                                        <>
                                          <Lock className="h-3 w-3" />
                                          <span>Intern (ej delad)</span>
                                        </>
                                      )}
                                    </div>
                                    
                                    {calEvent.isRecurring && (
                                      <div className="flex items-center gap-1.5">
                                        <Repeat className="h-3 w-3" />
                                        <span>Återkommande händelse</span>
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center gap-1.5">
                                      <div 
                                        className="h-3 w-3 rounded" 
                                        style={{ backgroundColor: getCategoryColor(calEvent.category) }}
                                      />
                                      <span>{getCategoryLabel(calEvent.category)}</span>
                                    </div>
                                  </div>
                                </>
                              )}
                              
                              {adminEvent && (
                                <>
                                  <div className="text-sm pt-1 border-t space-y-0.5">
                                    {adminEvent.type === 'limited-capacity' && (
                                      <>
                                        <div className="flex items-center gap-1.5">
                                          <AlertTriangle className="h-3 w-3" />
                                          <span>Begränsad kapacitet</span>
                                        </div>
                                        
                                        {isPublished(adminEvent) ? (
                                          <div className="flex items-center gap-1.5">
                                            <Share2 className="h-3 w-3" />
                                            <span>Delat med vårdnadshavare</span>
                                          </div>
                                        ) : adminEvent.activateDate && (
                                          <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <CalendarIcon className="h-3 w-3" />
                                            <span>Kommer att aktiveras {format(adminEvent.activateDate, 'PPP', { locale: sv })}</span>
                                          </div>
                                        )}
                                      </>
                                    )}
                                    
                                    {adminEvent.type === 'closure' && (
                                      <>
                                        <div className="flex items-center gap-1.5">
                                          <XCircle className="h-3 w-3" />
                                          <span>Stängningsperiod</span>
                                        </div>
                                        
                                        {isPublished(adminEvent) ? (
                                          <div className="flex items-center gap-1.5">
                                            <Share2 className="h-3 w-3" />
                                            <span>Delat med vårdnadshavare</span>
                                          </div>
                                        ) : adminEvent.publishDate && (
                                          <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <CalendarIcon className="h-3 w-3" />
                                            <span>Publiceras {format(adminEvent.publishDate, 'PPP', { locale: sv })}</span>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Event Button */}
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={() => setIsAddEventOpen(true)}
            className="bg-[#2a9d8f] hover:bg-[#238276] text-white"
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
