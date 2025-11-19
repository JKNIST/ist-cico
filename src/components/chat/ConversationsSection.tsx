import { ConversationItem } from "./ConversationItem";
import { Conversation } from "@/features/chat/types";

interface ConversationsSectionProps {
  conversations: Conversation[];
  selectedConversation: Conversation;
  onConversationSelect: (conversation: Conversation) => void;
  isDepartmentView: boolean;
}

export const ConversationsSection = ({
  conversations,
  selectedConversation,
  onConversationSelect,
  isDepartmentView,
}: ConversationsSectionProps) => {
  return (
    <>
      {conversations.map((conversation) => {
        // Check if conversation has unread messages
        const hasUnreadMessages = conversation.messages.some(message => !message.isRead);
        
        return (
          <ConversationItem
            key={conversation.id}
            title={conversation.title}
            lastMessage={conversation.lastMessage}
            time={conversation.messages.length > 0 ? 
              conversation.messages[conversation.messages.length - 1].timestamp : undefined}
            isActive={selectedConversation?.id === conversation.id}
            onClick={() => onConversationSelect(conversation)}
            department={isDepartmentView ? conversation.participants.find(p => 
              p.toLowerCase().includes("blåbär") || 
              p.toLowerCase().includes("lingon") || 
              p.toLowerCase().includes("odon") || 
              p.toLowerCase().includes("vildhallon")
            ) : undefined}
            participants={conversation.participants}
            hasUnreadMessages={hasUnreadMessages}
          />
        );
      })}
    </>
  );
};
