import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDepartmentFilter } from "@/contexts/DepartmentFilterContext";
import { mockDepartments } from "@/data/groups/mockGroups";
import { useTranslation } from "react-i18next";

export function DepartmentSelector() {
  const { t } = useTranslation();
  const { selectedDepartments, setSelectedDepartments } = useDepartmentFilter();

  const handleDepartmentToggle = (departmentName: string) => {
    if (selectedDepartments.includes(departmentName)) {
      setSelectedDepartments(selectedDepartments.filter(d => d !== departmentName));
    } else {
      setSelectedDepartments([...selectedDepartments, departmentName]);
    }
  };

  const getDisplayText = () => {
    if (selectedDepartments.length === 0) {
      return t("allDepartments");
    }
    if (selectedDepartments.length === 1) {
      return selectedDepartments[0];
    }
    if (selectedDepartments.length === 2) {
      return selectedDepartments.join(", ");
    }
    return `${selectedDepartments[0]}, ${selectedDepartments[1]}, +${selectedDepartments.length - 2}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-start">
          <Building2 className="h-4 w-4 mr-2" />
          <span className="truncate">{getDisplayText()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {mockDepartments.map((department) => (
          <DropdownMenuCheckboxItem
            key={department.id}
            checked={selectedDepartments.includes(department.name)}
            onCheckedChange={() => handleDepartmentToggle(department.name)}
          >
            {department.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
