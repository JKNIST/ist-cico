import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChildGroup, Child } from "@/types/groups";

interface GroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (group: ChildGroup) => void;
  editingGroup: ChildGroup | null;
  departments: Array<{ id: string; name: string; children: Child[] }>;
}

const GROUP_COLORS = [
  { name: "Blå", color: "#3b82f6" },
  { name: "Grön", color: "#10b981" },
  { name: "Röd", color: "#ef4444" },
  { name: "Gul", color: "#eab308" },
  { name: "Lila", color: "#a855f7" },
  { name: "Orange", color: "#f97316" },
  { name: "Rosa", color: "#ec4899" },
  { name: "Turkos", color: "#06b6d4" },
];

export function GroupDialog({ open, onOpenChange, onSave, editingGroup, departments }: GroupDialogProps) {
  const { t } = useTranslation();
  const [groupName, setGroupName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState(GROUP_COLORS[0].color);

  useEffect(() => {
    if (editingGroup) {
      setGroupName(editingGroup.name);
      setSelectedDepartment(editingGroup.department);
      setSelectedChildren(editingGroup.children);
      setSelectedColor(editingGroup.color || GROUP_COLORS[0].color);
    } else {
      setGroupName("");
      setSelectedDepartment("");
      setSelectedChildren([]);
      setSelectedColor(GROUP_COLORS[0].color);
    }
  }, [editingGroup, open]);

  const handleSave = () => {
    if (!groupName.trim() || !selectedDepartment || selectedChildren.length === 0) {
      return;
    }

    const fullName = `${selectedDepartment}-${groupName}`;
    
    const group: ChildGroup = {
      id: editingGroup?.id || `group-${Date.now()}`,
      name: groupName,
      department: selectedDepartment,
      fullName,
      children: selectedChildren,
      createdBy: editingGroup?.createdBy || "Current User",
      createdAt: editingGroup?.createdAt || new Date(),
      updatedAt: editingGroup ? new Date() : undefined,
      color: selectedColor,
    };

    onSave(group);
    onOpenChange(false);
  };

  const handleChildToggle = (childId: string) => {
    setSelectedChildren(prev =>
      prev.includes(childId)
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    );
  };

  const selectedDept = departments.find(d => d.name === selectedDepartment);
  const availableChildren = selectedDept?.children || [];
  const fullName = selectedDepartment && groupName ? `${selectedDepartment}-${groupName}` : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingGroup ? t('administration.groups.editGroup') : t('administration.groups.createGroup')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Department Selection */}
          <div className="space-y-2">
            <Label>{t('administration.groups.department')}</Label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder={t('administration.groups.selectDepartment')} />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Group Name */}
          <div className="space-y-2">
            <Label>{t('administration.groups.groupName')}</Label>
            <Input
              placeholder={t('administration.groups.groupNamePlaceholder')}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label>{t('administration.groups.groupColor')}</Label>
            <div className="flex gap-2 flex-wrap">
              {GROUP_COLORS.map((colorOption) => (
                <button
                  key={colorOption.color}
                  type="button"
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === colorOption.color 
                      ? 'border-primary scale-110' 
                      : 'border-transparent hover:border-muted-foreground'
                  }`}
                  style={{ backgroundColor: colorOption.color }}
                  onClick={() => setSelectedColor(colorOption.color)}
                  title={colorOption.name}
                />
              ))}
            </div>
          </div>

          {/* Full Name Preview */}
          {fullName && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                {t('administration.groups.fullGroupName')}:
              </p>
              <Badge 
                className="text-white"
                style={{ backgroundColor: selectedColor }}
              >
                <Users className="h-3 w-3 mr-1" />
                {fullName}
              </Badge>
            </div>
          )}

          {/* Children Selection */}
          {selectedDepartment && (
            <div className="space-y-2">
              <Label>{t('administration.groups.selectChildren')} ({selectedChildren.length})</Label>
              <div className="border rounded-lg p-3 space-y-2 max-h-60 overflow-y-auto">
                {availableChildren.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t('administration.groups.noChildren')}
                  </p>
                ) : (
                  availableChildren.map(child => (
                    <div key={child.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                      <Checkbox
                        id={child.id}
                        checked={selectedChildren.includes(child.id)}
                        onCheckedChange={() => handleChildToggle(child.id)}
                      />
                      <label
                        htmlFor={child.id}
                        className="flex-1 text-sm cursor-pointer flex items-center gap-2"
                      >
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium text-muted-foreground">
                            {child.initials}
                          </span>
                        </div>
                        <span>{child.name}</span>
                        {child.age && (
                          <span className="text-xs text-muted-foreground">({child.age} år)</span>
                        )}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('eventDialog.cancel')}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!groupName.trim() || !selectedDepartment || selectedChildren.length === 0}
          >
            {t('eventDialog.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
