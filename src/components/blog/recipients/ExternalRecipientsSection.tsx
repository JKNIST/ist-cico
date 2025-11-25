import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { GroupsSelection } from "./GroupsSelection";
import { mockDepartments } from "@/data/groups/mockGroups";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ExternalRecipientsSection() {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState<string[]>([]);
  const [students, setStudents] = useState<string[]>([]);
  const [studentInput, setStudentInput] = useState("");

  const availableDepartments = mockDepartments.map(dept => dept.name);

  const handleAddDepartment = (value: string) => {
    if (value && !departments.includes(value)) {
      setDepartments([...departments, value]);
    }
  };

  const handleAddStudent = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && studentInput.trim()) {
      setStudents([...students, studentInput.trim()]);
      setStudentInput("");
    }
  };

  const removeDepartment = (index: number) => {
    setDepartments(departments.filter((_, i) => i !== index));
  };

  const removeStudent = (index: number) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 pl-6 pt-3 border-l-2">
      {/* Avdelningar */}
      <div className="space-y-2">
        <Label>{t("blog.form.classesGroups")}</Label>
        <Select onValueChange={handleAddDepartment}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder={t("groups.selectDepartmentToAdd")} />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            {availableDepartments
              .filter(dept => !departments.includes(dept))
              .map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-2">
          {departments.map((dept, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {dept}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeDepartment(index)}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Grupper - baserat på valda avdelningar */}
      <GroupsSelection selectedDepartments={departments} />

      {/* Elever/Barn */}
      <div className="space-y-2">
        <Label>{t("blog.form.students")}</Label>
        <Select onValueChange={(value) => {
          if (value && !students.includes(value)) {
            setStudents([...students, value]);
          }
        }}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder={t("groups.selectChildrenToAdd")} />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            {mockDepartments
              .filter(dept => departments.includes(dept.name))
              .flatMap(dept => dept.children)
              .filter(child => !students.includes(child.name))
              .map((child) => (
                <SelectItem key={child.id} value={child.name}>
                  {child.name} ({child.department})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-2">
          {students.map((student, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {student}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeStudent(index)}
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
