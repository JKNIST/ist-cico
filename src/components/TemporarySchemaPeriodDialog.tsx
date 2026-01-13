import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/useLocale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PeriodConflictWarning } from "@/components/administration/PeriodConflictWarning";
import {
  validateTemporaryPeriodConflicts,
  PeriodValidationResult,
} from "@/lib/periodConflictValidation";
import type { CalendarEvent } from "@/types/administration";

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
  existingEvents?: CalendarEvent[];
}

const AVAILABLE_DEPARTMENTS = ["Småbarnsavdelningen", "Mellanbarnsavdelningen", "Storbarnsavdelningen"];

export function TemporarySchemaPeriodDialog({
  open,
  onOpenChange,
  period,
  onSave,
  existingEvents = [],
}: TemporarySchemaPeriodDialogProps) {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  
  const isEditing = period !== null;
  
  const [formData, setFormData] = useState<TemporarySchemaPeriod>({
    id: "",
    title: "",
    createdBy: "Nuvarande användare",
    startDate: new Date(),
    endDate: new Date(),
    departments: [],
    activateDate: new Date(),
    deadline: new Date(),
    submitted: 0,
    remaining: 0,
    limitedCapacityDays: [],
  });

  // Conflict state
  const [conflicts, setConflicts] = useState<PeriodValidationResult | null>(null);
  const [acknowledgeConflicts, setAcknowledgeConflicts] = useState(false);

  // Reset form when dialog opens/closes or period changes
  useEffect(() => {
    if (open) {
      if (period) {
        setFormData(period);
      } else {
        setFormData({
          id: crypto.randomUUID(),
          title: "",
          createdBy: "Nuvarande användare",
          startDate: new Date(),
          endDate: new Date(),
          departments: [],
          activateDate: new Date(),
          deadline: new Date(),
          submitted: 0,
          remaining: 0,
          limitedCapacityDays: [],
        });
      }
      // Reset conflict state
      setConflicts(null);
      setAcknowledgeConflicts(false);
    }
  }, [open, period]);

  // Real-time conflict validation with debounce for limited capacity days
  useEffect(() => {
    if (!open || formData.limitedCapacityDays.length === 0) {
      setConflicts(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      const result = validateTemporaryPeriodConflicts(
        formData.limitedCapacityDays,
        existingEvents
      );
      setConflicts(result);
      // Reset acknowledgment when conflicts change
      setAcknowledgeConflicts(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [open, formData.limitedCapacityDays, existingEvents]);

  const handleDepartmentToggle = (dept: string) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter(d => d !== dept)
        : [...prev.departments, dept]
    }));
  };

  const handleLimitedCapacityDaySelect = (date: Date | undefined) => {
    if (!date) return;
    
    // Check if date is already selected
    const isSelected = formData.limitedCapacityDays.some(
      d => format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
    
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        limitedCapacityDays: prev.limitedCapacityDays.filter(
          d => format(d, "yyyy-MM-dd") !== format(date, "yyyy-MM-dd")
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        limitedCapacityDays: [...prev.limitedCapacityDays, date].sort((a, b) => a.getTime() - b.getTime())
      }));
    }
  };

  const removeLimitedCapacityDay = (date: Date) => {
    setFormData(prev => ({
      ...prev,
      limitedCapacityDays: prev.limitedCapacityDays.filter(
        d => format(d, "yyyy-MM-dd") !== format(date, "yyyy-MM-dd")
      )
    }));
  };

  const handleNavigateToEvent = (eventId: string, date: Date) => {
    onOpenChange(false);
    const dateStr = format(date, "yyyy-MM-dd");
    navigate(`/calendar?date=${dateStr}&eventId=${eventId}&mode=edit`);
  };

  const handleSave = () => {
    if (!formData.title.trim() || formData.departments.length === 0) {
      return;
    }

    // Validate conflict acknowledgment
    if (conflicts?.hasConflicts && !acknowledgeConflicts) {
      toast.error(t("periodConflict.mustAcknowledge"));
      return;
    }

    onSave(formData);
    onOpenChange(false);
  };

  const isValid = formData.title.trim() && formData.departments.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing 
              ? t("temporaryPeriodDialog.editTitle") 
              : t("temporaryPeriodDialog.createTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t("temporaryPeriodDialog.titleLabel")} *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={t("temporaryPeriodDialog.titlePlaceholder")}
            />
          </div>

          {/* Departments */}
          <div className="space-y-2">
            <Label>{t("temporaryPeriodDialog.departmentsLabel")} *</Label>
            <div className="flex flex-wrap gap-3">
              {AVAILABLE_DEPARTMENTS.map((dept) => (
                <div key={dept} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dept-${dept}`}
                    checked={formData.departments.includes(dept)}
                    onCheckedChange={() => handleDepartmentToggle(dept)}
                  />
                  <label
                    htmlFor={`dept-${dept}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {dept}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Period Dates */}
          <div className="space-y-2">
            <Label>{t("temporaryPeriodDialog.schedulePeriod")}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{t("temporaryPeriodDialog.from")}</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "dd MMM yyyy", { locale }) : t("temporaryPeriodDialog.selectDate")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => date && setFormData(prev => ({ ...prev, startDate: date }))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{t("temporaryPeriodDialog.to")}</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "dd MMM yyyy", { locale }) : t("temporaryPeriodDialog.selectDate")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => date && setFormData(prev => ({ ...prev, endDate: date }))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Activation Date and Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("temporaryPeriodDialog.activationDate")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.activateDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.activateDate ? format(formData.activateDate, "dd MMM yyyy", { locale }) : t("temporaryPeriodDialog.selectDate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.activateDate}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, activateDate: date }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>{t("temporaryPeriodDialog.deadline")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deadline ? format(formData.deadline, "dd MMM yyyy", { locale }) : t("temporaryPeriodDialog.selectDate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.deadline}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, deadline: date }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Limited Capacity Days */}
          <div className="space-y-2">
            <Label>{t("temporaryPeriodDialog.limitedCapacityDays")}</Label>
            <p className="text-xs text-muted-foreground">{t("temporaryPeriodDialog.limitedCapacityDescription")}</p>
            
            {/* Selected days */}
            {formData.limitedCapacityDays.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-amber-50">
                {formData.limitedCapacityDays.map((day, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="flex items-center gap-1 bg-amber-100"
                  >
                    {format(day, "d MMM", { locale })}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeLimitedCapacityDay(day)}
                    />
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Calendar for selecting days */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {t("temporaryPeriodDialog.addLimitedDay")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={undefined}
                  onSelect={handleLimitedCapacityDaySelect}
                  modifiers={{
                    selected: formData.limitedCapacityDays
                  }}
                  modifiersStyles={{
                    selected: { backgroundColor: 'hsl(var(--amber-100))', color: 'hsl(var(--amber-900))' }
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Inline Conflict Warning */}
          {conflicts?.hasConflicts && (
            <PeriodConflictWarning
              conflicts={conflicts}
              acknowledgeConflicts={acknowledgeConflicts}
              onAcknowledgeChange={setAcknowledgeConflicts}
              onNavigateToEvent={handleNavigateToEvent}
            />
          )}
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("temporaryPeriodDialog.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {isEditing ? t("temporaryPeriodDialog.save") : t("temporaryPeriodDialog.create")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
