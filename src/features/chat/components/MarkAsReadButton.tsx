import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarkAsReadButtonProps {
  hasUnread: boolean;
  tabName: string;
  onClick: (tabName: string) => void;
}

export const MarkAsReadButton = ({ 
  hasUnread, 
  tabName, 
  onClick 
}: MarkAsReadButtonProps) => {
  if (!hasUnread) return null;
  
  return (
    <div className="p-2 flex justify-start">
      <Button
        variant="ghost"
        size="sm"
        className="text-xs flex items-center gap-1 text-muted-foreground"
        onClick={() => onClick(tabName)}
      >
        <MailCheck className="h-4 w-4" />
        Mark all as read
      </Button>
    </div>
  );
};
