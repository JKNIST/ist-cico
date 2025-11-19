import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatHeader } from "./ChatHeader";
import { useState } from "react";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type?: 'system';
}

interface Conversation {
  id: number;
  title: string;
  lastMessage: string;
  participants: string[];
  messages: Message[];
  isLocked?: boolean;
}

interface ChatAreaProps {
  conversation: Conversation;
  onSendMessage: (content: string) => void;
  onAddParticipant?: (conversationId: number, participant: string) => void;
  onRemoveParticipant?: (conversationId: number, participant: string) => void;
  onLeaveConversation?: (conversationId: number, participant: string) => void;
  onToggleLock?: (conversationId: number) => void;
}

export const ChatArea = ({ 
  conversation, 
  onSendMessage,
  onAddParticipant,
  onRemoveParticipant,
  onLeaveConversation,
  onToggleLock
}: ChatAreaProps) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() && !conversation.isLocked) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const currentUser = "Jonas Nilsson";

  return (
    <div className="h-full flex flex-col bg-muted">
      <ChatHeader
        title={conversation.title}
        participants={conversation.participants}
        isLocked={conversation.isLocked}
        onAddParticipant={participant => onAddParticipant?.(conversation.id, participant)}
        onRemoveParticipant={participant => onRemoveParticipant?.(conversation.id, participant)}
        onLeave={() => onLeaveConversation?.(conversation.id, currentUser)}
        onToggleLock={() => onToggleLock?.(conversation.id)}
      />
      <div className="flex-1 relative bg-chat-area-bg">
        <ScrollArea className="absolute inset-0 p-4">
          <div className="space-y-1">
            {conversation.messages.map((message) => (
              <ChatMessage
                key={message.id}
                {...message}
                isCurrentUser={message.sender === currentUser}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="p-3 bg-background border-t">
        <div className="flex gap-2 items-center">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={conversation.isLocked ? "Chat is locked" : "Write a message..."}
            className="flex-1 border-border"
            disabled={conversation.isLocked}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !conversation.isLocked) {
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage} 
            size="sm"
            className="bg-primary hover:bg-primary/90 rounded-full px-4 py-2"
            disabled={conversation.isLocked}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
