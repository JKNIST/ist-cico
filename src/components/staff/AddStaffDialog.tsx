import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (staff: {
    name: string;
    role: string;
    department: string;
    isSubstitute: boolean;
    substituteStartDate?: string;
    substituteEndDate?: string;
    defaultSchedule?: { start: string; end: string };
  }) => void;
}

export function AddStaffDialog({ open, onOpenChange, onAdd }: AddStaffDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [staffType, setStaffType] = useState<"permanent" | "substitute">("permanent");
  const [substituteStartDate, setSubstituteStartDate] = useState("");
  const [substituteEndDate, setSubstituteEndDate] = useState("");
  const [useDefaultSchedule, setUseDefaultSchedule] = useState(false);
  const [defaultStart, setDefaultStart] = useState("07:00");
  const [defaultEnd, setDefaultEnd] = useState("16:00");

  const handleSave = () => {
    if (!name.trim() || !role.trim() || !department) {
      toast({
        title: t("staffSchedule.error"),
        description: t("staffSchedule.fillRequired"),
        variant: "destructive",
      });
      return;
    }

    if (staffType === "substitute" && (!substituteStartDate || !substituteEndDate)) {
      toast({
        title: t("staffSchedule.error"),
        description: t("staffSchedule.fillSubstitutePeriod"),
        variant: "destructive",
      });
      return;
    }

    if (staffType === "substitute" && new Date(substituteEndDate) <= new Date(substituteStartDate)) {
      toast({
        title: t("staffSchedule.error"),
        description: t("staffSchedule.endDateAfterStart"),
        variant: "destructive",
      });
      return;
    }

    onAdd({
      name: name.trim(),
      role: role.trim(),
      department,
      isSubstitute: staffType === "substitute",
      substituteStartDate: staffType === "substitute" ? substituteStartDate : undefined,
      substituteEndDate: staffType === "substitute" ? substituteEndDate : undefined,
      defaultSchedule: useDefaultSchedule ? { start: defaultStart, end: defaultEnd } : undefined,
    });

    // Reset form
    setName("");
    setRole("");
    setDepartment("");
    setStaffType("permanent");
    setSubstituteStartDate("");
    setSubstituteEndDate("");
    setUseDefaultSchedule(false);
    setDefaultStart("07:00");
    setDefaultEnd("16:00");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("staffSchedule.addStaff")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("staffSchedule.name")} *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("staffSchedule.namePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">{t("staffSchedule.roleTitle")} *</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder={t("staffSchedule.rolePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">{t("staffSchedule.department")} *</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder={t("staffSchedule.selectDepartment")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Blåbär">Blåbär</SelectItem>
                <SelectItem value="Lingon">Lingon</SelectItem>
                <SelectItem value="Odon">Odon</SelectItem>
                <SelectItem value="Vildhallon">Vildhallon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("staffSchedule.staffType")}</Label>
            <RadioGroup value={staffType} onValueChange={(value: any) => setStaffType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="permanent" id="permanent" />
                <Label htmlFor="permanent" className="font-normal cursor-pointer">
                  {t("staffSchedule.permanent")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="substitute" id="substitute" />
                <Label htmlFor="substitute" className="font-normal cursor-pointer">
                  {t("staffSchedule.substitute")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {staffType === "substitute" && (
            <div className="space-y-3 p-3 border rounded-md bg-muted/30">
              <Label className="text-sm font-semibold">{t("staffSchedule.substitutePeriod")}</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-xs">
                    {t("staffSchedule.startDate")}
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={substituteStartDate}
                    onChange={(e) => setSubstituteStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-xs">
                    {t("staffSchedule.endDate")}
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={substituteEndDate}
                    onChange={(e) => setSubstituteEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 p-3 border rounded-md">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useDefaultSchedule"
                checked={useDefaultSchedule}
                onChange={(e) => setUseDefaultSchedule(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="useDefaultSchedule" className="text-sm font-semibold cursor-pointer">
                {t("staffSchedule.setDefaultSchedule")}
              </Label>
            </div>
            {useDefaultSchedule && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="defaultStart" className="text-xs">
                    {t("staffSchedule.defaultStart")}
                  </Label>
                  <Input
                    id="defaultStart"
                    type="time"
                    value={defaultStart}
                    onChange={(e) => setDefaultStart(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultEnd" className="text-xs">
                    {t("staffSchedule.defaultEnd")}
                  </Label>
                  <Input
                    id="defaultEnd"
                    type="time"
                    value={defaultEnd}
                    onChange={(e) => setDefaultEnd(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("eventDialog.cancel")}
          </Button>
          <Button onClick={handleSave}>{t("eventDialog.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
