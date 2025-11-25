import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Users } from "lucide-react";
import { mockGroups } from "@/data/groups/mockGroups";
import { ChildGroup } from "@/types/groups";

interface CalendarGroupSelectorProps {
  selectedDepartments: string[];
  selectedGroups: string[];
  onGroupsChange: (groups: string[]) => void;
}

export function CalendarGroupSelector({
  selectedDepartments,
  selectedGroups,
  onGroupsChange,
}: CalendarGroupSelectorProps) {
  const { t } = useTranslation();
  const [availableGroups, setAvailableGroups] = useState<ChildGroup[]>([]);

  // Filtrera grupper baserat på valda avdelningar
  useEffect(() => {
    if (selectedDepartments.length === 0) {
      setAvailableGroups([]);
      onGroupsChange([]);
      return;
    }

    const groups = mockGroups.filter((group) =>
      selectedDepartments.includes(group.department)
    );
    setAvailableGroups(groups);

    // Ta bort valda grupper som inte längre är tillgängliga
    const validGroups = selectedGroups.filter((groupFullName) =>
      groups.some((g) => g.fullName === groupFullName)
    );
    if (validGroups.length !== selectedGroups.length) {
      onGroupsChange(validGroups);
    }
  }, [selectedDepartments, selectedGroups, onGroupsChange]);

  const toggleGroup = (groupFullName: string) => {
    const newGroups = selectedGroups.includes(groupFullName)
      ? selectedGroups.filter((g) => g !== groupFullName)
      : [...selectedGroups, groupFullName];
    onGroupsChange(newGroups);
  };

  const removeGroup = (groupFullName: string) => {
    onGroupsChange(selectedGroups.filter((g) => g !== groupFullName));
  };

  if (selectedDepartments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm flex items-center gap-2">
        <Users className="h-4 w-4" />
        {t("eventDialog.groups")}
      </Label>

      {/* Lista över tillgängliga grupper */}
      <div className="border rounded-md p-3 min-h-[48px]">
        <div className="flex flex-wrap gap-2">
          {availableGroups.length === 0 ? (
            <span className="text-sm text-muted-foreground">
              {t("groups.noGroupsAvailable")}
            </span>
          ) : (
            availableGroups.map((group) => (
              <Badge
                key={group.id}
                variant={selectedGroups.includes(group.fullName) ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => toggleGroup(group.fullName)}
                style={
                  selectedGroups.includes(group.fullName) && group.color
                    ? {
                        backgroundColor: group.color,
                        borderColor: group.color,
                        color: "white",
                      }
                    : group.color
                    ? { borderColor: group.color, color: group.color }
                    : {}
                }
              >
                {group.fullName}
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* Valda grupper som tags */}
      {selectedGroups.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedGroups.map((groupFullName) => {
            const group = availableGroups.find((g) => g.fullName === groupFullName);
            return (
              <div
                key={groupFullName}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-primary/20"
                style={
                  group?.color
                    ? {
                        backgroundColor: `${group.color}20`,
                        borderColor: group.color,
                        color: group.color,
                      }
                    : {}
                }
              >
                {groupFullName}
                <button
                  onClick={() => removeGroup(groupFullName)}
                  className="hover:bg-black/10 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
