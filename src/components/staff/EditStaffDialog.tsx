import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";
import { StaffSchedule } from "@/data/staff/mockStaffSchedules";

interface EditStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffSchedule | null;
  onSave: (
    staffId: string,
    updates: {
      name: string;
      role: string;
      department: string;
      isSubstitute: boolean;
      substituteStartDate?: string;
      substituteEndDate?: string;
    }
  ) => void;
}

export function EditStaffDialog({ open, onOpenChange, staff, onSave }: EditStaffDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [staffType, setStaffType] = useState<"permanent" | "substitute">("permanent");
  const [substituteStartDate, setSubstituteStartDate] = useState("");
  const [substituteEndDate, setSubstituteEndDate] = useState("");

  useEffect(() => {
    if (staff) {
      setName(staff.name);
      setRole(staff.role);
      setDepartment(staff.department || "");
      setStaffType(staff.isSubstitute ? "substitute" : "permanent");
      setSubstituteStartDate(staff.substituteStartDate || "");
      setSubstituteEndDate(staff.substituteEndDate || "");
    }
  }, [staff]);

  const handleSave = () => {
    if (!staff) return;

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

    onSave(staff.id, {
      name: name.trim(),
      role: role.trim(),
      department,
      isSubstitute: staffType === "substitute",
      substituteStartDate: staffType === "substitute" ? substituteStartDate : undefined,
      substituteEndDate: staffType === "substitute" ? substituteEndDate : undefined,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("staffSchedule.editStaff")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">{t("staffSchedule.name")} *</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("staffSchedule.namePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-role">{t("staffSchedule.roleTitle")} *</Label>
            <Input
              id="edit-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder={t("staffSchedule.rolePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-department">{t("staffSchedule.department")} *</Label>
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
                <RadioGroupItem value="permanent" id="edit-permanent" />
                <Label htmlFor="edit-permanent" className="font-normal cursor-pointer">
                  {t("staffSchedule.permanent")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="substitute" id="edit-substitute" />
                <Label htmlFor="edit-substitute" className="font-normal cursor-pointer">
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
                  <Label htmlFor="edit-startDate" className="text-xs">
                    {t("staffSchedule.startDate")}
                  </Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={substituteStartDate}
                    onChange={(e) => setSubstituteStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate" className="text-xs">
                    {t("staffSchedule.endDate")}
                  </Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={substituteEndDate}
                    onChange={(e) => setSubstituteEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
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
