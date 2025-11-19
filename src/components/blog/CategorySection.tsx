import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CategorySectionProps {
  category: string;
  isImportant: boolean;
  onCategoryChange: (category: string) => void;
  onIsImportantChange: (isImportant: boolean) => void;
}

export function CategorySection({
  category,
  isImportant,
  onCategoryChange,
  onIsImportantChange,
}: CategorySectionProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="font-medium text-sm">{t("blog.form.category")}</h3>

      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder={t("blog.form.selectCategory")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="VIKTIGA DATUM">
            {t("blog.categories.importantdates")}
          </SelectItem>
          <SelectItem value="REGELBUNDNA UPPDATERINGAR">
            {t("blog.categories.regularupdates")}
          </SelectItem>
          <SelectItem value="INFORMATION">
            {t("blog.categories.information")}
          </SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Checkbox
          id="important"
          checked={isImportant}
          onCheckedChange={(checked) => onIsImportantChange(checked === true)}
        />
        <Label htmlFor="important" className="cursor-pointer">
          {t("blog.form.markImportant")}
        </Label>
      </div>
    </div>
  );
}
