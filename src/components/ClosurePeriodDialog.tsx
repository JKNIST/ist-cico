import { useState, useEffect } from "react";
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

interface ClosurePeriod {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  departments: string[];
  publishDate: Date;
  isArchived: boolean;
}

interface ClosurePeriodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period: ClosurePeriod | null;
  onSave: (period: ClosurePeriod) => void;
}

const departments = ["Gräsparven", "laser kittens", "örg", "Blåbär", "Lingon"];

export function ClosurePeriodDialog({
  open,
  onOpenChange,
  period,
  onSave,
}: ClosurePeriodDialogProps) {
  const [title, setTitle] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [publishDate, setPublishDate] = useState<Date>();

  useEffect(() => {
    if (period) {
      setTitle(period.title);
      setSelectedDepartments(period.departments);
      setStartDate(period.startDate);
      setEndDate(period.endDate);
      setPublishDate(period.publishDate);
    } else {
      setTitle("");
      setSelectedDepartments([]);
      setStartDate(undefined);
      setEndDate(undefined);
      setPublishDate(undefined);
    }
  }, [period, open]);

  const handleSave = () => {
    if (!title || !startDate || !publishDate) return;

    onSave({
      id: period?.id || "",
      title,
      startDate,
      endDate: endDate || startDate,
      departments: selectedDepartments,
      publishDate,
      isArchived: period?.isArchived || false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {period ? "Uppdatera stängningsperiod" : "Skapa stängningsperiod"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Titel</Label>
              <span className="text-xs text-muted-foreground">
                {title.length} / 50
              </span>
            </div>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 50))}
              placeholder="T.ex. Planeringsdag"
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

          <div className="space-y-3">
            <Label>Stängningsperiod</Label>
            <p className="text-xs text-muted-foreground">
              Välj start- och slutdatum för stängningsperioden
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Från</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      {startDate ? format(startDate, "dd MMM yyyy", { locale: sv }) : "Välj datum"}
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
                <Label className="text-xs">Till</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      {endDate ? format(endDate, "dd MMM yyyy", { locale: sv }) : "Välj datum"}
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
          </div>

          <div className="space-y-3">
            <Label>Publicering</Label>
            <p className="text-xs text-muted-foreground">
              När vårdnadshavare ska notifieras om stängningen
            </p>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  {publishDate ? format(publishDate, "dd MMM yyyy", { locale: sv }) : "Välj datum"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={publishDate}
                  onSelect={setPublishDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            {period ? "Uppdatera" : "Spara"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
