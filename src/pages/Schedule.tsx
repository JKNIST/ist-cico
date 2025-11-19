import { useState } from "react";
import { ChevronLeft, ChevronRight, Printer, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addDays, startOfWeek, getWeek } from "date-fns";
import { sv, enUS, nb } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useDepartmentFilter } from "@/contexts/DepartmentFilterContext";

interface ChildSchedule {
  id: string;
  name: string;
  department: string;
  schedules: {
    [key: string]: { start: string; end: string; isTemporary?: boolean } | null;
  };
  alertCount?: number;
}

const mockChildrenSchedules: ChildSchedule[] = [
  {
    id: "1",
    name: "Anette ATeamHomess",
    department: "Blåbär",
    schedules: {
      "0": { start: "08:00", end: "16:00" },
      "1": { start: "08:00", end: "16:00" },
      "2": { start: "08:00", end: "16:00" },
      "3": { start: "08:00", end: "16:00" },
      "4": { start: "08:00", end: "16:00" },
      "5": { start: "08:00", end: "16:00" },
      "6": { start: "08:00", end: "16:00" },
    },
  },
  {
    id: "2",
    name: "Björn Ali",
    department: "Lingon",
    schedules: {
      "0": { start: "08:00", end: "16:00" },
    },
  },
  {
    id: "3",
    name: "Ellinor Wikström",
    department: "Vildhallon",
    schedules: {},
    alertCount: 1,
  },
  {
    id: "4",
    name: "Erica af Forsell",
    department: "Vildhallon",
    schedules: {
      "1": { start: "08:00", end: "16:00" },
      "2": { start: "08:00", end: "16:00" },
      "3": { start: "08:00", end: "16:00" },
      "4": { start: "08:00", end: "16:00" },
    },
  },
  {
    id: "5",
    name: "Jimmie Engstedt",
    department: "Blåbär",
    schedules: {
      "0": { start: "08:00", end: "16:00" },
    },
  },
  {
    id: "6",
    name: "Lizette Ahlberg",
    department: "Odon",
    schedules: {},
    alertCount: 1,
  },
  {
    id: "7",
    name: "Vida Bache",
    department: "Blåbär",
    schedules: {},
    alertCount: 1,
  },
];

export default function Schedule() {
  const { i18n } = useTranslation();
  const { selectedDepartments } = useDepartmentFilter();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 17)); // Nov 17, 2025

  const filteredChildren = mockChildrenSchedules.filter((child) => {
    return selectedDepartments.length === 0 || selectedDepartments.includes(child.department);
  });

  const getDateLocale = () => {
    switch (i18n.language) {
      case "sv":
        return sv;
      case "no":
        return nb;
      default:
        return enUS;
    }
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekNumber = getWeek(currentDate, { weekStartsOn: 1, locale: getDateLocale() });

  const goToPreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const getChildrenPresentCount = (dayIndex: number) => {
    return filteredChildren.filter(
      (child) => child.schedules[dayIndex.toString()]
    ).length;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Schedule</h1>
            <div className="flex items-center gap-2 border rounded-lg p-2 bg-card">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousWeek}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 px-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  {format(currentDate, "EEE dd/MM", { locale: getDateLocale() })}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextWeek}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 bg-card rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">
                      <div className="text-sm text-muted-foreground">
                        {format(weekStart, "MMMM", { locale: getDateLocale() })}
                      </div>
                      <div className="text-xs text-muted-foreground">W {weekNumber}</div>
                    </th>
                    {weekDays.map((day, index) => (
                      <th key={index} className="text-center p-4 min-w-[120px]">
                        <div className="font-medium">
                          {format(day, "EEE dd", { locale: getDateLocale() })}
                        </div>
                      </th>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 text-sm text-muted-foreground">
                      Children present
                    </td>
                    {weekDays.map((_, dayIndex) => {
                      const count = getChildrenPresentCount(dayIndex);
                      return (
                        <td key={dayIndex} className="p-2">
                          {count > 0 && (
                            <div className="bg-[hsl(210,55%,45%)] text-white rounded p-3 text-center text-sm font-medium">
                              {count} pres.
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filteredChildren.map((child) => (
                    <tr key={child.id} className="border-b hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-medium text-sm">{child.name}</div>
                            <div className="text-xs text-muted-foreground font-semibold">
                              {child.department}
                            </div>
                          </div>
                          {child.alertCount && (
                            <div className="bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                              {child.alertCount}
                            </div>
                          )}
                        </div>
                      </td>
                      {weekDays.map((_, dayIndex) => {
                        const schedule = child.schedules[dayIndex.toString()];
                        return (
                          <td key={dayIndex} className="p-2">
                            {schedule && (
                              <div
                                className={cn(
                                  "rounded p-3 text-center text-sm",
                                  schedule.isTemporary
                                    ? "bg-[hsl(45,95%,70%)] text-foreground"
                                    : "bg-[hsl(210,55%,75%)] text-foreground"
                                )}
                              >
                                {schedule.start}-{schedule.end}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-48 space-y-2">
            <h3 className="font-semibold text-sm mb-3">Schedule type</h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-[hsl(210,55%,75%)]"></div>
              <span>Ordinary</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-[hsl(45,95%,70%)]"></div>
              <span>Temporary</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
