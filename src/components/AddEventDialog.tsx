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
      toast.error(t("toast.mustAcknowledgeConflicts"));
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
        t("toast.eventsCreatedSkipped", {
          created: eventsCreated,
          skipped: conflicts.conflictingInstances
        })
      );
    } else {
      toast.success(t("toast.eventSaved"));
    }

    onOpenChange(false);
  };

  // === Material-style helper-klasser ===
  // Outlined input med floating label
  const floatField =
    "peer w-full border border-gray-300 rounded-sm px-3 pt-4 pb-1.5 text-sm bg-transparent " +
    "focus:outline-none focus:border-[#2a9d8f] focus:border-2 placeholder-transparent";
  const floatLabel =
    "absolute left-2 -top-2 px-1 bg-white text-xs text-gray-600 " +
    "peer-focus:text-[#2a9d8f] peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm " +
    "peer-placeholder-shown:text-gray-500 transition-all";

  // Underline-style för datum/tid
  const underlineRow =
    "flex items-center gap-2 border-b border-gray-300 py-1 focus-within:border-[#2a9d8f]";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-gray-800">
            {mode === "edit" ? "Redigera händelse" : "Lägg till händelse"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Titel */}
          <div className="relative pt-2">
            <input
              id="event-title"
              type="text"
              placeholder="Titel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={floatField}
            />
            <label htmlFor="event-title" className={floatLabel}>
              Titel <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Beskrivning */}
          <div className="relative pt-2">
            <textarea
              id="event-description"
              placeholder="Beskrivning"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={cn(floatField, "min-h-[60px] resize-y")}
            />
            <label htmlFor="event-description" className={floatLabel}>
              Beskrivning <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Dela med vårdnadshavare */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Switch
                checked={isSharedWithGuardians}
                onCheckedChange={(checked) =>
                  setCategory(checked ? EventCategory.EXTERNAL : EventCategory.INTERNAL)
                }
                className="data-[state=checked]:bg-[#2a9d8f]"
              />
              <Label className="text-sm text-gray-800 font-normal">Dela med vårdnadshavare</Label>
            </div>
            <p className="text-[11px] text-gray-500 pl-12">
              När denna händelse är aktiverad kommer den vara synlig för vårdnadshavare du måste välja barn
            </p>
          </div>

          {/* Välj avdelningar */}
          <div className="relative pt-2">
            <div className="border border-gray-300 rounded-sm px-2 pt-3 pb-1.5 min-h-[44px] flex flex-wrap items-center gap-1.5 focus-within:border-[#2a9d8f]">
              {selectedDepartments.map((dept) => (
                <span
                  key={dept}
                  className="inline-flex items-center gap-1 border border-gray-300 rounded-full px-2.5 py-0.5 text-xs text-gray-700 bg-white"
                >
                  {dept}
                  <button
                    type="button"
                    onClick={() => removeDepartment(dept)}
                    className="rounded-full bg-gray-300 text-white hover:bg-gray-400 w-3.5 h-3.5 flex items-center justify-center"
                    aria-label={`Ta bort ${dept}`}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                className="ml-auto text-gray-400 hover:text-gray-600 px-1"
                aria-label="Öppna avdelningsväljare"
              >
                ▾
              </button>
            </div>
            <label className="absolute left-2 -top-0 px-1 bg-white text-xs text-gray-600">
              Välj avdelningar <span className="text-red-500">*</span>
            </label>
            {showDepartmentDropdown && (
              <div className="absolute z-50 mt-1 bg-white border rounded-md shadow-lg p-2 w-64">
                {departments.map((dept) => (
                  <div
                    key={dept}
                    onClick={() => toggleDepartment(dept)}
                    className={cn(
                      "px-3 py-2 cursor-pointer hover:bg-gray-100 rounded text-sm",
                      selectedDepartments.includes(dept) && "bg-gray-100"
                    )}
                  >
                    {dept}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Välj deltagare */}
          <div className="relative pt-2">
            <div className="border border-gray-300 rounded-sm px-2 pt-3 pb-1.5 min-h-[44px] flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 border border-gray-300 rounded-full px-2.5 py-0.5 text-xs text-gray-700 bg-white">
                <Users className="h-3 w-3 text-[#2a9d8f]" />
                {participants} personer
              </span>
              <span className="ml-auto text-gray-400">▾</span>
            </div>
            <label className="absolute left-2 -top-0 px-1 bg-white text-xs text-gray-600">
              Välj deltagare <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Heldag */}
          <div className="flex items-center gap-3">
            <Switch
              checked={allDay}
              onCheckedChange={setAllDay}
              className="data-[state=checked]:bg-[#2a9d8f]"
            />
            <Label className="text-sm text-gray-800 font-normal">Heldag</Label>
          </div>

          {/* Händelsedatum (underline-stil) */}
          <div>
            <p className="text-[11px] text-gray-500 mb-0.5">Händelsedatum <span className="text-red-500">*</span></p>
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className={cn(underlineRow, "w-full text-left text-sm text-gray-800")}>
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <span>{format(startDate, "d MMM yyyy", { locale })}</span>
                </button>
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

          {/* Tid (side-by-side, underline) */}
          {!allDay && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[11px] text-gray-500 mb-0.5">Starttid <span className="text-red-500">*</span></p>
                <div className={underlineRow}>
                  <Clock className="h-4 w-4 text-gray-500" />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-0.5">Sluttid <span className="text-red-500">*</span></p>
                <div className={underlineRow}>
                  <Clock className="h-4 w-4 text-gray-500" />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

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

          {/* Återkommande */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Switch
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
                disabled={mode === "edit" && editScope === "single"}
                className="data-[state=checked]:bg-[#2a9d8f]"
              />
              <Label className={cn("text-sm font-normal", mode === "edit" && editScope === "single" ? "text-muted-foreground" : "text-gray-800")}>
                Är händelsen återkommande?
              </Label>
            </div>

            {isRecurring && (
              <div className="space-y-3">
                {/* Upprepa */}
                <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                  <Label className="text-sm text-gray-600">Upprepa <span className="text-red-500">*</span></Label>
                  <Select value={recurrenceFrequency} onValueChange={setRecurrenceFrequency}>
                    <SelectTrigger className="w-full border-0 border-b border-gray-300 rounded-none focus:ring-0 focus:border-[#2a9d8f] h-8 px-0 text-sm">
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
                <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                  <Label className="text-sm text-gray-600">Varje <span className="text-red-500">*</span></Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={recurrenceInterval}
                      onChange={(e) => setRecurrenceInterval(e.target.value)}
                      className="w-20 h-8 border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#2a9d8f]"
                    />
                    <span className="text-sm text-gray-700">dag(ar)</span>
                  </div>
                </div>

                {/* Veckodagar (om weekly) */}
                {recurrenceFrequency === "weekly" && (
                  <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                    <Label className="text-sm text-gray-600">Dagar</Label>
                    <div className="flex gap-2">
                      {[
                        { value: "mon", label: "M" },
                        { value: "tue", label: "T" },
                        { value: "wed", label: "O" },
                        { value: "thu", label: "T" },
                        { value: "fri", label: "F" },
                      ].map((day) => (
                        <Button
                          key={day.value}
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-8 h-8 p-0 rounded-full text-xs",
                            selectedWeekDays.includes(day.value) && "bg-[#2a9d8f] text-white border-0 hover:bg-[#238276]"
                          )}
                          onClick={() => toggleWeekDay(day.value)}
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Till */}
                <div className="grid grid-cols-[80px_1fr] items-start gap-2">
                  <Label className="text-sm text-gray-600 pt-1">Till <span className="text-red-500">*</span></Label>
                  <div>
                    <p className="text-[11px] text-gray-500 mb-0.5">Slutdatum för återkommande händelse <span className="text-red-500">*</span></p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button type="button" className={cn(underlineRow, "w-full text-left text-sm text-gray-800")}>
                          <CalendarIcon className="h-4 w-4 text-gray-500" />
                          <span>{recurrenceEndDate ? format(recurrenceEndDate, "d MMM yyyy", { locale }) : "Välj datum"}</span>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={recurrenceEndDate}
                          onSelect={(date) => {
                            if (date) {
                              setRecurrenceEndDate(date);
                              setHasRecurrenceEndDate(true);
                            }
                          }}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer-metadata */}
          {mode === "edit" && eventData?.createdBy && eventData?.createdAt && (
            <div className="pt-2 text-xs text-gray-500 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>Skapad av : {eventData.createdBy} vid {format(eventData.createdAt, "yyyy-MM-dd HH:mm", { locale })}</span>
            </div>
          )}
        </div>

        {/* Action-knappar — text-only, uppercase */}
        <div className="flex justify-end items-center gap-6 pt-2">
          {mode === "edit" && (
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-sm font-medium uppercase tracking-wide text-red-500 hover:text-red-600"
            >
              Ta bort
            </button>
          )}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-sm font-medium uppercase tracking-wide text-[#2a9d8f] hover:text-[#238276]"
          >
            Avbryt
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={conflicts?.hasConflicts && conflictResolution === "include-all" && !acknowledgeConflicts}
            className="text-sm font-medium uppercase tracking-wide text-gray-400 hover:text-[#2a9d8f] disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            {mode === "edit" ? "Uppdatera" : "Spara"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
