import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getStaffingRatios, updateStaffingRatio, type StaffingRatio } from "@/data/staff/staffingRatios";
import { toast } from "sonner";

export function StaffingRatioSettings() {
  const { t } = useTranslation();
  const [ratios, setRatios] = useState<StaffingRatio[]>([]);

  useEffect(() => {
    setRatios(getStaffingRatios());
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

  const handleSave = () => {
    ratios.forEach((ratio) => {
      updateStaffingRatio(ratio.department, ratio.maxChildrenPerStaff);
    });
    toast.success("Bemanningsinställningar sparade");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bemanningsnyckeltal</CardTitle>
        <CardDescription>
          Ange max antal barn per personal för varje avdelning
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
              <span className="text-sm text-muted-foreground">barn per personal</span>
            </div>
          </div>
        ))}
        
        <div className="pt-4">
          <Button onClick={handleSave}>Spara inställningar</Button>
        </div>
      </CardContent>
    </Card>
  );
}
