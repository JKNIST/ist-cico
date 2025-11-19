import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FilterOptionsProps {
  showInternalOnly: boolean;
  showUnpublished: boolean;
  onShowInternalOnlyChange: (value: boolean) => void;
  onShowUnpublishedChange: (value: boolean) => void;
  activeFiltersCount: number;
}

export function FilterOptions({
  showInternalOnly,
  showUnpublished,
  onShowInternalOnlyChange,
  onShowUnpublishedChange,
  activeFiltersCount,
}: FilterOptionsProps) {
  const { t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          {t("blog.filter")}
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <h3 className="font-medium text-sm">{t("blog.filters.activeFilters")}</h3>

          <div className="space-y-4">
            {/* Visa endast interna */}
            <div className="flex items-center justify-between">
              <Label htmlFor="internal-only" className="cursor-pointer">
                {t("blog.filters.showInternalOnly")}
              </Label>
              <Switch
                id="internal-only"
                checked={showInternalOnly}
                onCheckedChange={onShowInternalOnlyChange}
              />
            </div>

            {/* Visa opublicerade */}
            <div className="flex items-center justify-between">
              <Label htmlFor="unpublished" className="cursor-pointer">
                {t("blog.filters.showUnpublished")}
              </Label>
              <Switch
                id="unpublished"
                checked={showUnpublished}
                onCheckedChange={onShowUnpublishedChange}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
