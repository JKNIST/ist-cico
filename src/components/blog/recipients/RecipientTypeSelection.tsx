import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface RecipientTypeSelectionProps {
  showExternal: boolean;
  showInternal: boolean;
  onShowExternalChange: (value: boolean) => void;
  onShowInternalChange: (value: boolean) => void;
}

export function RecipientTypeSelection({
  showExternal,
  showInternal,
  onShowExternalChange,
  onShowInternalChange,
}: RecipientTypeSelectionProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="external"
          checked={showExternal}
          onCheckedChange={(checked) => onShowExternalChange(checked === true)}
        />
        <Label htmlFor="external" className="cursor-pointer">
          {t("blog.form.externalRecipients")}
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="internal"
          checked={showInternal}
          onCheckedChange={(checked) => onShowInternalChange(checked === true)}
        />
        <Label htmlFor="internal" className="cursor-pointer">
          {t("blog.form.internalRecipients")}
        </Label>
      </div>
    </div>
  );
}
