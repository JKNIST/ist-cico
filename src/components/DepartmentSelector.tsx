import { Building2, ChevronDown, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useDepartmentFilter } from "@/contexts/DepartmentFilterContext";
import { mockDepartments } from "@/data/groups/mockGroups";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export function DepartmentSelector() {
  const { t } = useTranslation();
  const { selectedDepartments, setSelectedDepartments, selectedGroups, setSelectedGroups } = useDepartmentFilter();
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([]);

  const handleDepartmentToggle = (departmentName: string) => {
    if (selectedDepartments.includes(departmentName)) {
      setSelectedDepartments(selectedDepartments.filter(d => d !== departmentName));
    } else {
      setSelectedDepartments([...selectedDepartments, departmentName]);
    }
  };

  const handleGroupToggle = (groupFullName: string, departmentName: string) => {
    // Can only select groups if their department is selected
    if (!selectedDepartments.includes(departmentName)) return;

    if (selectedGroups.includes(groupFullName)) {
      setSelectedGroups(selectedGroups.filter(g => g !== groupFullName));
    } else {
      setSelectedGroups([...selectedGroups, groupFullName]);
    }
  };

  const toggleDepartmentExpansion = (departmentName: string) => {
    if (expandedDepartments.includes(departmentName)) {
      setExpandedDepartments(expandedDepartments.filter(d => d !== departmentName));
    } else {
      setExpandedDepartments([...expandedDepartments, departmentName]);
    }
  };

  const getDisplayText = () => {
    const totalSelections = selectedDepartments.length + selectedGroups.length;
    
    if (totalSelections === 0) {
      return t("allDepartments");
    }
    
    if (totalSelections === 1) {
      if (selectedDepartments.length === 1 && selectedGroups.length === 0) {
        return selectedDepartments[0];
      }
      if (selectedGroups.length === 1) {
        return selectedGroups[0];
      }
    }
    
    if (totalSelections === 2 && selectedDepartments.length === 2 && selectedGroups.length === 0) {
      return selectedDepartments.join(", ");
    }

    const parts = [];
    if (selectedDepartments.length > 0) {
      parts.push(`${selectedDepartments.length} avd`);
    }
    if (selectedGroups.length > 0) {
      parts.push(`${selectedGroups.length} grupper`);
    }
    
    return parts.join(" + ");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={selectedDepartments.length > 0 || selectedGroups.length > 0 ? "default" : "outline"} 
          className="w-[240px] justify-start"
        >
          <Building2 className="h-4 w-4 mr-2" />
          <span className="truncate">
            {getDisplayText()}
            {(selectedDepartments.length > 0 || selectedGroups.length > 0) && (
              <span className="ml-1 opacity-70">
                ({selectedDepartments.length + selectedGroups.length})
              </span>
            )}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px] max-h-[500px] overflow-y-auto">
        {mockDepartments.map((department) => {
          const isExpanded = expandedDepartments.includes(department.name);
          const isDepartmentSelected = selectedDepartments.includes(department.name);
          const departmentGroups = department.groups;

          return (
            <div key={department.id} className="space-y-1">
              <Collapsible open={isExpanded} onOpenChange={() => toggleDepartmentExpansion(department.name)}>
                <div className="flex items-center gap-1">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  
                  <DropdownMenuCheckboxItem
                    checked={isDepartmentSelected}
                    onCheckedChange={() => handleDepartmentToggle(department.name)}
                    className="flex-1"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    {department.name}
                  </DropdownMenuCheckboxItem>
                </div>

                <CollapsibleContent className="ml-6 space-y-1">
                  {departmentGroups.map((group) => {
                    const isGroupSelected = selectedGroups.includes(group.fullName);
                    const isDisabled = !isDepartmentSelected;

                    return (
                      <div
                        key={group.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-sm cursor-pointer hover:bg-muted ${
                          isDisabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => !isDisabled && handleGroupToggle(group.fullName, department.name)}
                      >
                        <Checkbox
                          checked={isGroupSelected}
                          disabled={isDisabled}
                          className="h-4 w-4"
                        />
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{group.name}</span>
                      </div>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
              
              <DropdownMenuSeparator />
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
