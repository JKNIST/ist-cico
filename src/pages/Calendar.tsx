import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday } from "date-fns";
import { sv } from "date-fns/locale";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  color: string;
}

const mockEvents: CalendarEvent[] = [
  { id: "1", title: "Gemtämande (ved ending må vara e...", date: new Date(2025, 10, 4), color: "#2a9d8f" },
  { id: "2", title: "Biblioteksbesök", date: new Date(2025, 10, 6), color: "#2a9d8f" },
  { id: "3", title: "Studedag", date: new Date(2025, 10, 10), color: "#2a9d8f" },
  { id: "4", title: "Biblioteksbesök", date: new Date(2025, 10, 13), color: "#2a9d8f" },
  { id: "5", title: "Biblioteksbesök", date: new Date(2025, 10, 20), color: "#2a9d8f" },
  { id: "6", title: "Biblioteksbesök", date: new Date(2025, 10, 27), color: "#2a9d8f" },
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 3)); // November 2025
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("month");

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
    return mockEvents.filter(event => isSameDay(event.date, day));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">Kalender</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-600 hover:text-gray-900">
              Select Language
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900">
              Blåbär, Lingon, Odon, Vill
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#2a9d8f] text-white flex items-center justify-center text-sm font-medium">
                BO
              </div>
              <button className="w-8 h-8 rounded-full bg-[#2a9d8f] text-white flex items-center justify-center">
                ?
              </button>
            </div>
          </div>
        </div>
      </div>

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
                        className="text-xs p-1 rounded text-white truncate"
                        style={{ backgroundColor: event.color }}
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
          <Button className="bg-[#2a9d8f] hover:bg-[#238276] text-white">
            LÄGG TILL HÄNDELSE
          </Button>
        </div>
      </div>
    </div>
  );
}
