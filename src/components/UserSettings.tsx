import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUserSettings } from "@/hooks/useUserSettings";

interface UserSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserSettings({ open, onOpenChange }: UserSettingsProps) {
  const { t } = useTranslation();
  const { settings, updateSettings } = useUserSettings();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Användarinställningar</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="font-medium text-sm">AI-funktioner</h3>
            
            <div className="flex items-center justify-between gap-4 p-4 border rounded-md">
              <div className="space-y-1">
                <Label htmlFor="ai-schedule" className="cursor-pointer">
                  Visa AI-schemaförslag
                </Label>
                <p className="text-sm text-muted-foreground">
                  Aktivera AI-assistent för automatiska schemaförslag
                </p>
              </div>
              <Switch
                id="ai-schedule"
                checked={settings.showAiScheduleSuggestion}
                onCheckedChange={(checked) =>
                  updateSettings({ showAiScheduleSuggestion: checked })
                }
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
