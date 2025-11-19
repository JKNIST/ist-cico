import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Printer, Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addDays, startOfWeek, getWeek } from "date-fns";
import { sv, enUS, nb } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useDepartmentFilter } from "@/contexts/DepartmentFilterContext";
import { mockStaffSchedules } from "@/data/staff/mockStaffSchedules";
import { getMaxRatioForDepartment } from "@/data/staff/staffingRatios";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [staffingRatios, setStaffingRatios] = useState<Record<string, number>>({});

  useEffect(() => {
    const updateRatios = () => {
      const departments = ["Blåbär", "Lingon", "Odon", "Vildhallon"];
      const ratios: Record<string, number> = {};
      departments.forEach((dept) => {
        ratios[dept] = getMaxRatioForDepartment(dept);
      });
      setStaffingRatios(ratios);
    };

    updateRatios();
    window.addEventListener("staffingRatiosUpdated", updateRatios);
    return () => window.removeEventListener("staffingRatiosUpdated", updateRatios);
  }, []);

  const filteredChildren = mockChildrenSchedules.filter((child) => {
    return selectedDepartments.length === 0 || selectedDepartments.includes(child.department);
  });

  const filteredStaff = mockStaffSchedules.filter((staff) => {
    if (!staff.department) return false;
    return selectedDepartments.length === 0 || selectedDepartments.includes(staff.department);
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

  const getStaffPresentCount = (dayIndex: number) => {
    return filteredStaff.filter((staff) => staff.schedules[dayIndex.toString()]).length;
  };

  const getStaffingRatio = (dayIndex: number) => {
    const children = getChildrenPresentCount(dayIndex);
    const staff = getStaffPresentCount(dayIndex);
    return { children, staff, ratio: staff > 0 ? children / staff : children };
  };

  const isUnderStaffed = (dayIndex: number) => {
    const { children, staff, ratio } = getStaffingRatio(dayIndex);
    if (staff === 0 && children > 0) return true;
    
    // Check across all departments for filtered data
    const uniqueDepartments = Array.from(
      new Set(filteredChildren.map((c) => c.department))
    );
    
    // Consider understaffed if any department exceeds its ratio
    for (const dept of uniqueDepartments) {
      const deptChildren = filteredChildren.filter(
        (c) => c.department === dept && c.schedules[dayIndex.toString()]
      ).length;
      const deptStaff = filteredStaff.filter(
        (s) => s.department === dept && s.schedules[dayIndex.toString()]
      ).length;
      
      const maxRatio = staffingRatios[dept] || 5;
      if (deptStaff > 0 && deptChildren / deptStaff > maxRatio) {
        return true;
      }
      if (deptStaff === 0 && deptChildren > 0) {
        return true;
      }
    }
    
    return false;
  };

  const getStaffPresentNames = (dayIndex: number) => {
    return filteredStaff
      .filter((staff) => staff.schedules[dayIndex.toString()])
      .map((staff) => `${staff.name} (${staff.department})`)
      .join(", ");
  };

  return (
    <div className="h-full bg-muted/30">
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

        <div className="flex gap-4">
          <div className="flex-1 bg-card rounded-lg border overflow-hidden">
            <div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-2 py-1 font-medium w-[160px]">
                      <div className="text-sm text-muted-foreground">
                        {format(weekStart, "MMMM", { locale: getDateLocale() })}
                      </div>
                      <div className="text-xs text-muted-foreground">W {weekNumber}</div>
                    </th>
                    {weekDays.map((day, index) => (
                      <th key={index} className="text-center px-2 py-1">
                        <div className="font-medium leading-tight">
                          {format(day, "EEE dd", { locale: getDateLocale() })}
                        </div>
                      </th>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="px-2 py-1 text-xs text-muted-foreground">
                      Children present
                    </td>
                    {weekDays.map((_, dayIndex) => {
                      const count = getChildrenPresentCount(dayIndex);
                      return (
                        <td key={dayIndex} className="px-2 py-1">
                          {count > 0 && (
                            <div className="bg-[hsl(210,55%,45%)] text-white rounded px-1 py-1 text-center text-[11px] font-medium">
                              {count} pres.
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="px-2 py-1 text-xs text-muted-foreground">
                      Staff present
                    </td>
                    {weekDays.map((_, dayIndex) => {
                      const count = getStaffPresentCount(dayIndex);
                      const names = getStaffPresentNames(dayIndex);
                      return (
                        <td key={dayIndex} className="px-2 py-1">
                          {count > 0 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="bg-[hsl(142,76%,75%)] text-foreground rounded px-1 py-1 text-center text-[11px] font-medium cursor-help">
                                    {count} pers.
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">{names}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="px-2 py-1 text-xs text-muted-foreground">
                      Ratio
                    </td>
                    {weekDays.map((_, dayIndex) => {
                      const { children, staff, ratio } = getStaffingRatio(dayIndex);
                      const understaffed = isUnderStaffed(dayIndex);
                      
                      return (
                        <td key={dayIndex} className="px-2 py-1">
                          {children > 0 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className={cn(
                                      "rounded px-1 py-1 text-center text-[11px] font-medium flex items-center justify-center gap-1 cursor-help",
                                      understaffed
                                        ? "bg-[hsl(0,84%,75%)] text-foreground"
                                        : "bg-muted text-foreground"
                                    )}
                                  >
                                    {staff > 0 ? `1:${Math.round(ratio)}` : "0:1"}
                                    {understaffed && <AlertTriangle className="h-3 w-3" />}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="text-xs space-y-1">
                                    <p>Barn: {children}</p>
                                    <p>Personal: {staff}</p>
                                    {understaffed && (
                                      <p className="text-destructive font-medium">
                                        ⚠️ För lite personal
                                      </p>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filteredChildren.map((child) => (
                    <tr key={child.id} className="border-b hover:bg-muted/30">
                      <td className="px-2 py-1">
                        <div className="flex items-center gap-1">
                          <div>
                            <div className="font-medium text-xs break-words">{child.name}</div>
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
                          <td key={dayIndex} className="px-2 py-1">
                            {schedule && (
                              <div
                                className={cn(
                                  "rounded px-1 py-1 text-center text-[11px]",
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
