import { ReactNode } from "react";
import { TabsTrigger } from "@/components/ui/tabs";
import { Dot } from "lucide-react";
import { cn } from "@/lib/utils";

interface UnreadTabTriggerProps {
  value: string;
  activeTab: string;
  hasUnread: boolean;
  children: ReactNode;
}

export const UnreadTabTrigger = ({ 
  value, 
  activeTab, 
  hasUnread, 
  children 
}: UnreadTabTriggerProps) => {
  const renderUnreadIndicator = () => {
    if (!hasUnread) return null;
    
    return <Dot className="h-5 w-5 text-chat-unread" />;
  };

  return (
    <TabsTrigger
      value={value}
      className={cn(
        "flex-1 py-3 rounded-none data-[state=active]:bg-background flex items-center justify-center gap-1",
        activeTab === value 
          ? "border-b-2 border-chat-unread font-medium text-foreground" 
          : "border-b border-border text-muted-foreground"
      )}
    >
      {renderUnreadIndicator()}
      {children}
    </TabsTrigger>
  );
};
