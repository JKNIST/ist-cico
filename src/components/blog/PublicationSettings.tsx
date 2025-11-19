import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface PublicationSettingsProps {
  publicationDate: Date | undefined;
  publicationTime: string;
  onPublicationDateChange: (date: Date | undefined) => void;
  onPublicationTimeChange: (time: string) => void;
}

export function PublicationSettings({
  publicationDate,
  publicationTime,
  onPublicationDateChange,
  onPublicationTimeChange,
}: PublicationSettingsProps) {
  const { t } = useTranslation();
  const [publicationType, setPublicationType] = useState<"now" | "scheduled">("now");
  const [autoDelete, setAutoDelete] = useState(false);

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="font-medium text-sm">Publiceringsinställningar</h3>

      <RadioGroup value={publicationType} onValueChange={(value) => setPublicationType(value as "now" | "scheduled")}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="now" id="now" />
          <Label htmlFor="now" className="cursor-pointer">
            Publicera nu
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="scheduled" id="scheduled" />
          <Label htmlFor="scheduled" className="cursor-pointer">
            Schemalägg publicering
          </Label>
        </div>
      </RadioGroup>

      {publicationType === "scheduled" && (
        <div className="space-y-4 pl-6">
          {/* Datum */}
          <div className="space-y-2">
            <Label>{t("blog.form.publicationDate")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !publicationDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {publicationDate ? (
                    format(publicationDate, "PPP", { locale: sv })
                  ) : (
                    <span>Välj datum</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={publicationDate}
                  onSelect={onPublicationDateChange}
                  initialFocus
                  locale={sv}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Tid */}
          <div className="space-y-2">
            <Label>{t("blog.form.publicationTime")}</Label>
            <Input
              type="time"
              value={publicationTime}
              onChange={(e) => onPublicationTimeChange(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Auto-radering */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="space-y-0.5">
          <Label htmlFor="auto-delete" className="cursor-pointer">
            {t("blog.form.autoDelete")}
          </Label>
          <p className="text-xs text-muted-foreground">
            {t("blog.form.policyNote")}
          </p>
        </div>
        <Switch
          id="auto-delete"
          checked={autoDelete}
          onCheckedChange={setAutoDelete}
        />
      </div>
    </div>
  );
}
