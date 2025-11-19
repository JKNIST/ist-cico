import { useState, useEffect } from "react";
import { ChatArea } from "@/components/chat/ChatArea";
import { NewMessageModal } from "@/components/chat/NewMessageModal";
import { useConversations } from "@/features/chat/hooks/useConversations";
import { ChatTabs } from "@/features/chat/components/ChatTabs";
import { Recipient } from "@/features/chat/types";
import { initialConversations } from "@/features/chat/data/mockData";
import { useConversationFilters } from "@/features/chat/hooks/useConversationFilters";
import { toast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { useDepartmentFilter } from "@/contexts/DepartmentFilterContext";

const Chat = () => {
  const { selectedDepartments } = useDepartmentFilter();
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<'external' | 'internal'>('external');
  const location = useLocation();

  const {
    conversations,
    selectedConversation,
    handleConversationSelect,
    handleSendMessage,
    addParticipant,
    removeParticipant,
    leaveConversation
  } = useConversations(initialConversations);

  // Filter conversations based on selected departments
  const filteredConversations = conversations.filter(conv => {
    if (selectedDepartments.length === 0) return true;
    return conv.department && selectedDepartments.includes(conv.department);
  });

  const {
    externalConversations,
    internalConversations,
    departmentConversations,
    externalUnreadCount,
    internalUnreadCount,
    departmentUnreadCount
  } = useConversationFilters(filteredConversations);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const conversationId = searchParams.get('conversationId');
    
    if (conversationId) {
      const convId = parseInt(conversationId);
      const conversation = conversations.find(c => c.id === convId);
      if (conversation) {
        handleConversationSelect(conversation);
        
        if (conversation.participants.some(p => p.includes("Teacher") || p.includes("Staff"))) {
          setCurrentTab('internal');
        } else {
          setCurrentTab('external');
        }
      }
    }
  }, [location.search, conversations]);

  const handleNewMessageSend = (recipients: { students: Recipient[]; staff: string[] }) => {
    toast({
      title: "New message created",
      description: `Message sent to ${recipients.students.length} students and ${recipients.staff.length} staff members`,
    });
    setIsNewMessageModalOpen(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <div className="w-80 border-r bg-background flex flex-col h-full min-w-[320px]">
        <ChatTabs 
          externalConversations={externalConversations}
          internalConversations={internalConversations}
          departmentConversations={departmentConversations}
          selectedConversation={selectedConversation}
          handleConversationSelect={handleConversationSelect}
          handleNewMessageClick={() => setIsNewMessageModalOpen(true)}
          externalUnreadCount={externalUnreadCount}
          internalUnreadCount={internalUnreadCount}
          departmentUnreadCount={departmentUnreadCount}
          onTabChange={setCurrentTab}
          currentTab={currentTab}
        />
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <ChatArea
          conversation={selectedConversation}
          onSendMessage={handleSendMessage}
          onAddParticipant={addParticipant}
          onRemoveParticipant={removeParticipant}
          onLeaveConversation={leaveConversation}
        />
      </div>
      <NewMessageModal
        isOpen={isNewMessageModalOpen}
        onClose={() => setIsNewMessageModalOpen(false)}
        onSend={handleNewMessageSend}
        currentTab={currentTab}
      />
    </div>
  );
};

export default Chat;
