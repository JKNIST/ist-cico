import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { getMaxRatioForDepartment } from "@/data/staff/staffingRatios";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ChildSchedule {
  id: string;
  name: string;
  department: string;
  schedules: Record<string, { start: string; end: string } | null>;
  alertCount?: number;
}

interface StaffSchedule {
  id: string;
  name: string;
  role: string;
  department?: string;
  schedules: Record<string, { start: string; end: string } | null>;
}

interface WeekViewProps {
  weekStart: Date;
  weekDays: Date[];
  children: ChildSchedule[];
  staff: StaffSchedule[];
  onStaffCellClick?: (staffId: string, staffName: string, dayIndex: number, schedule: { start: string; end: string } | null) => void;
}

export function WeekView({ weekStart, weekDays, children, staff, onStaffCellClick }: WeekViewProps) {
  const locale = useLocale();

  const getChildrenPresentCount = (dayIndex: number, department: string) => {
    return children.filter(
      (child) => child.department === department && child.schedules[dayIndex.toString()]
    ).length;
  };

  const getStaffPresentCount = (dayIndex: number, department: string) => {
    return staff.filter(
      (s) => s.department === department && s.schedules[dayIndex.toString()]
    ).length;
  };

  const getStaffingRatio = (dayIndex: number, department: string) => {
    const childrenCount = getChildrenPresentCount(dayIndex, department);
    const staffCount = getStaffPresentCount(dayIndex, department);
    return staffCount > 0 ? childrenCount / staffCount : childrenCount;
  };

  const isUnderStaffed = (dayIndex: number, department: string) => {
    const childrenCount = getChildrenPresentCount(dayIndex, department);
    const staffCount = getStaffPresentCount(dayIndex, department);
    const maxRatio = getMaxRatioForDepartment(department);
    return staffCount > 0 && childrenCount / staffCount > maxRatio;
  };

  const getStaffPresentNames = (dayIndex: number, department: string) => {
    return staff
      .filter((s) => s.department === department && s.schedules[dayIndex.toString()])
      .map((s) => s.name)
      .join(", ");
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
    <div className="bg-card rounded-lg border overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left px-3 py-2 font-medium w-[200px] sticky left-0 bg-muted/50 z-10">
              Namn
            </th>
            {weekDays.map((day, index) => (
              <th key={index} className="text-center px-2 py-2 min-w-[100px]">
                <div className="font-medium">{format(day, "EEE", { locale })}</div>
                <div className="text-xs text-muted-foreground">{format(day, "d/M")}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(departmentGroups).map(([department, deptChildren]) => (
            <React.Fragment key={department}>
              {/* Department header */}
              <tr className="border-b bg-primary/5">
                <td className="px-3 py-2 font-semibold text-sm sticky left-0 bg-primary/5 z-10" colSpan={8}>
                  {department}
                </td>
              </tr>

              {/* Children present row */}
              <tr className="border-b bg-muted/20">
                <td className="px-3 py-1.5 text-xs text-muted-foreground sticky left-0 bg-muted/20 z-10">
                  Barn närvarande
                </td>
                {weekDays.map((_, dayIndex) => {
                  const count = getChildrenPresentCount(dayIndex, department);
                  return (
                    <td key={dayIndex} className="px-2 py-1.5 text-center">
                      {count > 0 && (
                        <div className="bg-[hsl(210,55%,75%)] text-foreground rounded px-2 py-1 inline-block text-[11px] font-medium">
                          {count}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Staff present row */}
              <tr className="border-b bg-[hsl(142,76%,85%)]">
                <td className="px-3 py-1.5 text-xs text-foreground sticky left-0 bg-[hsl(142,76%,85%)] z-10">
                  Personal närvarande
                </td>
                {weekDays.map((_, dayIndex) => {
                  const count = getStaffPresentCount(dayIndex, department);
                  const staffNames = getStaffPresentNames(dayIndex, department);
                  return (
                    <td key={dayIndex} className="px-2 py-1.5 text-center">
                      {count > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="bg-[hsl(142,76%,75%)] text-foreground rounded px-2 py-1 inline-block text-[11px] font-medium cursor-help">
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

              {/* Ratio row */}
              <tr className="border-b">
                <td className="px-3 py-1.5 text-xs text-muted-foreground sticky left-0 bg-background z-10">
                  Ratio
                </td>
                {weekDays.map((_, dayIndex) => {
                  const ratio = getStaffingRatio(dayIndex, department);
                  const understaffed = isUnderStaffed(dayIndex, department);
                  const childrenCount = getChildrenPresentCount(dayIndex, department);
                  const staffCount = getStaffPresentCount(dayIndex, department);
                  const maxRatio = getMaxRatioForDepartment(department);
                  
                  return (
                    <td key={dayIndex} className="px-2 py-1.5 text-center">
                      {childrenCount > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "rounded px-2 py-1 inline-flex items-center gap-1 text-[11px] font-medium cursor-help",
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
                                Aktuellt: {childrenCount} barn, {staffCount} personal = 1:{Math.round(ratio)}
                                <br />
                                Max: 1:{maxRatio}
                                {understaffed && <><br /><strong>Underbemanning!</strong></>}
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
              {deptChildren.map((child) => (
                <tr key={child.id} className="border-b hover:bg-muted/30">
                  <td className="px-3 py-2 sticky left-0 bg-background z-10">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{child.name}</span>
                      {child.alertCount && child.alertCount > 0 && (
                        <span className="text-orange-500">
                          <AlertTriangle className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </td>
                  {weekDays.map((_, dayIndex) => {
                    const schedule = child.schedules[dayIndex.toString()];
                    const isTemporary = false; // You can add logic to detect temporary schedules if needed
                    
                    return (
                      <td key={dayIndex} className="px-2 py-2 text-center">
                        {schedule ? (
                          <div
                            className={cn(
                              "rounded px-2 py-1 text-[11px]",
                              isTemporary
                                ? "bg-[hsl(142,76%,75%)] text-foreground"
                                : "bg-[hsl(210,55%,75%)] text-foreground"
                            )}
                          >
                            {schedule.start} - {schedule.end}
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Staff rows */}
              {staff
                .filter((s) => s.department === department)
                .map((staffMember) => (
                  <tr key={staffMember.id} className="border-b hover:bg-muted/30 bg-green-50/30">
                    <td className="px-3 py-2 sticky left-0 bg-green-50/30 z-10">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs">{staffMember.name}</span>
                        <span className="text-[10px] text-muted-foreground">({staffMember.role})</span>
                      </div>
                    </td>
                    {weekDays.map((_, dayIndex) => {
                      const schedule = staffMember.schedules[dayIndex.toString()];
                      
                      return (
                        <td 
                          key={dayIndex} 
                          className="px-2 py-2 text-center cursor-pointer hover:bg-muted/50"
                          onClick={() => onStaffCellClick?.(staffMember.id, staffMember.name, dayIndex, schedule)}
                        >
                          {schedule ? (
                            <div className="bg-[hsl(210,55%,75%)] text-foreground rounded px-2 py-1 text-[11px]">
                              {schedule.start} - {schedule.end}
                            </div>
                          ) : (
                            <div className="bg-muted/30 text-muted-foreground rounded px-2 py-1 text-[11px]">
                              Ledig
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Add React import for Fragment
import React from "react";
