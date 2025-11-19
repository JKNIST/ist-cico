import { useState } from "react";
import { Calendar, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { format, startOfWeek, addDays, addWeeks, subWeeks, getWeek } from "date-fns";
import { useLocale } from "@/hooks/useLocale";
import { useDepartmentFilter } from "@/contexts/DepartmentFilterContext";
import { mockStaffSchedules } from "@/data/staff/mockStaffSchedules";
import { StaffScheduleDialog } from "@/components/staff/StaffScheduleDialog";
import { StaffingRatioSettings } from "@/components/administration/StaffingRatioSettings";
import { cn } from "@/lib/utils";

export default function StaffSchedule() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { selectedDepartments } = useDepartmentFilter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<{
    staffId: string;
    staffName: string;
    dayIndex: number;
    dayName: string;
    currentSchedule: { start: string; end: string } | null;
  } | null>(null);
  const [staffSchedules, setStaffSchedules] = useState(mockStaffSchedules);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekNumber = getWeek(weekStart, { weekStartsOn: 1, firstWeekContainsDate: 4 });

  const filteredStaff =
    selectedDepartments.length === 0
      ? staffSchedules
      : staffSchedules.filter(
          (staff) => staff.department && selectedDepartments.includes(staff.department)
        );

  const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const goToCurrentWeek = () => setCurrentDate(new Date());

  const handleCellClick = (
    staffId: string,
    staffName: string,
    dayIndex: number,
    currentSchedule: { start: string; end: string } | null
  ) => {
    const dayName = format(weekDays[dayIndex], "EEEE d MMMM", { locale });
    setSelectedStaff({ staffId, staffName, dayIndex, dayName, currentSchedule });
    setDialogOpen(true);
  };

  const handleSaveSchedule = (schedule: { start: string; end: string } | null) => {
    if (!selectedStaff) return;

    setStaffSchedules((prev) =>
      prev.map((staff) =>
        staff.id === selectedStaff.staffId
          ? {
              ...staff,
              schedules: {
                ...staff.schedules,
                [selectedStaff.dayIndex]: schedule,
              },
            }
          : staff
      )
    );
  };

  const getStaffPresentCount = (dayIndex: number) => {
    return filteredStaff.filter((staff) => staff.schedules[dayIndex.toString()]).length;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Personalschema</h1>
        </div>

        <div className="mb-6">
          <StaffingRatioSettings />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
              Idag
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 bg-card rounded-lg border overflow-hidden">
            <div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-2 py-1 font-medium w-[160px]">
                      <div className="text-sm text-muted-foreground">
                        {format(weekStart, "MMMM", { locale })}
                      </div>
                      <div className="text-xs text-muted-foreground">V {weekNumber}</div>
                    </th>
                    {weekDays.map((day, index) => (
                      <th key={index} className="text-center px-2 py-1">
                        <div className="font-medium leading-tight">
                          {format(day, "EEE dd", { locale })}
                        </div>
                      </th>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="px-2 py-1 text-xs text-muted-foreground">
                      Staff present
                    </td>
                    {weekDays.map((_, dayIndex) => {
                      const count = getStaffPresentCount(dayIndex);
                      return (
                        <td key={dayIndex} className="px-2 py-1">
                          {count > 0 && (
                            <div className="bg-[hsl(142,76%,75%)] text-foreground rounded px-1 py-1 text-center text-[11px] font-medium">
                              {count} pers.
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="border-b hover:bg-muted/30">
                      <td className="px-2 py-1">
                        <div className="flex items-center gap-1">
                          <div>
                            <div className="font-medium text-xs break-words">{staff.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {staff.role}
                              {staff.department && ` · ${staff.department}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      {weekDays.map((_, dayIndex) => {
                        const schedule = staff.schedules[dayIndex.toString()];
                        return (
                          <td
                            key={dayIndex}
                            className="px-2 py-1 cursor-pointer"
                            onClick={() =>
                              handleCellClick(staff.id, staff.name, dayIndex, schedule)
                            }
                          >
                            {schedule ? (
                              <div className="rounded px-1 py-1 text-center text-[11px] bg-[hsl(210,55%,75%)] text-foreground hover:bg-[hsl(210,55%,70%)]">
                                {schedule.start}-{schedule.end}
                              </div>
                            ) : (
                              <div className="rounded px-1 py-1 text-center text-[11px] bg-muted/30 text-muted-foreground hover:bg-muted/50">
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
          </div>

          <div className="w-48">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3">Legend</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[hsl(210,55%,75%)]" />
                    <span>Arbetstid</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted/30" />
                    <span>Ledig</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {selectedStaff && (
        <StaffScheduleDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          staffName={selectedStaff.staffName}
          dayName={selectedStaff.dayName}
          currentSchedule={selectedStaff.currentSchedule}
          onSave={handleSaveSchedule}
        />
      )}
    </div>
  );
}
