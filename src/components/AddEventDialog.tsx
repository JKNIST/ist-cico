import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, Clock, X, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarEvent, EventCategory, ClosurePeriod, TemporarySchemaPeriod } from "@/types/administration";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/useLocale";
import { CalendarGroupSelector } from "./calendar/CalendarGroupSelector";
import { validateEventConflicts, ValidationResult } from "@/lib/eventConflictValidation";
import { EventConflictWarning } from "./calendar/EventConflictWarning";
import { toast } from "sonner";

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "edit";
  eventData?: CalendarEvent;
  editScope?: "single" | "future" | "all";
  closurePeriods: ClosurePeriod[];
  temporaryPeriods: TemporarySchemaPeriod[];
}

const departments = ["Blåbär", "Lingon", "Odon", "Vildhallon", "Gråsparven", "laser kittens", "örg"];

export function AddEventDialog({ 
  open, 
  onOpenChange, 
  mode = "add", 
  eventData, 
  editScope,
  closurePeriods,
  temporaryPeriods 
}: AddEventDialogProps) {
  const { t } = useTranslation();
  const locale = useLocale();
  const [category, setCategory] = useState<EventCategory>(eventData?.category || EventCategory.EXTERNAL);
  const [title, setTitle] = useState(eventData?.title || "");
  const [description, setDescription] = useState(eventData?.description || "");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(eventData?.departments || ["Blåbär", "Lingon", "Odon", "Vildhallon", "Gråsparven", "laser kittens", "örg"]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>(eventData?.groups || []);
  const [participants, setParticipants] = useState(eventData?.participants || "35");
  const [allDay, setAllDay] = useState(eventData?.allDay || false);
  const [startDate, setStartDate] = useState<Date>(eventData?.date || new Date(2025, 10, 3));
  const [endDate, setEndDate] = useState<Date>(eventData?.endDate || eventData?.date || new Date(2025, 10, 3));
  const [startTime, setStartTime] = useState(eventData?.startTime || "14:30");
  const [endTime, setEndTime] = useState(eventData?.endTime || "15:00");
  const [isRecurring, setIsRecurring] = useState(editScope === "single" ? false : (eventData?.isRecurring || false));
  const [recurrenceFrequency, setRecurrenceFrequency] = useState(eventData?.recurrenceRule?.frequency || "");
  const [recurrenceInterval, setRecurrenceInterval] = useState(String(eventData?.recurrenceRule?.interval || 1));
  const [hasRecurrenceEndDate, setHasRecurrenceEndDate] = useState(!!eventData?.recurrenceRule?.endDate);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | undefined>(eventData?.recurrenceRule?.endDate);
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>(eventData?.recurrenceRule?.selectedDays || []);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  
  // Conflict validation state
  const [conflicts, setConflicts] = useState<ValidationResult | null>(null);
  const [conflictResolution, setConflictResolution] = useState<"include-all" | "skip-conflicts">("skip-conflicts");
  const [acknowledgeConflicts, setAcknowledgeConflicts] = useState(false);

  // Automatically set isSharedWithGuardians based on category
  const isSharedWithGuardians = category === EventCategory.EXTERNAL || category === EventCategory.CLOSURE || category === EventCategory.WARNING;

  // Validate conflicts when event data changes
  useEffect(() => {
    if (!open || !startDate) {
      setConflicts(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      const result = validateEventConflicts(
        {
          startDate,
          endDate,
          isRecurring,
          recurrenceRule: isRecurring
            ? {
                frequency: recurrenceFrequency,
                interval: parseInt(recurrenceInterval) || 1,
                endDate: hasRecurrenceEndDate ? recurrenceEndDate : undefined,
                selectedDays: recurrenceFrequency === "weekly" ? selectedWeekDays : undefined,
              }
            : undefined,
        },
        closurePeriods,
        temporaryPeriods
      );
      setConflicts(result);
      
      // Reset conflict resolution state when conflicts change
      if (!result.hasConflicts) {
        setConflictResolution("skip-conflicts");
        setAcknowledgeConflicts(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [
    open,
    startDate,
    endDate,
    isRecurring,
    recurrenceFrequency,
    recurrenceInterval,
    hasRecurrenceEndDate,
    recurrenceEndDate,
    selectedWeekDays,
    closurePeriods,
    temporaryPeriods,
  ]);

  // Sync form state when dialog opens or eventData changes
  useEffect(() => {
    if (open && eventData) {
      setCategory(eventData.category || EventCategory.EXTERNAL);
      setTitle(eventData.title || "");
      setDescription(eventData.description || "");
      setSelectedDepartments(eventData.departments || ["Blåbär", "Lingon", "Odon", "Vildhallon", "Gråsparven", "laser kittens", "örg"]);
      setSelectedGroups(eventData.groups || []);
      setParticipants(eventData.participants || "35");
      setAllDay(eventData.allDay || false);
      
      // Set dates based on eventData.date (which is already adjusted by Calendar.tsx based on editScope)
      if (eventData.date) {
        setStartDate(eventData.date);
        setEndDate(eventData.endDate || eventData.date);
      }
      
      setStartTime(eventData.startTime || "14:30");
      setEndTime(eventData.endTime || "15:00");
      
      // Set isRecurring to false for single instance edits
      setIsRecurring(editScope === "single" ? false : (eventData.isRecurring || false));
      
      setRecurrenceFrequency(eventData.recurrenceRule?.frequency || "");
      setRecurrenceInterval(String(eventData.recurrenceRule?.interval || 1));
      setHasRecurrenceEndDate(!!eventData.recurrenceRule?.endDate);
      setRecurrenceEndDate(eventData.recurrenceRule?.endDate);
      setSelectedWeekDays(eventData.recurrenceRule?.selectedDays || []);
    } else if (open && !eventData) {
      // Reset to defaults for new event
      setCategory(EventCategory.EXTERNAL);
      setTitle("");
      setDescription("");
      setSelectedDepartments(["Blåbär", "Lingon", "Odon", "Vildhallon", "Gråsparven", "laser kittens", "örg"]);
      setSelectedGroups([]);
      setParticipants("35");
      setAllDay(false);
      setStartDate(new Date(2025, 10, 3));
      setEndDate(new Date(2025, 10, 3));
      setStartTime("14:30");
      setEndTime("15:00");
      setIsRecurring(false);
      setRecurrenceFrequency("");
      setRecurrenceInterval("1");
      setHasRecurrenceEndDate(false);
      setRecurrenceEndDate(undefined);
      setSelectedWeekDays([]);
    }
  }, [open, eventData, editScope]);

  const toggleDepartment = (dept: string) => {
    setSelectedDepartments(prev =>
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  const removeDepartment = (dept: string) => {
    setSelectedDepartments(prev => prev.filter(d => d !== dept));
  };

  const toggleWeekDay = (day: string) => {
    setSelectedWeekDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    // Validate conflict resolution
    if (conflicts?.hasConflicts && conflictResolution === "include-all" && !acknowledgeConflicts) {
      toast.error("Du måste bekräfta att du förstår att eventet krockar innan du kan spara");
      return;
    }

    // Calculate excluded dates if skipping conflicts
    const excludedDates = 
      conflicts?.hasConflicts && conflictResolution === "skip-conflicts"
        ? conflicts.conflicts.map(c => c.date)
        : undefined;

    // Handle save logic here
    console.log({
      mode,
      editScope,
      category,
      title,
      description,
      isSharedWithGuardians,
      selectedDepartments,
      participants,
      allDay,
      startDate,
      endDate,
      startTime,
      endTime,
      isRecurring,
      recurrenceFrequency,
      recurrenceInterval,
      selectedWeekDays,
      recurrenceEndDate,
      excludedDates,
      conflictResolution,
    });

    // Show toast with save summary
    if (conflicts?.hasConflicts && conflictResolution === "skip-conflicts") {
      const eventsCreated = conflicts.totalInstances - conflicts.conflictingInstances;
      toast.success(
        `${eventsCreated} händelser skapade, ${conflicts.conflictingInstances} händelser hoppades över`
      );
    } else {
      toast.success("Event sparat");
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "edit" ? t('eventDialog.editEvent') : t('eventDialog.addEvent')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">{t('eventDialog.category')}</Label>
            <RadioGroup value={category} onValueChange={(value) => setCategory(value as EventCategory)}>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={EventCategory.EXTERNAL} id="external" />
                <Label htmlFor="external" className="flex items-center gap-2 cursor-pointer flex-1">
                  <div className="w-3 h-3 rounded bg-green-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{t('eventDialog.externalActivity')}</div>
                    <div className="text-xs text-muted-foreground">{t('eventDialog.sharedWithGuardians')}</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={EventCategory.INTERNAL} id="internal" />
                <Label htmlFor="internal" className="flex items-center gap-2 cursor-pointer flex-1">
                  <div className="w-3 h-3 rounded bg-blue-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{t('eventDialog.internalActivity')}</div>
                    <div className="text-xs text-muted-foreground">{t('eventDialog.staffOnly')}</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Input
              placeholder={t('eventDialog.title')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Textarea
              placeholder={t('eventDialog.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px]"
            />
          </div>

          {/* Info about sharing (read-only based on category) */}
          <div className="bg-gray-50 border rounded-lg p-3">
            <p className="text-sm text-gray-700">
              {isSharedWithGuardians ? (
                <span className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">✓</span>
                  Denna aktivitet kommer att delas med vårdnadshavare
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="text-blue-600 font-medium">🔒</span>
                  Denna aktivitet är endast synlig för personal
                </span>
              )}
            </p>
          </div>

          {/* Select Departments */}
          <div className="space-y-2">
            <Label className="text-sm">Välj avdelningar</Label>
            <div className="border rounded-md p-2 min-h-[48px]">
              <div className="flex flex-wrap gap-2">
                {selectedDepartments.map((dept) => (
                  <div
                    key={dept}
                    className="bg-[#2a9d8f] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {dept}
                    <button
                      onClick={() => removeDepartment(dept)}
                      className="hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                className="text-sm text-[#2a9d8f] hover:underline"
              >
                Lägg till avdelning
              </button>
              {showDepartmentDropdown && (
                <div className="absolute z-50 mt-1 bg-white border rounded-md shadow-lg p-2 w-64">
                  {departments.map((dept) => (
                    <div
                      key={dept}
                      onClick={() => toggleDepartment(dept)}
                      className={cn(
                        "px-3 py-2 cursor-pointer hover:bg-gray-100 rounded",
                        selectedDepartments.includes(dept) && "bg-gray-100"
                      )}
                    >
                      {dept}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Select Groups */}
          <CalendarGroupSelector
            selectedDepartments={selectedDepartments}
            selectedGroups={selectedGroups}
            onGroupsChange={setSelectedGroups}
          />

          {/* Select Participants */}
          <div className="space-y-2">
            <Label className="text-sm">Välj deltagare</Label>
            <div className="border rounded-md p-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-[#2a9d8f]" />
              <span className="text-sm">{participants} personer</span>
            </div>
          </div>

          {/* All Day */}
          <div className="flex items-center gap-3">
            <Switch checked={allDay} onCheckedChange={setAllDay} />
            <Label>Heldag</Label>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label className="text-sm">Startdatum</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, "yyyy-MM-dd", { locale })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label className="text-sm">Slutdatum</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, "yyyy-MM-dd", { locale })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Start Time */}
            {!allDay && (
              <div className="space-y-2">
                <Label className="text-sm">Starttid</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {/* End Time */}
            {!allDay && (
              <div className="space-y-2">
                <Label className="text-sm">Sluttid</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Conflict Warning */}
          {conflicts?.hasConflicts && (
            <EventConflictWarning
              conflicts={conflicts}
              resolution={conflictResolution}
              acknowledgeConflicts={acknowledgeConflicts}
              onResolutionChange={setConflictResolution}
              onAcknowledgeChange={setAcknowledgeConflicts}
            />
          )}

          {/* Recurring Event */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch 
                checked={isRecurring} 
                onCheckedChange={setIsRecurring}
                disabled={mode === "edit" && editScope === "single"}
              />
              <Label className={mode === "edit" && editScope === "single" ? "text-muted-foreground" : ""}>
                Är händelsen återkommande?
              </Label>
            </div>

            {/* Recurring Event Options */}
            {isRecurring && (
              <div className="space-y-4 pl-11">
                {/* Upprepa */}
                <div className="space-y-2">
                  <Label className="text-sm">Upprepa</Label>
                  <Select value={recurrenceFrequency} onValueChange={setRecurrenceFrequency}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Välj frekvens" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Dagligen</SelectItem>
                      <SelectItem value="weekly">Veckovis</SelectItem>
                      <SelectItem value="monthly">Månadsvis</SelectItem>
                      <SelectItem value="yearly">Årligen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Varje */}
                <div className="space-y-2">
                  <Label className="text-sm">{t('eventDialog.every')}</Label>
                  <Input
                    type="number"
                    min="1"
                    value={recurrenceInterval}
                    onChange={(e) => setRecurrenceInterval(e.target.value)}
                    className="w-32"
                  />
                </div>

                {/* Week Days Selection for Weekly */}
                {recurrenceFrequency === "weekly" && (
                  <div className="space-y-2">
                    <Label className="text-sm">{t('eventDialog.days')}</Label>
                    <div className="flex gap-2">
                      {[
                        { value: "mon", label: t('eventDialog.shortWeekdays.mon') },
                        { value: "tue", label: t('eventDialog.shortWeekdays.tue') },
                        { value: "wed", label: t('eventDialog.shortWeekdays.wed') },
                        { value: "thu", label: t('eventDialog.shortWeekdays.thu') },
                        { value: "fri", label: t('eventDialog.shortWeekdays.fri') },
                      ].map((day) => (
                        <Button
                          key={day.value}
                          type="button"
                          variant={selectedWeekDays.includes(day.value) ? "default" : "outline"}
                          className={`w-10 h-10 p-0 ${
                            selectedWeekDays.includes(day.value) 
                              ? "bg-[#2a9d8f] hover:bg-[#238276]" 
                              : ""
                          }`}
                          onClick={() => toggleWeekDay(day.value)}
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Till */}
                <div className="space-y-2">
                  <Label className="text-sm">Till</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={hasRecurrenceEndDate}
                      onCheckedChange={(checked) => setHasRecurrenceEndDate(checked as boolean)}
                    />
                    <Label className="font-normal cursor-pointer">
                      Slutdatum för återkommande händelse
                    </Label>
                  </div>
                  {hasRecurrenceEndDate && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal mt-2"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {recurrenceEndDate ? format(recurrenceEndDate, "yyyy-MM-dd", { locale }) : t('eventDialog.onDate')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={recurrenceEndDate}
                          onSelect={(date) => date && setRecurrenceEndDate(date)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Metadata for Edit Mode */}
          {mode === "edit" && eventData?.createdBy && eventData?.createdAt && (
            <div className="pt-4 border-t space-y-1 text-xs text-muted-foreground">
              <p>{t('eventDialog.createdBy')}: {eventData.createdBy} {t('eventDialog.at')} {format(eventData.createdAt, "yyyy-MM-dd HH:mm", { locale })}</p>
              {eventData.updatedAt && (
                <p>{t('eventDialog.lastUpdated')}: {format(eventData.updatedAt, "yyyy-MM-dd HH:mm", { locale })}</p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-[#2a9d8f] hover:bg-[#2a9d8f]/10"
          >
            {t('eventDialog.cancel')}
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#2a9d8f] hover:bg-[#238276] text-white"
            disabled={conflicts?.hasConflicts && conflictResolution === "include-all" && !acknowledgeConflicts}
          >
            {t('eventDialog.save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
