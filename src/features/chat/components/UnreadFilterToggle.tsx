import { Badge } from "@/components/ui/badge";
import { CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

interface UnreadFilterToggleProps {
  showOnlyUnread: boolean;
  onToggleUnread: (value: boolean) => void;
}

export const UnreadFilterToggle = ({
  showOnlyUnread,
  onToggleUnread
}: UnreadFilterToggleProps) => {
  return (
    <div className="px-4 py-2 border-b flex items-center">
      <Badge 
        onClick={() => onToggleUnread(!showOnlyUnread)}
        className={cn(
          "cursor-pointer px-3 py-1 transition-colors rounded-full",
          showOnlyUnread 
            ? "bg-calendar-external text-calendar-external-foreground border border-calendar-external-foreground/20" 
            : "bg-background border-border text-foreground hover:bg-muted"
        )}
      >
        {showOnlyUnread && <CircleDot className="w-3 h-3 mr-1 inline" />}
        Olästa
      </Badge>
    </div>
  );
};
