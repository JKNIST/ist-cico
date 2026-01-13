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
import { Calendar as CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/useLocale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PeriodConflictWarning } from "@/components/administration/PeriodConflictWarning";
import {
  validateClosurePeriodConflicts,
  PeriodValidationResult,
} from "@/lib/periodConflictValidation";
import type { CalendarEvent } from "@/types/administration";

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
  existingEvents?: CalendarEvent[];
}

const AVAILABLE_DEPARTMENTS = ["Småbarnsavdelningen", "Mellanbarnsavdelningen", "Storbarnsavdelningen"];

export function ClosurePeriodDialog({
  open,
  onOpenChange,
  period,
  onSave,
  existingEvents = [],
}: ClosurePeriodDialogProps) {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  
  const isEditing = period !== null;
  
  const [formData, setFormData] = useState<ClosurePeriod>({
    id: "",
    title: "",
    startDate: new Date(),
    endDate: new Date(),
    departments: [],
    publishDate: new Date(),
    isArchived: false,
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
          startDate: new Date(),
          endDate: new Date(),
          departments: [],
          publishDate: new Date(),
          isArchived: false,
        });
      }
      // Reset conflict state
      setConflicts(null);
      setAcknowledgeConflicts(false);
    }
  }, [open, period]);

  // Real-time conflict validation with debounce
  useEffect(() => {
    if (!open || !formData.startDate || !formData.endDate) {
      setConflicts(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      const result = validateClosurePeriodConflicts(
        formData.startDate,
        formData.endDate,
        existingEvents
      );
      setConflicts(result);
      // Reset acknowledgment when conflicts change
      setAcknowledgeConflicts(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [open, formData.startDate, formData.endDate, existingEvents]);

  const handleDepartmentToggle = (dept: string) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter(d => d !== dept)
        : [...prev.departments, dept]
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
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing 
              ? t("closurePeriodDialog.editTitle") 
              : t("closurePeriodDialog.createTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t("closurePeriodDialog.titleLabel")} *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={t("closurePeriodDialog.titlePlaceholder")}
            />
          </div>

          {/* Departments */}
          <div className="space-y-2">
            <Label>{t("closurePeriodDialog.departmentsLabel")} *</Label>
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

          {/* Closure Period Dates */}
          <div className="space-y-2">
            <Label>{t("closurePeriodDialog.closurePeriodLabel")}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{t("closurePeriodDialog.from")}</p>
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
                      {formData.startDate ? format(formData.startDate, "dd MMM yyyy", { locale }) : t("closurePeriodDialog.selectDate")}
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
                <p className="text-xs text-muted-foreground">{t("closurePeriodDialog.to")}</p>
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
                      {formData.endDate ? format(formData.endDate, "dd MMM yyyy", { locale }) : t("closurePeriodDialog.selectDate")}
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

          {/* Inline Conflict Warning */}
          {conflicts?.hasConflicts && (
            <PeriodConflictWarning
              conflicts={conflicts}
              acknowledgeConflicts={acknowledgeConflicts}
              onAcknowledgeChange={setAcknowledgeConflicts}
              onNavigateToEvent={handleNavigateToEvent}
            />
          )}

          {/* Publish Date */}
          <div className="space-y-2">
            <Label>{t("closurePeriodDialog.publishDateLabel")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.publishDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.publishDate ? format(formData.publishDate, "dd MMM yyyy", { locale }) : t("closurePeriodDialog.selectDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.publishDate}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, publishDate: date }))}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("closurePeriodDialog.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {isEditing ? t("closurePeriodDialog.save") : t("closurePeriodDialog.create")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
