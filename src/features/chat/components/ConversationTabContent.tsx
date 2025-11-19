import { TabsContent } from "@/components/ui/tabs";
import { ConversationList } from "@/components/chat/ConversationList";
import { Conversation } from "@/features/chat/types";
import { MarkAsReadButton } from "./MarkAsReadButton";

interface ConversationTabContentProps {
  value: string;
  tabName: string;
  conversations: Conversation[];
  selectedConversation?: Conversation;
  onConversationSelect: (conversation: Conversation) => void;
  onNewMessageClick: () => void;
  hasUnread: boolean;
  onMarkAllAsRead: (tabName: string) => void;
}

export const ConversationTabContent = ({
  value,
  tabName,
  conversations,
  selectedConversation,
  onConversationSelect,
  onNewMessageClick,
  hasUnread,
  onMarkAllAsRead
}: ConversationTabContentProps) => {
  return (
    <TabsContent value={value} className="mt-0 h-full overflow-auto">
      <MarkAsReadButton 
        hasUnread={hasUnread} 
        tabName={tabName} 
        onClick={onMarkAllAsRead} 
      />
      <ConversationList
        conversations={conversations}
        selectedConversation={selectedConversation}
        onConversationSelect={onConversationSelect}
        onNewMessageClick={onNewMessageClick}
        isDepartmentView={false}
      />
    </TabsContent>
  );
};
