import React from "react";
import { format } from "date-fns";
import { AlertTriangle, User } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { getMaxRatioForDepartment } from "@/data/staff/staffingRatios";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Helper: Get department color for visual distinction
const getDepartmentColor = (department: string): string => {
  const colors: Record<string, string> = {
    'Blåbär': 'bg-blue-50',
    'Lingon': 'bg-red-50',
    'Odon': 'bg-purple-50',
    'Vildhallon': 'bg-pink-50',
  };
  return colors[department] || 'bg-gray-50';
};

// Helper: Get department badge color
const getDepartmentBadgeColor = (department: string): string => {
  const colors: Record<string, string> = {
    'Blåbär': 'bg-blue-200 text-blue-800',
    'Lingon': 'bg-red-200 text-red-800',
    'Odon': 'bg-purple-200 text-purple-800',
    'Vildhallon': 'bg-pink-200 text-pink-800',
  };
  return colors[department] || 'bg-gray-200 text-gray-800';
};

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

  // Get unique departments from children
  const selectedDepartments = Array.from(new Set(children.map(c => c.department)));

  // Total calculations across all departments
  const getChildrenPresentCount = (dayIndex: number) => {
    return children.filter(child => child.schedules[dayIndex.toString()]).length;
  };

  const getStaffPresentCount = (dayIndex: number) => {
    return staff.filter(s => s.schedules[dayIndex.toString()]).length;
  };

  const getStaffingRatio = (dayIndex: number) => {
    const childrenCount = getChildrenPresentCount(dayIndex);
    const staffCount = getStaffPresentCount(dayIndex);
    return staffCount > 0 ? childrenCount / staffCount : childrenCount;
  };

  const isUnderStaffed = (dayIndex: number) => {
    // Check if any department is understaffed
    return selectedDepartments.some(dept => {
      const childrenCount = children.filter(
        c => c.department === dept && c.schedules[dayIndex.toString()]
      ).length;
      const staffCount = staff.filter(
        s => s.department === dept && s.schedules[dayIndex.toString()]
      ).length;
      const maxRatio = getMaxRatioForDepartment(dept);
      return staffCount > 0 && childrenCount / staffCount > maxRatio;
    });
  };

  const getStaffPresentNames = (dayIndex: number) => {
    return staff
      .filter(s => s.schedules[dayIndex.toString()])
      .map(s => s.name)
      .join(", ");
  };

  // Combine and sort all children and staff
  const allChildrenSorted = [...children].sort((a, b) => {
    if (a.department !== b.department) {
      return a.department.localeCompare(b.department);
    }
    return a.name.localeCompare(b.name);
  });

  const allStaffSorted = [...staff]
    .filter(s => s.department && selectedDepartments.includes(s.department))
    .sort((a, b) => {
      if (a.department !== b.department) {
        return (a.department || '').localeCompare(b.department || '');
      }
      return a.name.localeCompare(b.name);
    });

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
          {/* Children present row */}
          <tr className="border-b bg-muted/20">
            <td className="px-3 py-1.5 text-xs text-muted-foreground sticky left-0 bg-muted/20 z-10">
              Barn närvarande
            </td>
            {weekDays.map((_, dayIndex) => {
              const count = getChildrenPresentCount(dayIndex);
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
              const count = getStaffPresentCount(dayIndex);
              const staffNames = getStaffPresentNames(dayIndex);
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
              const ratio = getStaffingRatio(dayIndex);
              const understaffed = isUnderStaffed(dayIndex);
              const childrenCount = getChildrenPresentCount(dayIndex);
              const staffCount = getStaffPresentCount(dayIndex);
              
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
                            Totalt: {childrenCount} barn, {staffCount} personal = 1:{Math.round(ratio)}
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

          {/* All children rows with department color coding */}
          {allChildrenSorted.map((child) => (
            <tr key={child.id} className={cn("border-b hover:bg-muted/30", getDepartmentColor(child.department))}>
              <td className={cn("px-3 py-2 sticky left-0 z-10 border-r", getDepartmentColor(child.department))}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{child.name}</span>
                  {selectedDepartments.length > 1 && (
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", getDepartmentBadgeColor(child.department))}>
                      {child.department}
                    </span>
                  )}
                  {child.alertCount && child.alertCount > 0 && (
                    <span className="text-orange-500">
                      <AlertTriangle className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </td>
              {weekDays.map((_, dayIndex) => {
                const schedule = child.schedules[dayIndex.toString()];
                
                return (
                  <td key={dayIndex} className="px-2 py-2 text-center">
                    {schedule ? (
                      <div className="bg-[hsl(210,55%,75%)] text-foreground rounded px-2 py-1 text-[11px]">
                        {schedule.start} - {schedule.end}
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}

          {/* All staff rows with green background */}
          {allStaffSorted.map((staffMember) => (
            <tr key={staffMember.id} className="border-b hover:bg-muted/30 bg-green-50/50">
              <td className="px-3 py-2 sticky left-0 bg-green-50/50 z-10 border-r">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium text-xs">{staffMember.name}</span>
                  <span className="text-[10px] text-muted-foreground">({staffMember.role})</span>
                  {selectedDepartments.length > 1 && staffMember.department && (
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", getDepartmentBadgeColor(staffMember.department))}>
                      {staffMember.department}
                    </span>
                  )}
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
        </tbody>
      </table>
    </div>
  );
}
