import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday, addDays, isBefore, isAfter } from "date-fns";
import { sv } from "date-fns/locale";
import { AddEventDialog } from "@/components/AddEventDialog";
import { ViewEventDialog } from "@/components/ViewEventDialog";
import { RecurringActionDialog } from "@/components/RecurringActionDialog";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  color: string;
  description?: string;
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
    seriesId: string;
    selectedDays?: string[];
  };
  instanceDate?: Date;
  originalStartDate?: Date;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

const mockEvents: CalendarEvent[] = [
  { 
    id: "1", 
    title: "Gemtämande (ved ending må vara e...)", 
    date: new Date(2025, 10, 4), 
    color: "#2a9d8f",
    description: "Gemensam träff för alla avdelningar",
    startTime: "09:00",
    endTime: "11:00",
    shareWithGuardians: true,
    departments: ["Blåbär", "Lingon", "Odon"],
    participants: "45",
    createdBy: "Anna Andersson",
    createdAt: new Date(2025, 9, 15, 10, 30),
    updatedBy: "Anna Andersson",
    updatedAt: new Date(2025, 9, 20, 14, 15),
  },
  { 
    id: "2", 
    title: "Biblioteksbesök", 
    date: new Date(2025, 10, 6), 
    color: "#2a9d8f",
    description: "Besök på stadsbiblioteket",
    startTime: "10:00",
    endTime: "11:30",
    departments: ["Blåbär"],
    participants: "15",
    createdBy: "Erik Eriksson",
    createdAt: new Date(2025, 9, 10, 9, 0),
  },
  {
    id: "recurring-1",
    title: "Morgonsamling",
    date: new Date(2025, 10, 4),
    color: "#e76f51",
    description: "Daglig morgonsamling med alla barn",
    startTime: "08:30",
    endTime: "09:00",
    isAllDay: false,
    shareWithGuardians: false,
    departments: ["Blåbär", "Lingon", "Odon", "Vill"],
    participants: "60",
    isRecurring: true,
    recurrenceRule: {
      frequency: "daily",
      interval: 1,
      endDate: new Date(2025, 10, 30),
      seriesId: "recurring-series-1",
    },
    originalStartDate: new Date(2025, 10, 4),
    createdBy: "Maria Larsson",
    createdAt: new Date(2025, 9, 1, 8, 0),
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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ["MÅN", "TIS", "ONS", "TORS", "FRE", "LÖR", "SÖN"];

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getEventsForDay = (day: Date) => {
    return allEvents.filter(event => isSameDay(event.date, day));
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsViewEventOpen(true);
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
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: event.color }}
                        onClick={() => handleEventClick(event)}
                      >
                        {event.title}
                      </div>
                    ))}
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
    </div>
  );
}
