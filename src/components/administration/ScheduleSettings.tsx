import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getStaffingRatios, updateStaffingRatio, type StaffingRatio } from "@/data/staff/staffingRatios";
import { 
  getTimeIntervals, 
  updateTimeIntervals, 
  getIntervalResolution, 
  setIntervalResolution,
  defaultTimeIntervals,
  type TimeInterval,
  type IntervalResolution 
} from "@/data/staff/timeIntervalSettings";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";

export function ScheduleSettings() {
  const { t } = useTranslation();
  const [ratios, setRatios] = useState<StaffingRatio[]>([]);
  const [resolution, setResolution] = useState<IntervalResolution>('default');
  const [customIntervals, setCustomIntervals] = useState<TimeInterval[]>([]);

  useEffect(() => {
    setRatios(getStaffingRatios());
    const currentResolution = getIntervalResolution();
    setResolution(currentResolution);
    if (currentResolution === 'custom') {
      setCustomIntervals(getTimeIntervals());
    } else {
      setCustomIntervals(defaultTimeIntervals);
    }
  }, []);

  const handleRatioChange = (department: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setRatios((prev) =>
        prev.map((r) =>
          r.department === department ? { ...r, maxChildrenPerStaff: numValue } : r
        )
      );
    }
  };

  const handleSaveRatios = () => {
    ratios.forEach((ratio) => {
      updateStaffingRatio(ratio.department, ratio.maxChildrenPerStaff);
    });
    toast.success(t("schedule.staffingSettings.saved"));
  };

  const handleResolutionChange = (value: IntervalResolution) => {
    setResolution(value);
    setIntervalResolution(value);
    
    if (value === 'custom' && customIntervals.length === 0) {
      setCustomIntervals(defaultTimeIntervals);
    }
    
    // Dispatch event to notify Schedule page
    window.dispatchEvent(new CustomEvent("timeIntervalsUpdated"));
    toast.success("Tidsintervall-inställningar uppdaterade");
  };

  const handleIntervalChange = (index: number, field: 'start' | 'end', value: string) => {
    setCustomIntervals((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      // Update label
      updated[index].label = `${updated[index].start}-${updated[index].end}`;
      return updated;
    });
  };

  const handleAddInterval = () => {
    const lastInterval = customIntervals[customIntervals.length - 1];
    const newStart = lastInterval ? lastInterval.end : "18:00";
    const newEnd = "20:00";
    
    setCustomIntervals((prev) => [
      ...prev,
      { start: newStart, end: newEnd, label: `${newStart}-${newEnd}` }
    ]);
  };

  const handleRemoveInterval = (index: number) => {
    if (customIntervals.length > 1) {
      setCustomIntervals((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSaveIntervals = () => {
    if (resolution === 'custom') {
      updateTimeIntervals(customIntervals);
    }
    setIntervalResolution(resolution);
    window.dispatchEvent(new CustomEvent("timeIntervalsUpdated"));
    toast.success("Tidsintervall-inställningar sparade");
  };

  return (
    <div className="space-y-6">
      {/* Staffing Ratios Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("schedule.staffingSettings.title")}</CardTitle>
          <CardDescription>
            {t("schedule.staffingSettings.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {ratios.map((ratio) => (
            <div key={ratio.department} className="flex items-center gap-4">
              <Label className="w-32">{ratio.department}</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={ratio.maxChildrenPerStaff}
                  onChange={(e) => handleRatioChange(ratio.department, e.target.value)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">
                  {t("schedule.staffingSettings.childrenPerStaff")}
                </span>
              </div>
            </div>
          ))}
          
          <div className="pt-4">
            <Button onClick={handleSaveRatios}>{t("schedule.staffingSettings.save")}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Time Intervals Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("schedule.timeIntervals.title")}</CardTitle>
          <CardDescription>
            {t("schedule.timeIntervals.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={resolution} onValueChange={(value) => handleResolutionChange(value as IntervalResolution)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="default" />
              <Label htmlFor="default" className="cursor-pointer">
                {t("schedule.timeIntervals.resolution.default")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hourly" id="hourly" />
              <Label htmlFor="hourly" className="cursor-pointer">
                {t("schedule.timeIntervals.resolution.hourly")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="cursor-pointer">
                {t("schedule.timeIntervals.resolution.custom")}
              </Label>
            </div>
          </RadioGroup>

          {resolution === 'custom' && (
            <div className="space-y-3 mt-4 pt-4 border-t">
              <Label className="text-sm font-medium">Anpassade tidsintervaller</Label>
              {customIntervals.map((interval, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={interval.start}
                    onChange={(e) => handleIntervalChange(index, 'start', e.target.value)}
                    className="w-32"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="time"
                    value={interval.end}
                    onChange={(e) => handleIntervalChange(index, 'end', e.target.value)}
                    className="w-32"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveInterval(index)}
                    disabled={customIntervals.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddInterval} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                {t("schedule.timeIntervals.addInterval")}
              </Button>
              
              <div className="pt-4">
                <Button onClick={handleSaveIntervals}>Spara tidsintervaller</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
