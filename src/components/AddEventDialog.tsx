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
import { CalendarIcon, Clock, X, Users } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "edit";
  eventData?: {
    id?: string;
    title?: string;
    description?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    isAllDay?: boolean;
    shareWithGuardians?: boolean;
    departments?: string[];
    participants?: string;
    isRecurring?: boolean;
    recurrenceRule?: {
      frequency: string;
      interval: number;
      endDate?: Date;
      selectedDays?: string[];
    };
    createdBy?: string;
    createdAt?: Date;
    updatedBy?: string;
    updatedAt?: Date;
  };
  editScope?: "single" | "future" | "all";
}

const departments = ["Blåbär", "Lingon", "Odon", "Vildhallon", "Gråsparven", "laser kittens", "örg"];

export function AddEventDialog({ open, onOpenChange, mode = "add", eventData, editScope }: AddEventDialogProps) {
  const [title, setTitle] = useState(eventData?.title || "");
  const [description, setDescription] = useState(eventData?.description || "");
  const [shareWithGuardians, setShareWithGuardians] = useState(eventData?.shareWithGuardians !== undefined ? eventData.shareWithGuardians : true);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(eventData?.departments || ["Blåbär", "Lingon", "Odon", "Vildhallon", "Gråsparven", "laser kittens", "örg"]);
  const [participants, setParticipants] = useState(eventData?.participants || "35");
  const [allDay, setAllDay] = useState(eventData?.isAllDay || false);
  const [startDate, setStartDate] = useState<Date>(eventData?.date || new Date(2025, 10, 3));
  const [endDate, setEndDate] = useState<Date>(eventData?.date || new Date(2025, 10, 3));
  const [startTime, setStartTime] = useState(eventData?.startTime || "14:30");
  const [endTime, setEndTime] = useState(eventData?.endTime || "15:00");
  const [isRecurring, setIsRecurring] = useState(editScope === "single" ? false : (eventData?.isRecurring || false));
  const [recurrenceFrequency, setRecurrenceFrequency] = useState(eventData?.recurrenceRule?.frequency || "");
  const [recurrenceInterval, setRecurrenceInterval] = useState(String(eventData?.recurrenceRule?.interval || 1));
  const [hasRecurrenceEndDate, setHasRecurrenceEndDate] = useState(!!eventData?.recurrenceRule?.endDate);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | undefined>(eventData?.recurrenceRule?.endDate);
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>(eventData?.recurrenceRule?.selectedDays || []);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  // Sync form state when dialog opens or eventData changes
  useEffect(() => {
    if (open && eventData) {
      setTitle(eventData.title || "");
      setDescription(eventData.description || "");
      setShareWithGuardians(eventData.shareWithGuardians !== undefined ? eventData.shareWithGuardians : true);
      setSelectedDepartments(eventData.departments || ["Blåbär", "Lingon", "Odon", "Vildhallon", "Gråsparven", "laser kittens", "örg"]);
      setParticipants(eventData.participants || "35");
      setAllDay(eventData.isAllDay || false);
      
      // Set dates based on eventData.date (which is already adjusted by Calendar.tsx based on editScope)
      if (eventData.date) {
        setStartDate(eventData.date);
        setEndDate(eventData.date);
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
      setTitle("");
      setDescription("");
      setShareWithGuardians(true);
      setSelectedDepartments(["Blåbär", "Lingon", "Odon", "Vildhallon", "Gråsparven", "laser kittens", "örg"]);
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
    // Handle save logic here
    console.log({
      mode,
      editScope,
      title,
      description,
      shareWithGuardians,
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
      recurrenceEndDate
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "edit" ? "Redigera händelse" : "Lägg till händelse"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Input
              placeholder="Titel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Textarea
              placeholder="Beskrivning"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px]"
            />
          </div>

          {/* Share with Guardians */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Switch
                checked={shareWithGuardians}
                onCheckedChange={setShareWithGuardians}
              />
              <Label className="font-semibold">Dela med vårdnadshavare</Label>
            </div>
            <p className="text-sm text-gray-600 ml-11">
              När denna händelse är aktiverad kommer den vara synlig för vårdnadshavare du måste välja barn
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
                    {format(startDate, "yyyy-MM-dd", { locale: sv })}
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
                    {format(endDate, "yyyy-MM-dd", { locale: sv })}
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

          {/* Recurring Event */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch 
                checked={isRecurring} 
                onCheckedChange={setIsRecurring}
                disabled={editScope === "single"}
              />
              <Label className={editScope === "single" ? "text-muted-foreground" : ""}>
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
                  <Label className="text-sm">Varje</Label>
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
                    <Label className="text-sm">Dagar</Label>
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
                          {recurrenceEndDate ? format(recurrenceEndDate, "yyyy-MM-dd", { locale: sv }) : "Välj datum"}
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
              <p>Skapad av: {eventData.createdBy} vid {format(eventData.createdAt, "yyyy-MM-dd HH:mm", { locale: sv })}</p>
              {eventData.updatedBy && eventData.updatedAt && (
                <p>Uppdaterad av: {eventData.updatedBy} vid {format(eventData.updatedAt, "yyyy-MM-dd HH:mm", { locale: sv })}</p>
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
            AVBRYT
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#2a9d8f] hover:bg-[#238276] text-white"
          >
            SPARA
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
