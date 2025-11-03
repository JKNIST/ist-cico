import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, X, Users } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const departments = ["Blåbär", "Lingon", "Odon", "Vildhallon", "Gråsparven", "laser kittens", "örg"];

export function AddEventDialog({ open, onOpenChange }: AddEventDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shareWithGuardians, setShareWithGuardians] = useState(true);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(["Blåbär", "Lingon", "Odon", "Vildhallon", "Gråsparven", "laser kittens", "örg"]);
  const [participants, setParticipants] = useState("35");
  const [allDay, setAllDay] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date(2025, 10, 3));
  const [endDate, setEndDate] = useState<Date>(new Date(2025, 10, 3));
  const [startTime, setStartTime] = useState("14:30");
  const [endTime, setEndTime] = useState("15:00");
  const [isRecurring, setIsRecurring] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  const toggleDepartment = (dept: string) => {
    setSelectedDepartments(prev =>
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  const removeDepartment = (dept: string) => {
    setSelectedDepartments(prev => prev.filter(d => d !== dept));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log({
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
      isRecurring
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Lägg till händelse</DialogTitle>
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
          <div className="flex items-center gap-3">
            <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
            <Label>Är händelsen återkommande?</Label>
          </div>
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
