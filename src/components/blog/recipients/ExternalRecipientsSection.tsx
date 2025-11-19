import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export function ExternalRecipientsSection() {
  const { t } = useTranslation();
  const [classes, setClasses] = useState<string[]>(["Spindeln", "Fjärilen"]);
  const [students, setStudents] = useState<string[]>([]);
  const [classInput, setClassInput] = useState("");
  const [studentInput, setStudentInput] = useState("");

  const handleAddClass = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && classInput.trim()) {
      setClasses([...classes, classInput.trim()]);
      setClassInput("");
    }
  };

  const handleAddStudent = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && studentInput.trim()) {
      setStudents([...students, studentInput.trim()]);
      setStudentInput("");
    }
  };

  const removeClass = (index: number) => {
    setClasses(classes.filter((_, i) => i !== index));
  };

  const removeStudent = (index: number) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 pl-6 pt-3 border-l-2">
      {/* Klasser/Grupper */}
      <div className="space-y-2">
        <Label>{t("blog.form.classesGroups")}</Label>
        <Input
          placeholder="Tryck Enter för att lägga till..."
          value={classInput}
          onChange={(e) => setClassInput(e.target.value)}
          onKeyDown={handleAddClass}
        />
        <div className="flex flex-wrap gap-2">
          {classes.map((cls, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {cls}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeClass(index)}
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
