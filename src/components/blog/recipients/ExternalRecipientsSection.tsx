import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export function ExternalRecipientsSection() {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState<string[]>(["Spindeln", "Fjärilen"]);
  const [students, setStudents] = useState<string[]>([]);
  const [departmentInput, setDepartmentInput] = useState("");
  const [studentInput, setStudentInput] = useState("");

  const handleAddDepartment = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && departmentInput.trim()) {
      setDepartments([...departments, departmentInput.trim()]);
      setDepartmentInput("");
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
        <Input
          placeholder="Tryck Enter för att lägga till..."
          value={departmentInput}
          onChange={(e) => setDepartmentInput(e.target.value)}
          onKeyDown={handleAddDepartment}
        />
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

      {/* Elever/Barn */}
      <div className="space-y-2">
        <Label>{t("blog.form.students")}</Label>
        <Input
          placeholder="Tryck Enter för att lägga till..."
          value={studentInput}
          onChange={(e) => setStudentInput(e.target.value)}
          onKeyDown={handleAddStudent}
        />
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
