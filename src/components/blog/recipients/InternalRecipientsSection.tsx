import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export function InternalRecipientsSection() {
  const { t } = useTranslation();
  const [staff, setStaff] = useState<string[]>(["Alla pedagoger"]);
  const [staffInput, setStaffInput] = useState("");

  const handleAddStaff = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && staffInput.trim()) {
      setStaff([...staff, staffInput.trim()]);
      setStaffInput("");
    }
  };

  const removeStaff = (index: number) => {
    setStaff(staff.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 pl-6 pt-3 border-l-2">
      <div className="space-y-2">
        <Label>{t("blog.form.staff")}</Label>
        <Input
          placeholder="Tryck Enter för att lägga till..."
          value={staffInput}
          onChange={(e) => setStaffInput(e.target.value)}
          onKeyDown={handleAddStaff}
        />
        <div className="flex flex-wrap gap-2">
          {staff.map((member, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {member}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeStaff(index)}
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
