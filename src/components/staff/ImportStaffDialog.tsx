import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";
import { FileUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ImportStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (
    staff: Array<{
      name: string;
      role: string;
      department: string;
      isSubstitute: boolean;
      substituteStartDate?: string;
      substituteEndDate?: string;
    }>
  ) => void;
}

interface ParsedStaff {
  name: string;
  role: string;
  department: string;
  isSubstitute: boolean;
  substituteStartDate?: string;
  substituteEndDate?: string;
  selected: boolean;
}

export function ImportStaffDialog({ open, onOpenChange, onImport }: ImportStaffDialogProps) {
  const { t } = useTranslation();
  const [jsonInput, setJsonInput] = useState("");
  const [parsedStaff, setParsedStaff] = useState<ParsedStaff[]>([]);
  const [error, setError] = useState("");

  const exampleJson = JSON.stringify(
    [
      {
        name: "Anna Andersson",
        role: "Teacher",
        department: "Blåbär",
        isSubstitute: false,
      },
      {
        name: "Erik Eriksson",
        role: "Assistant",
        department: "Lingon",
        isSubstitute: true,
        substituteStartDate: "2025-01-15",
        substituteEndDate: "2025-03-31",
      },
    ],
    null,
    2
  );

  const handleParse = () => {
    setError("");
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        setError(t("staffSchedule.importErrorNotArray"));
        return;
      }

      const validStaff: ParsedStaff[] = [];
      for (const item of parsed) {
        if (!item.name || !item.role || !item.department) {
          setError(t("staffSchedule.importErrorMissingFields"));
          return;
        }
        validStaff.push({
          ...item,
          isSubstitute: item.isSubstitute || false,
          selected: true,
        });
      }

      setParsedStaff(validStaff);
      toast({
        title: t("staffSchedule.importParsed"),
        description: t("staffSchedule.importParsedCount", { count: validStaff.length }),
      });
    } catch (err) {
      setError(t("staffSchedule.importErrorInvalidJson"));
    }
  };

  const handleImport = () => {
    const selectedStaff = parsedStaff.filter((s) => s.selected);
    if (selectedStaff.length === 0) {
      toast({
        title: t("staffSchedule.error"),
        description: t("staffSchedule.importErrorNoSelection"),
        variant: "destructive",
      });
      return;
    }

    onImport(selectedStaff);
    toast({
      title: t("staffSchedule.importSuccess"),
      description: t("staffSchedule.importSuccessCount", { count: selectedStaff.length }),
    });

    // Reset
    setJsonInput("");
    setParsedStaff([]);
    setError("");
    onOpenChange(false);
  };

  const toggleSelection = (index: number) => {
    setParsedStaff((prev) =>
      prev.map((staff, i) => (i === index ? { ...staff, selected: !staff.selected } : staff))
    );
  };

  const selectAll = () => {
    setParsedStaff((prev) => prev.map((staff) => ({ ...staff, selected: true })));
  };

  const deselectAll = () => {
    setParsedStaff((prev) => prev.map((staff) => ({ ...staff, selected: false })));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            {t("staffSchedule.importStaff")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t("staffSchedule.importInstructions")}</Label>
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={exampleJson}
              className="font-mono text-xs min-h-[200px]"
            />
            <Button onClick={handleParse} size="sm" className="w-full">
              {t("staffSchedule.parseJson")}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive rounded-md text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {parsedStaff.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  {t("staffSchedule.importPreview")} ({parsedStaff.filter((s) => s.selected).length}/
                  {parsedStaff.length})
                </Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    {t("staffSchedule.selectAll")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={deselectAll}>
                    {t("staffSchedule.deselectAll")}
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-md p-3 bg-muted/30">
                {parsedStaff.map((staff, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-background rounded-md border hover:border-primary/50 transition-colors"
                  >
                    <Checkbox
                      checked={staff.selected}
                      onCheckedChange={() => toggleSelection(index)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="font-semibold">{staff.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {staff.role} • {staff.department}
                      </div>
                      {staff.isSubstitute && (
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            {t("staffSchedule.substitute")}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {staff.substituteStartDate} - {staff.substituteEndDate}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("eventDialog.cancel")}
          </Button>
          {parsedStaff.length > 0 && (
            <Button onClick={handleImport}>{t("staffSchedule.importButton")}</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
