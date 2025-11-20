import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Printer, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, addDays, startOfWeek, getWeek, addWeeks, subWeeks } from "date-fns";
import { sv, enUS, nb } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useDepartmentFilter } from "@/contexts/DepartmentFilterContext";
import { mockChildren } from "@/data/groups/mockChildren";
import { mockStaffSchedules } from "@/data/staff/mockStaffSchedules";
import { WeekView } from "@/components/schedule/WeekView";
import { DayView } from "@/components/schedule/DayView";
import { ColorLegend } from "@/components/ColorLegend";
import { StaffScheduleDialog } from "@/components/staff/StaffScheduleDialog";

interface ChildSchedule {
  id: string;
  name: string;
  department: string;
  schedules: {
    [key: string]: { start: string; end: string; isTemporary?: boolean } | null;
  };
  alertCount?: number;
}

const generateChildSchedules = (): ChildSchedule[] => {
  return mockChildren.map((child, index) => {
    const rand = index % 20;
    let schedules: ChildSchedule["schedules"] = {};
    
    if (rand < 16) {
      const startTime = rand % 3 === 0 ? "07:00" : rand % 3 === 1 ? "08:00" : "07:30";
      const endTime = rand % 3 === 0 ? "16:00" : rand % 3 === 1 ? "17:00" : "16:30";
      schedules = {
        "1": { start: startTime, end: endTime },
        "2": { start: startTime, end: endTime },
        "3": { start: startTime, end: endTime },
        "4": { start: startTime, end: endTime },
        "5": { start: startTime, end: endTime },
      };
    } else if (rand < 19) {
      schedules = {
        "1": { start: "08:00", end: "16:00" },
        "2": { start: "08:00", end: "16:00" },
        "3": rand % 3 === 0 ? null : { start: "08:00", end: "16:00" },
        "4": { start: "08:00", end: "16:00" },
      };
    }
    
    return {
      id: child.id,
      name: child.name,
      department: child.department,
      schedules,
      alertCount: Object.keys(schedules).length === 0 ? 1 : 0,
    };
  });
};

const childrenSchedules = generateChildSchedules();

export default function Schedule() {
  const { i18n, t } = useTranslation();
  const { selectedDepartments } = useDepartmentFilter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [intervalResolution, setIntervalResolution] = useState<'default' | 'hourly'>('default');
  const [expandedStaffRows, setExpandedStaffRows] = useState<Set<number>>(new Set());
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<{
    staffId: string;
    staffName: string;
    dayIndex: number;
    dayName: string;
    currentSchedule: { start: string; end: string } | null;
  } | null>(null);
  const [staffSchedules, setStaffSchedules] = useState(mockStaffSchedules);

  useEffect(() => {
    const handleIntervalsUpdated = () => setExpandedStaffRows(new Set());
    window.addEventListener("timeIntervalsUpdated", handleIntervalsUpdated);
    return () => window.removeEventListener("timeIntervalsUpdated", handleIntervalsUpdated);
  }, []);

  // Load staff schedules from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("staffSchedules");
    if (saved) {
      try {
        setStaffSchedules(JSON.parse(saved));
      } catch {
        setStaffSchedules(mockStaffSchedules);
      }
    }
  }, []);

  // Save staff schedules to localStorage
  useEffect(() => {
    if (staffSchedules.length > 0) {
      localStorage.setItem("staffSchedules", JSON.stringify(staffSchedules));
    }
  }, [staffSchedules]);

  const filteredChildren = childrenSchedules.filter((child) =>
    selectedDepartments.length === 0 || selectedDepartments.includes(child.department)
  );

  const filteredStaff = staffSchedules.filter((staff) =>
    staff.department && (selectedDepartments.length === 0 || selectedDepartments.includes(staff.department))
  );

  const getDateLocale = () => {
    switch (i18n.language) {
      case "sv": return sv;
      case "no": return nb;
      default: return enUS;
    }
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekNumber = getWeek(weekStart, { weekStartsOn: 1, firstWeekContainsDate: 4 });

  const goToPrevious = () => {
    setCurrentDate(viewMode === 'week' ? subWeeks(currentDate, 1) : addDays(currentDate, -1));
  };

  const goToNext = () => {
    setCurrentDate(viewMode === 'week' ? addWeeks(currentDate, 1) : addDays(currentDate, 1));
  };

  const toggleStaffExpand = (dayIndex: number) => {
    setExpandedStaffRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(dayIndex) ? newSet.delete(dayIndex) : newSet.add(dayIndex);
      return newSet;
    });
  };

  const handleStaffCellClick = (
    staffId: string,
    staffName: string,
    dayIndex: number,
    currentSchedule: { start: string; end: string } | null
  ) => {
    const dayDate = viewMode === 'week' ? weekDays[dayIndex] : currentDate;
    const dayName = format(dayDate, "EEEE d MMMM", { locale: getDateLocale() });
    setSelectedStaff({ staffId, staffName, dayIndex, dayName, currentSchedule });
    setStaffDialogOpen(true);
  };

  const handleSaveStaffSchedule = (schedule: { start: string; end: string } | null) => {
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

  return (
    <div className="h-full bg-muted/30">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Schema</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border rounded-lg p-1 bg-card">
              <Button variant={viewMode === 'week' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('week')}>
                Vecka {weekNumber}
              </Button>
              <Button variant={viewMode === 'day' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('day')}>
                {format(currentDate, "EEE dd/MM", { locale: getDateLocale() })}
              </Button>
            </div>

            {viewMode === 'day' && (
              <div className="flex items-center gap-2 border-l pl-4 ml-2">
                <span className="text-sm text-muted-foreground">Visa:</span>
                <div className="flex items-center gap-1 border rounded-lg p-1 bg-card">
                  <Button
                    variant={intervalResolution === 'default' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setIntervalResolution('default')}
                  >
                    Standard
                  </Button>
                  <Button
                    variant={intervalResolution === 'hourly' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setIntervalResolution('hourly')}
                  >
                    Timvis
                  </Button>
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              {viewMode === 'week' ? (
                <>{format(weekStart, "d MMM", { locale: getDateLocale() })} - {format(addDays(weekStart, 6), "d MMM yyyy", { locale: getDateLocale() })}</>
              ) : (
                format(currentDate, "d MMMM yyyy", { locale: getDateLocale() })
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPrevious}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>{t("calendar.today")}</Button>
              <Button variant="outline" size="sm" onClick={goToNext}><ChevronRight className="h-4 w-4" /></Button>
            </div>

            <Button variant="outline" size="sm"><Printer className="h-4 w-4 mr-2" />Skriv ut</Button>
          </div>
        </div>

        {selectedDepartments.length > 0 && (
          <div className="mb-4 flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Visar avdelningar:</span>
            {selectedDepartments.map((dept) => <Badge key={dept} variant="secondary">{dept}</Badge>)}
          </div>
        )}

        {viewMode === 'week' ? (
          <WeekView 
            weekStart={weekStart} 
            weekDays={weekDays} 
            children={filteredChildren} 
            staff={filteredStaff}
            onStaffCellClick={handleStaffCellClick}
          />
        ) : (
          <DayView 
            date={currentDate} 
            children={filteredChildren} 
            staff={filteredStaff} 
            expandedStaffRows={expandedStaffRows} 
            onToggleStaffExpand={toggleStaffExpand} 
            intervalResolution={intervalResolution}
            onStaffCellClick={handleStaffCellClick}
          />
        )}

        <ColorLegend />

        {selectedStaff && (
          <StaffScheduleDialog
            open={staffDialogOpen}
            onOpenChange={setStaffDialogOpen}
            staffName={selectedStaff.staffName}
            dayName={selectedStaff.dayName}
            currentSchedule={selectedStaff.currentSchedule}
            onSave={handleSaveStaffSchedule}
          />
        )}
      </div>
    </div>
  );
}
