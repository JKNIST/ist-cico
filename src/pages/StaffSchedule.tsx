import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, UserPlus, FileUp, Edit, Trash2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { format, startOfWeek, addDays, addWeeks, subWeeks, getWeek, isPast } from "date-fns";
import { useLocale } from "@/hooks/useLocale";
import { useDepartmentFilter } from "@/contexts/DepartmentFilterContext";
import { mockStaffSchedules, StaffSchedule as StaffScheduleType } from "@/data/staff/mockStaffSchedules";
import { StaffScheduleDialog } from "@/components/staff/StaffScheduleDialog";
import { AddStaffDialog } from "@/components/staff/AddStaffDialog";
import { EditStaffDialog } from "@/components/staff/EditStaffDialog";
import { ImportStaffDialog } from "@/components/staff/ImportStaffDialog";
import { ScheduleSettings } from "@/components/administration/ScheduleSettings";
import { AIScheduleSuggestionDialog } from "@/components/staff/AIScheduleSuggestionDialog";
import { getStaffingRatios } from "@/data/staff/staffingRatios";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
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
  const [staffSchedules, setStaffSchedules] = useState<StaffScheduleType[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStaffForEdit, setSelectedStaffForEdit] = useState<StaffScheduleType | null>(null);
  const [selectedStaffForDelete, setSelectedStaffForDelete] = useState<string | null>(null);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("staffSchedules");
    if (saved) {
      try {
        setStaffSchedules(JSON.parse(saved));
      } catch {
        setStaffSchedules(mockStaffSchedules);
      }
    } else {
      setStaffSchedules(mockStaffSchedules);
    }
  }, []);

  // Save to localStorage when staffSchedules changes
  useEffect(() => {
    if (staffSchedules.length > 0) {
      localStorage.setItem("staffSchedules", JSON.stringify(staffSchedules));
    }
  }, [staffSchedules]);

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

  const handleAddStaff = (newStaff: {
    name: string;
    role: string;
    department: string;
    isSubstitute: boolean;
    substituteStartDate?: string;
    substituteEndDate?: string;
    defaultSchedule?: { start: string; end: string };
  }) => {
    const id = `staff${Date.now()}`;
    const schedules: { [key: string]: { start: string; end: string } | null } = {};
    
    // Apply default schedule to weekdays (1-5) if provided
    if (newStaff.defaultSchedule) {
      for (let i = 1; i <= 5; i++) {
        schedules[i.toString()] = newStaff.defaultSchedule;
      }
    }

    const staff: StaffScheduleType = {
      id,
      name: newStaff.name,
      role: newStaff.role,
      department: newStaff.department,
      isSubstitute: newStaff.isSubstitute,
      substituteStartDate: newStaff.substituteStartDate,
      substituteEndDate: newStaff.substituteEndDate,
      schedules,
    };

    setStaffSchedules((prev) => [...prev, staff]);
    toast({
      title: t("staffSchedule.staffAdded"),
      description: t("staffSchedule.staffAddedSuccess", { name: newStaff.name }),
    });
  };

  const handleEditStaff = (staff: StaffScheduleType) => {
    setSelectedStaffForEdit(staff);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = (
    staffId: string,
    updates: {
      name: string;
      role: string;
      department: string;
      isSubstitute: boolean;
      substituteStartDate?: string;
      substituteEndDate?: string;
    }
  ) => {
    setStaffSchedules((prev) =>
      prev.map((staff) =>
        staff.id === staffId
          ? {
              ...staff,
              name: updates.name,
              role: updates.role,
              department: updates.department,
              isSubstitute: updates.isSubstitute,
              substituteStartDate: updates.substituteStartDate,
              substituteEndDate: updates.substituteEndDate,
            }
          : staff
      )
    );
    toast({
      title: t("staffSchedule.staffUpdated"),
      description: t("staffSchedule.staffUpdatedSuccess"),
    });
  };

  const handleDeleteClick = (staffId: string) => {
    setSelectedStaffForDelete(staffId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedStaffForDelete) return;
    
    const staff = staffSchedules.find((s) => s.id === selectedStaffForDelete);
    setStaffSchedules((prev) => prev.filter((s) => s.id !== selectedStaffForDelete));
    
    toast({
      title: t("staffSchedule.staffDeleted"),
      description: t("staffSchedule.staffDeletedSuccess", { name: staff?.name }),
    });
    
    setSelectedStaffForDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleImportStaff = (
    importedStaff: Array<{
      name: string;
      role: string;
      department: string;
      isSubstitute: boolean;
      substituteStartDate?: string;
      substituteEndDate?: string;
    }>
  ) => {
    const newStaff: StaffScheduleType[] = importedStaff.map((staff, index) => ({
      id: `staff${Date.now()}_${index}`,
      name: staff.name,
      role: staff.role,
      department: staff.department,
      isSubstitute: staff.isSubstitute,
      substituteStartDate: staff.substituteStartDate,
      substituteEndDate: staff.substituteEndDate,
      schedules: {},
    }));

    setStaffSchedules((prev) => [...prev, ...newStaff]);
  };

  const isSubstituteExpired = (staff: StaffScheduleType) => {
    if (!staff.isSubstitute || !staff.substituteEndDate) return false;
    return isPast(new Date(staff.substituteEndDate));
  };

  const handleAcceptAISuggestions = (suggestions: any[]) => {
    setStaffSchedules((prev) => {
      const updated = [...prev];
      suggestions.forEach((suggestion) => {
        const staffIndex = updated.findIndex(s => s.id === suggestion.staffId);
        if (staffIndex >= 0) {
          updated[staffIndex].schedules = suggestion.schedule;
        }
      });
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Personalschema</h1>
        </div>

        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="schedule">Schema</TabsTrigger>
            <TabsTrigger value="staffing">Inställningar</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setAddDialogOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t("staffSchedule.addStaff")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setImportDialogOpen(true)}>
                  <FileUp className="h-4 w-4 mr-2" />
                  {t("staffSchedule.importStaff")}
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => setAiDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI-förslag
                </Button>
              </div>
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
                        <th className="text-center px-2 py-1 w-[80px]">
                          <div className="text-xs text-muted-foreground">Åtgärder</div>
                        </th>
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
                        <tr 
                          key={staff.id} 
                          className={cn(
                            "border-b hover:bg-muted/30",
                            staff.isSubstitute && !isSubstituteExpired(staff) && "bg-yellow-50/50"
                          )}
                        >
                          <td className="px-2 py-1">
                            <div className="flex items-center gap-1">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-xs break-words">{staff.name}</span>
                                  {staff.isSubstitute && (
                                    <Badge variant="outline" className="text-[10px] px-1 py-0">
                                      Vikarie
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {staff.role}
                                  {staff.department && ` · ${staff.department}`}
                                </div>
                                {staff.isSubstitute && staff.substituteStartDate && staff.substituteEndDate && (
                                  <div className="text-[10px] text-muted-foreground mt-0.5">
                                    {format(new Date(staff.substituteStartDate), "dd MMM", { locale })} - {format(new Date(staff.substituteEndDate), "dd MMM", { locale })}
                                  </div>
                                )}
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
                          <td className="px-2 py-1">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleEditStaff(staff)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleDeleteClick(staff.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
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
          </TabsContent>

          <TabsContent value="staffing">
            <ScheduleSettings />
          </TabsContent>
        </Tabs>

        <AddStaffDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onAdd={handleAddStaff}
        />

        <EditStaffDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          staff={selectedStaffForEdit}
          onSave={handleSaveEdit}
        />

        <ImportStaffDialog
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
          onImport={handleImportStaff}
        />

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

        <AIScheduleSuggestionDialog
          open={aiDialogOpen}
          onOpenChange={setAiDialogOpen}
          weekStart={weekStart}
          childCounts={{}}
          staffList={filteredStaff}
          staffingRatios={[]}
          currentSchedules={staffSchedules}
          onAcceptSuggestions={handleAcceptAISuggestions}
        />

        <AIScheduleSuggestionDialog
          open={aiDialogOpen}
          onOpenChange={setAiDialogOpen}
          weekStart={weekStart}
          childCounts={{}}
          staffList={filteredStaff}
          staffingRatios={getStaffingRatios()}
          currentSchedules={staffSchedules}
          onAcceptSuggestions={handleAcceptAISuggestions}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("staffSchedule.deleteStaff")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("staffSchedule.confirmDelete", { 
                  name: staffSchedules.find(s => s.id === selectedStaffForDelete)?.name 
                })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>
                {t("common.delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
