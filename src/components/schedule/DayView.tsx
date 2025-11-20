import React from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { getTimeIntervals, hourlyIntervals, type TimeInterval } from "@/data/staff/timeIntervalSettings";
import { getMaxRatioForDepartment } from "@/data/staff/staffingRatios";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ChildSchedule {
  id: string;
  name: string;
  department: string;
  schedules: Record<string, { start: string; end: string } | null>;
}

interface StaffSchedule {
  id: string;
  name: string;
  role: string;
  department?: string;
  schedules: Record<string, { start: string; end: string } | null>;
}

interface DayViewProps {
  date: Date;
  children: ChildSchedule[];
  staff: StaffSchedule[];
  expandedStaffRows: Set<number>;
  onToggleStaffExpand: (dayIndex: number) => void;
  intervalResolution?: 'default' | 'hourly';
}

// Helper: Convert time string to minutes
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper: Check if schedule overlaps with interval
const overlapsInterval = (
  schedule: { start: string; end: string },
  interval: TimeInterval
): boolean => {
  const scheduleStart = timeToMinutes(schedule.start);
  const scheduleEnd = timeToMinutes(schedule.end);
  const intervalStart = timeToMinutes(interval.start);
  const intervalEnd = interval.end === "00:00" ? 24 * 60 : timeToMinutes(interval.end);

  // Handle midnight crossing
  if (scheduleEnd < scheduleStart) {
    // Schedule crosses midnight
    return intervalStart >= scheduleStart || intervalEnd <= scheduleEnd;
  }

  if (intervalEnd < intervalStart) {
    // Interval crosses midnight
    return scheduleStart <= intervalEnd || scheduleEnd >= intervalStart;
  }

  // Normal case: check for overlap
  return scheduleStart < intervalEnd && scheduleEnd > intervalStart;
};

export function DayView({ date, children, staff, expandedStaffRows, onToggleStaffExpand, intervalResolution = 'default' }: DayViewProps) {
  const locale = useLocale();
  const timeIntervals = intervalResolution === 'hourly' ? hourlyIntervals : getTimeIntervals();
  const columnWidth = intervalResolution === 'hourly' ? 'min-w-[60px]' : 'min-w-[90px]';
  const currentDayIndex = date.getDay();

  // Get children present in an interval
  const getChildrenInInterval = (interval: TimeInterval) => {
    return children.filter((child) => {
      const schedule = child.schedules[currentDayIndex.toString()];
      return schedule && overlapsInterval(schedule, interval);
    });
  };

  // Get staff present in an interval
  const getStaffInInterval = (interval: TimeInterval) => {
    return staff.filter((s) => {
      const schedule = s.schedules[currentDayIndex.toString()];
      return schedule && overlapsInterval(schedule, interval);
    });
  };

  // Check if understaffed in interval
  const isUnderStaffedInInterval = (interval: TimeInterval, department: string) => {
    const childrenInDept = getChildrenInInterval(interval).filter(c => c.department === department);
    const staffInDept = getStaffInInterval(interval).filter(s => s.department === department);
    
    const childrenCount = childrenInDept.length;
    const staffCount = staffInDept.length;
    const maxRatio = getMaxRatioForDepartment(department);

    return staffCount > 0 && childrenCount / staffCount > maxRatio;
  };

  // Group children by department
  const departmentGroups = children.reduce((acc, child) => {
    if (!acc[child.department]) {
      acc[child.department] = [];
    }
    acc[child.department].push(child);
    return acc;
  }, {} as Record<string, ChildSchedule[]>);

  return (
    <div className="bg-card rounded-lg border">
      <div className="overflow-x-auto schedule-day-scroll">
        <table className="w-full text-xs border-collapse">
          <thead className="sticky top-0 z-30 bg-muted/95 backdrop-blur shadow-sm">
            <tr className="border-b">
              <th className="text-left px-3 py-2 font-medium w-[180px] sticky left-0 bg-muted/95 z-20 border-r">
                {format(date, "EEEE dd MMMM", { locale })}
              </th>
              {timeIntervals.map((interval, idx) => (
                <th key={idx} className={`text-center px-2 py-2 ${columnWidth} font-medium text-xs border-r bg-muted/95`}>
                  {interval.label}
                </th>
              ))}
            </tr>
          </thead>
        <tbody>
          {Object.entries(departmentGroups).map(([department, deptChildren]) => {
            const deptStaff = staff.filter(s => s.department === department);
            
            return (
              <React.Fragment key={department}>
                {/* Department header */}
                <tr className="border-b bg-primary/5">
                  <td className="px-3 py-2 font-semibold text-sm sticky left-0 bg-primary/5 z-10 border-r" colSpan={timeIntervals.length + 1}>
                    {department}
                  </td>
                </tr>

                {/* Children present row */}
                <tr className="border-b bg-muted/20">
                  <td className="px-3 py-1.5 text-xs text-muted-foreground sticky left-0 bg-muted/20 z-10 border-r">
                    Barn närvarande
                  </td>
                  {timeIntervals.map((interval, idx) => {
                    const childrenInInterval = getChildrenInInterval(interval).filter(c => c.department === department);
                    const count = childrenInInterval.length;
                    return (
                      <td key={idx} className="px-2 py-1.5 border-r">
                        {count > 0 && (
                          <div className="bg-[hsl(210,55%,75%)] text-foreground rounded px-2 py-1 text-center text-[11px] font-medium">
                            {count}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Staff present row - expandable */}
                <tr className="border-b bg-[hsl(142,76%,85%)]">
                  <td 
                    className="px-3 py-1.5 text-xs text-foreground sticky left-0 bg-[hsl(142,76%,85%)] z-10 cursor-pointer hover:bg-[hsl(142,76%,80%)] transition-colors border-r"
                    onClick={() => onToggleStaffExpand(currentDayIndex)}
                  >
                    <div className="flex items-center gap-1">
                      {expandedStaffRows.has(currentDayIndex) ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                      Personal närvarande
                    </div>
                  </td>
                  {timeIntervals.map((interval, idx) => {
                    const staffInInterval = getStaffInInterval(interval).filter(s => s.department === department);
                    const count = staffInInterval.length;
                    const staffNames = staffInInterval.map(s => s.name).join(", ");
                    return (
                      <td key={idx} className="px-2 py-1.5 border-r">
                        {count > 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="bg-[hsl(142,76%,75%)] text-foreground rounded px-2 py-1 text-center text-[11px] font-medium cursor-help">
                                  {count}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">{staffNames}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Expanded staff details */}
                {expandedStaffRows.has(currentDayIndex) && deptStaff.map((staffMember) => {
                  const schedule = staffMember.schedules[currentDayIndex.toString()];
                  if (!schedule) return null;
                  
                  return (
                    <tr key={staffMember.id} className="border-b bg-muted/10">
                      <td className="px-6 py-1 text-xs sticky left-0 bg-muted/10 z-10 border-r">
                        {staffMember.name} - {staffMember.role}
                      </td>
                      {timeIntervals.map((interval, idx) => {
                        const isWorking = overlapsInterval(schedule, interval);
                        return (
                          <td key={idx} className="px-2 py-1 border-r">
                            {isWorking && (
                              <div className="bg-[hsl(210,55%,75%)] rounded px-2 py-1 text-center text-[11px] text-foreground">
                                ✓
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* Ratio row */}
                <tr className="border-b">
                  <td className="px-3 py-1.5 text-xs text-muted-foreground sticky left-0 bg-background z-10 border-r">
                    Ratio
                  </td>
                  {timeIntervals.map((interval, idx) => {
                    const childrenInInterval = getChildrenInInterval(interval).filter(c => c.department === department);
                    const staffInInterval = getStaffInInterval(interval).filter(s => s.department === department);
                    const childrenCount = childrenInInterval.length;
                    const staffCount = staffInInterval.length;
                    const ratio = staffCount > 0 ? childrenCount / staffCount : childrenCount;
                    const understaffed = isUnderStaffedInInterval(interval, department);
                    
                    return (
                      <td key={idx} className="px-2 py-1.5 border-r">
                        {childrenCount > 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={cn(
                                    "rounded px-2 py-1 text-center text-[11px] font-medium flex items-center justify-center gap-1 cursor-help",
                                    understaffed
                                      ? "bg-[hsl(0,84%,75%)] text-foreground"
                                      : "bg-muted text-foreground"
                                  )}
                                >
                                  {staffCount > 0 ? `1:${Math.round(ratio)}` : `${childrenCount}:0`}
                                  {understaffed && <AlertTriangle className="h-3 w-3" />}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">
                                  {childrenCount} barn, {staffCount} personal
                                  {understaffed && " - Underbemanning!"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Children rows */}
                {deptChildren.map((child) => {
                  const schedule = child.schedules[currentDayIndex.toString()];
                  if (!schedule) return null;
                  
                  return (
                    <tr key={child.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-1.5 sticky left-0 bg-background z-10 border-r">
                        <div className="font-medium text-xs">{child.name}</div>
                      </td>
                      {timeIntervals.map((interval, idx) => {
                        const isPresent = overlapsInterval(schedule, interval);
                        return (
                          <td key={idx} className="px-2 py-1.5 border-r">
                            {isPresent && (
                              <div className="bg-[hsl(210,55%,75%)] rounded px-2 py-1 text-center text-[11px] text-foreground">
                                ✓
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}
