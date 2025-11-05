import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface RecurringActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionType: "delete" | "edit";
  onConfirm: (scope: "single" | "future" | "all") => void;
}

export function RecurringActionDialog({ open, onOpenChange, actionType, onConfirm }: RecurringActionDialogProps) {
  const { t } = useTranslation();
  const [selectedScope, setSelectedScope] = useState<"single" | "future" | "all">("single");

  const handleConfirm = () => {
    onConfirm(selectedScope);
    onOpenChange(false);
  };

  const title = actionType === "delete" ? t('recurringDialog.title').replace('Redigera', 'Ta bort') : t('recurringDialog.title');
  const actionLabel = actionType === "delete" ? t('eventDialog.delete') : t('eventDialog.save');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">{t('recurringDialog.description')}</p>
          <RadioGroup value={selectedScope} onValueChange={(value) => setSelectedScope(value as "single" | "future" | "all")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id="single" />
              <Label htmlFor="single" className="font-normal cursor-pointer">
                {t('recurringDialog.thisInstance')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="future" id="future" />
              <Label htmlFor="future" className="font-normal cursor-pointer">
                {t('recurringDialog.allInstances')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="font-normal cursor-pointer">
                {t('recurringDialog.allInstances')}
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t('eventDialog.cancel')}
          </Button>
          <Button 
            className={actionType === "delete" ? "bg-destructive hover:bg-destructive/90" : "bg-[#2a9d8f] hover:bg-[#238276]"}
            onClick={handleConfirm}
          >
            {actionLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
