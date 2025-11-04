import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TemporarySchemaPeriod {
  id: string;
  title: string;
  createdBy: string;
  startDate: Date;
  endDate: Date;
  departments: string[];
  activateDate: Date;
  deadline: Date;
  submitted: number;
  remaining: number;
  limitedCapacityDays: Date[];
}

interface TemporarySchemaPeriodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period: TemporarySchemaPeriod | null;
  onSave: (period: TemporarySchemaPeriod) => void;
}

const departments = ["Gräsparven", "laser kittens", "örg", "Blåbär", "Lingon"];

export function TemporarySchemaPeriodDialog({
  open,
  onOpenChange,
  period,
  onSave,
}: TemporarySchemaPeriodDialogProps) {
  const [title, setTitle] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [activateDate, setActivateDate] = useState<Date>();
  const [deadline, setDeadline] = useState<Date>();
  const [limitedCapacityDays, setLimitedCapacityDays] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState(period?.startDate || new Date());

  useEffect(() => {
    if (period) {
      setTitle(period.title);
      setSelectedDepartments(period.departments);
      setStartDate(period.startDate);
      setEndDate(period.endDate);
      setActivateDate(period.activateDate);
      setDeadline(period.deadline);
      setLimitedCapacityDays(period.limitedCapacityDays);
      setCurrentMonth(period.startDate); // Show calendar for the period's start month
    } else {
      setTitle("");
      setSelectedDepartments([]);
      setStartDate(undefined);
      setEndDate(undefined);
      setActivateDate(undefined);
      setDeadline(undefined);
      setLimitedCapacityDays([]);
      setCurrentMonth(new Date()); // Reset to current month for new periods
    }
  }, [period, open]);

  const handleSave = () => {
    if (!title || !startDate || !endDate || !activateDate || !deadline) return;

    onSave({
      id: period?.id || "",
      title,
      createdBy: period?.createdBy || "Beatrice Olofson",
      startDate,
      endDate,
      departments: selectedDepartments,
      activateDate,
      deadline,
      submitted: period?.submitted || 0,
      remaining: period?.remaining || 29,
      limitedCapacityDays,
    });
  };

  const toggleDay = (day: Date) => {
    const isSelected = limitedCapacityDays.some(
      (d) => d.toDateString() === day.toDateString()
    );

    if (isSelected) {
      setLimitedCapacityDays(
        limitedCapacityDays.filter((d) => d.toDateString() !== day.toDateString())
      );
    } else {
      setLimitedCapacityDays([...limitedCapacityDays, day]);
    }
  };

  const isDaySelected = (day: Date) => {
    return limitedCapacityDays.some((d) => d.toDateString() === day.toDateString());
  };

  const renderCalendarGrid = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days = [];
    for (let i = 0; i < adjustedStart; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = isDaySelected(date);

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => toggleDay(date)}
          className={cn(
            "h-10 w-10 rounded-md text-sm font-medium transition-colors hover:bg-accent",
            isSelected && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {period ? "Redigera temporär schemaperiod" : "Skapa temporär schemaperiod"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="T.ex. Jul & Nyår 25/26"
            />
          </div>

          <div className="space-y-2">
            <Label>Välj avdelningar</Label>
            <Select
              value={selectedDepartments[0]}
              onValueChange={(value) => {
                if (!selectedDepartments.includes(value)) {
                  setSelectedDepartments([...selectedDepartments, value]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Välj avdelningar">
                  {selectedDepartments.length > 0
                    ? selectedDepartments.join(", ")
                    : "Välj avdelningar"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Schemaperiod - Från</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    {startDate ? format(startDate, "PPP", { locale: sv }) : "Välj datum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Schemaperiod - Till</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    {endDate ? format(endDate, "PPP", { locale: sv }) : "Välj datum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Aktivera</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    {activateDate
                      ? format(activateDate, "PPP", { locale: sv })
                      : "Välj datum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={activateDate}
                    onSelect={setActivateDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    {deadline ? format(deadline, "PPP", { locale: sv }) : "Välj datum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Dagar med begränsad kapacitet</Label>
              <span className="text-sm text-muted-foreground">
                {limitedCapacityDays.length} vald{limitedCapacityDays.length !== 1 ? "a" : ""}
              </span>
            </div>

            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={previousMonth}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  {format(currentMonth, "MMMM yyyy", { locale: sv })}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={nextMonth}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {["M", "T", "O", "T", "F", "L", "S"].map((day) => (
                  <div
                    key={day}
                    className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
                {renderCalendarGrid()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Spara
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
