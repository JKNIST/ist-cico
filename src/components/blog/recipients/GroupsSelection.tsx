import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Users } from "lucide-react";
import { mockGroups } from "@/data/groups/mockGroups";
import { ChildGroup } from "@/types/groups";

interface GroupsSelectionProps {
  selectedDepartments: string[];
}

export function GroupsSelection({ selectedDepartments }: GroupsSelectionProps) {
  const { t } = useTranslation();
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [availableGroups, setAvailableGroups] = useState<ChildGroup[]>([]);

  // Filtrera grupper baserat på valda avdelningar
  useEffect(() => {
    if (selectedDepartments.length === 0) {
      setAvailableGroups([]);
      setSelectedGroups([]);
      return;
    }

    const groups = mockGroups.filter((group) =>
      selectedDepartments.includes(group.department)
    );
    setAvailableGroups(groups);

    // Ta bort valda grupper som inte längre är tillgängliga
    setSelectedGroups((prev) =>
      prev.filter((groupFullName) =>
        groups.some((g) => g.fullName === groupFullName)
      )
    );
  }, [selectedDepartments]);

  const toggleGroup = (groupFullName: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupFullName)
        ? prev.filter((g) => g !== groupFullName)
        : [...prev, groupFullName]
    );
  };

  const removeGroup = (groupFullName: string) => {
    setSelectedGroups((prev) => prev.filter((g) => g !== groupFullName));
  };

  if (selectedDepartments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground flex items-center gap-2">
        <Users className="h-4 w-4" />
        {t("blog.form.groups")}
      </Label>

      {/* Lista över tillgängliga grupper */}
      <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-md">
        {availableGroups.length === 0 ? (
          <span className="text-sm text-muted-foreground">
            {t("groups.noGroupsAvailable")}
          </span>
        ) : (
          availableGroups.map((group) => (
            <Badge
              key={group.id}
              variant={
                selectedGroups.includes(group.fullName) ? "default" : "outline"
              }
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => toggleGroup(group.fullName)}
              style={
                selectedGroups.includes(group.fullName) && group.color
                  ? { backgroundColor: group.color, borderColor: group.color }
                  : {}
              }
            >
              {group.fullName}
            </Badge>
          ))
        )}
      </div>

      {/* Valda grupper */}
      {selectedGroups.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedGroups.map((groupFullName) => {
            const group = availableGroups.find((g) => g.fullName === groupFullName);
            return (
              <Badge
                key={groupFullName}
                variant="secondary"
                className="gap-1"
                style={
                  group?.color
                    ? { backgroundColor: `${group.color}20`, borderColor: group.color }
                    : {}
                }
              >
                {groupFullName}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeGroup(groupFullName)}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
