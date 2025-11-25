import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StaffMember } from "@/components/staff/types";

interface Recipient {
  id: string;
  name: string;
  subtitle?: string;
  class: string;
  type: "guardian" | "staff";
}

interface RecipientSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isPopoverOpen: boolean;
  onPopoverOpenChange: (open: boolean) => void;
  recipients: (Recipient | StaffMember)[];
  selectedRecipients: (Recipient | StaffMember)[];
  onRecipientSelect: (recipient: Recipient | StaffMember, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
}

export const RecipientSearch = ({
  searchQuery,
  onSearchChange,
  isPopoverOpen,
  onPopoverOpenChange,
  recipients,
  selectedRecipients,
  onRecipientSelect,
  onSelectAll,
}: RecipientSearchProps) => {
  const { t } = useTranslation();
  const allSelected = selectedRecipients.length === recipients.length && recipients.length > 0;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t("chat.modal.recipients")}</label>
      <Popover open={isPopoverOpen} onOpenChange={onPopoverOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
          >
            <span className="text-muted-foreground">
              {selectedRecipients.length === 0
                ? t("chat.modal.selectRecipients")
                : `${selectedRecipients.length} ${t("chat.modal.selected")}`}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="p-3 border-b">
            <Input
              placeholder={t("chat.modal.searchRecipients")}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="p-2 border-b">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={allSelected}
                onCheckedChange={onSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                {t("chat.modal.selectAll")} ({recipients.length})
              </label>
            </div>
          </div>
          <div className="max-h-[300px] overflow-auto">
            {recipients.map((recipient) => (
              <div
                key={recipient.id}
                className="flex items-center space-x-2 p-2 hover:bg-accent cursor-pointer"
                onClick={() => {
                  const isSelected = selectedRecipients.some((r) => r.id === recipient.id);
                  onRecipientSelect(recipient, !isSelected);
                }}
              >
                <Checkbox
                  checked={selectedRecipients.some((r) => r.id === recipient.id)}
                  onCheckedChange={(checked) =>
                    onRecipientSelect(recipient, checked as boolean)
                  }
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{recipient.name}</p>
                  {'subtitle' in recipient && recipient.subtitle && (
                    <p className="text-xs text-muted-foreground truncate">{recipient.subtitle}</p>
                  )}
                  {'role' in recipient ? (
                    <p className="text-xs text-muted-foreground truncate">{recipient.role}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground truncate">{recipient.class}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {selectedRecipients.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedRecipients.map((recipient) => (
            <Badge
              key={recipient.id}
              variant="secondary"
              className="pr-1"
            >
              {recipient.name}
              <button
                onClick={() => onRecipientSelect(recipient, false)}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
