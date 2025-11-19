import { useState, useEffect } from "react";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { Conversation } from "@/features/chat/types";
import { toast } from "@/hooks/use-toast";
import { ChatHeader } from "./ChatHeader";
import { ChatSearch } from "./ChatSearch";
import { UnreadFilterToggle } from "./UnreadFilterToggle";
import { UnreadTabTrigger } from "./UnreadTabTrigger";
import { ConversationTabContent } from "./ConversationTabContent";

interface ChatTabsProps {
  externalConversations: Conversation[];
  internalConversations: Conversation[];
  departmentConversations: Conversation[];
  selectedConversation?: Conversation;
  handleConversationSelect: (conversation: Conversation) => void;
  handleNewMessageClick: () => void;
  externalUnreadCount: number;
  internalUnreadCount: number;
  departmentUnreadCount: number;
  onTabChange: (value: 'external' | 'internal') => void;
  currentTab: 'external' | 'internal';
}

export const ChatTabs = ({
  externalConversations,
  internalConversations,
  departmentConversations,
  selectedConversation,
  handleConversationSelect,
  handleNewMessageClick,
  externalUnreadCount,
  internalUnreadCount,
  departmentUnreadCount,
  onTabChange,
  currentTab
}: ChatTabsProps) => {
  
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  
  // Track unread status for each tab, updated after mark all as read
  const [hasAllUnread, setHasAllUnread] = useState(
    externalUnreadCount > 0 || internalUnreadCount > 0 || departmentUnreadCount > 0
  );
  const [hasGuardiansUnread, setHasGuardiansUnread] = useState(externalUnreadCount > 0);
  const [hasStaffUnread, setHasStaffUnread] = useState(internalUnreadCount > 0);

  // Update unread status when counts change
  useEffect(() => {
    setHasAllUnread(externalUnreadCount > 0 || internalUnreadCount > 0 || departmentUnreadCount > 0);
    setHasGuardiansUnread(externalUnreadCount > 0);
    setHasStaffUnread(internalUnreadCount > 0);
  }, [externalUnreadCount, internalUnreadCount, departmentUnreadCount]);

  // Filter conversations based on the unread filter
  const filterUnreadConversations = (conversations: Conversation[]) => {
    if (showOnlyUnread) {
      return conversations.filter(conv => 
        conv.messages.some(msg => !msg.isRead)
      );
    }
    return conversations;
  };

  // Apply filter to all conversation lists
  const filteredExternalConversations = filterUnreadConversations(externalConversations);
  const filteredInternalConversations = filterUnreadConversations(internalConversations);
  const allFilteredConversations = filterUnreadConversations([...externalConversations, ...internalConversations]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "external" || value === "internal") {
      onTabChange(value as 'external' | 'internal');
    }
  };

  // New function to handle marking all messages as read in a specific tab
  const handleMarkAllAsRead = (tabName: string) => {
    // Custom event to be handled by the parent component
    window.dispatchEvent(
      new CustomEvent('markMessagesAsRead', { 
        detail: { tabName }
      })
    );
    
    // Update local state for immediate UI feedback
    if (tabName === "All") {
      setHasAllUnread(false);
      setHasGuardiansUnread(false);
      setHasStaffUnread(false);
    } else if (tabName === "Guardians") {
      setHasGuardiansUnread(false);
      // Check if all tabs now have no unread messages
      if (!hasStaffUnread) {
        setHasAllUnread(false);
      }
    } else if (tabName === "Staff") {
      setHasStaffUnread(false);
      // Check if all tabs now have no unread messages
      if (!hasGuardiansUnread) {
        setHasAllUnread(false);
      }
    }
    
    // Show toast notification
    toast({
      title: "Messages marked as read",
      description: `All messages in ${tabName} tab have been marked as read.`,
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader onNewMessageClick={handleNewMessageClick} />
      <ChatSearch />
      <UnreadFilterToggle 
        showOnlyUnread={showOnlyUnread}
        onToggleUnread={setShowOnlyUnread}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full h-full">
        <TabsList className="w-full bg-background p-0 justify-start">
          <UnreadTabTrigger
            value="all"
            activeTab={activeTab}
            hasUnread={hasAllUnread}
          >
            All
          </UnreadTabTrigger>
          <UnreadTabTrigger
            value="guardians"
            activeTab={activeTab}
            hasUnread={hasGuardiansUnread}
          >
            Guardians
          </UnreadTabTrigger>
          <UnreadTabTrigger
            value="staff"
            activeTab={activeTab}
            hasUnread={hasStaffUnread}
          >
            Staff
          </UnreadTabTrigger>
        </TabsList>
        
        <ConversationTabContent
          value="all"
          tabName="All"
          conversations={allFilteredConversations}
          selectedConversation={selectedConversation}
          onConversationSelect={handleConversationSelect}
          onNewMessageClick={handleNewMessageClick}
          hasUnread={hasAllUnread}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
        
        <ConversationTabContent
          value="guardians"
          tabName="Guardians"
          conversations={filteredExternalConversations}
          selectedConversation={selectedConversation}
          onConversationSelect={handleConversationSelect}
          onNewMessageClick={handleNewMessageClick}
          hasUnread={hasGuardiansUnread}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
        
        <ConversationTabContent
          value="staff"
          tabName="Staff"
          conversations={filteredInternalConversations}
          selectedConversation={selectedConversation}
          onConversationSelect={handleConversationSelect}
          onNewMessageClick={handleNewMessageClick}
          hasUnread={hasStaffUnread}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      </Tabs>
    </div>
  );
};
