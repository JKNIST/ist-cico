import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { GroupAvatar } from "./GroupAvatar";
import { useState, useEffect } from "react";

interface ConversationItemProps {
  title: string;
  lastMessage: string;
  time?: string;
  isActive: boolean;
  onClick: () => void;
  department?: string;
  participants?: string[];
  hasUnreadMessages?: boolean;
}

export const ConversationItem = ({
  title,
  lastMessage,
  time = "",
  isActive,
  onClick,
  department,
  participants = [],
  hasUnreadMessages: initialHasUnread = false
}: ConversationItemProps) => {
  // Track if conversation has unread messages
  const [hasUnreadMessages, setHasUnreadMessages] = useState(initialHasUnread || lastMessage.includes("unread"));
  
  // Update unread state if props change
  useEffect(() => {
    setHasUnreadMessages(initialHasUnread || lastMessage.includes("unread"));
  }, [initialHasUnread, lastMessage]);

  const handleClick = () => {
    setHasUnreadMessages(false); // Mark as read when clicked
    onClick();
  };

  return (
    <div 
      onClick={handleClick}
      className={cn(
        "flex items-start p-3 gap-3 cursor-pointer border-b border-border",
        isActive ? "bg-chat-active" : "hover:bg-muted"
      )}
    >
      <GroupAvatar participants={participants} />
      
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex justify-between items-start">
          <h3 className={cn(
            "text-sm truncate",
            hasUnreadMessages ? "font-bold text-foreground" : "font-medium text-foreground"
          )}>
            {title}
            {department && (
              <span className={cn(
                "text-xs ml-2",
                hasUnreadMessages ? "font-bold text-muted-foreground" : "font-normal text-muted-foreground"
              )}>({department})</span>
            )}
          </h3>
          {time && (
            <span className={cn(
              "text-xs flex-shrink-0 ml-2",
              hasUnreadMessages ? "font-bold text-muted-foreground" : "text-muted-foreground"
            )}>
              {time}
            </span>
          )}
        </div>
        
        <p className={cn(
          "text-sm truncate mt-1",
          hasUnreadMessages ? "font-medium text-foreground" : "font-normal text-muted-foreground"
        )}>
          {lastMessage}
        </p>
      </div>
    </div>
  );
};
