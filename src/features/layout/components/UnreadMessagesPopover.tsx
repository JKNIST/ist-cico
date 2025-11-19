import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessagePreview {
  id: number;
  conversationId: number;
  sender: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface UnreadMessagesPopoverProps {
  onMessageClick: () => void;
}

export const UnreadMessagesPopover = ({ onMessageClick }: UnreadMessagesPopoverProps) => {
  const [unreadMessages, setUnreadMessages] = useState<MessagePreview[]>([]);

  useEffect(() => {
    const fetchUnreadMessages = () => {
      const storedConversations = localStorage.getItem('conversations');
      if (!storedConversations) return [];

      try {
        const conversations = JSON.parse(storedConversations);
        const unread: MessagePreview[] = [];

        conversations.forEach((conversation: any) => {
          const unreadMsgs = conversation.messages
            .filter((msg: any) => !msg.isRead)
            .map((msg: any) => ({
              id: msg.id,
              conversationId: conversation.id,
              sender: msg.sender,
              content: msg.content,
              timestamp: msg.timestamp,
              isRead: msg.isRead,
            }));
          
          unread.push(...unreadMsgs);
        });

        return unread.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      } catch (error) {
        console.error("Error parsing conversations:", error);
        return [];
      }
    };

    setUnreadMessages(fetchUnreadMessages());

    const handleUnreadMessagesUpdate = () => {
      setUnreadMessages(fetchUnreadMessages());
    };

    window.addEventListener('unreadMessagesUpdated', handleUnreadMessagesUpdate);

    return () => {
      window.removeEventListener('unreadMessagesUpdated', handleUnreadMessagesUpdate);
    };
  }, []);

  const handleMessageClick = () => {
    onMessageClick();
  };

  return (
    <div className="bg-background rounded-md shadow-md overflow-hidden max-h-[70vh] flex flex-col">
      <div className="p-3 border-b bg-muted">
        <h3 className="font-semibold text-foreground">Olästa meddelanden ({unreadMessages.length})</h3>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {unreadMessages.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground flex flex-col items-center">
            <MessageSquare className="h-10 w-10 mb-2 opacity-20" />
            <p>Inga olästa meddelanden</p>
          </div>
        ) : (
          <div>
            {unreadMessages.map((message) => (
              <Link 
                to={`/chatt?conversationId=${message.conversationId}`}
                key={`${message.conversationId}-${message.id}`}
                className={cn(
                  "block p-3 border-b hover:bg-accent transition-colors",
                  !message.isRead && "bg-accent"
                )}
                onClick={handleMessageClick}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{message.sender}</span>
                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                </div>
                <p className="text-sm text-foreground line-clamp-2">{message.content}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-2 border-t bg-muted">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full"
          asChild
          onClick={handleMessageClick}
        >
          <Link to="/chatt">Visa alla meddelanden</Link>
        </Button>
      </div>
    </div>
  );
};
