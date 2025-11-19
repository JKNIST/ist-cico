import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { ConversationsSection } from "./ConversationsSection";
import { DepartmentsSection } from "./DepartmentsSection";
import { ConversationListProps, DepartmentSection } from "./types";

export const ConversationList = ({
  conversations,
  departmentConversations = [],
  selectedConversation,
  onConversationSelect,
  onNewMessageClick,
  totalUnreadMessages = 0,
  showDepartments = false,
  isDepartmentView = false,
}: ConversationListProps) => {
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([]);
  const [isDepartmentSectionExpanded, setIsDepartmentSectionExpanded] = useState(true);

  const toggleDepartment = (departmentName: string) => {
    setExpandedDepartments(prev => 
      prev.includes(departmentName) 
        ? prev.filter(name => name !== departmentName)
        : [...prev, departmentName]
    );
  };

  const toggleDepartmentSection = () => {
    setIsDepartmentSectionExpanded(!isDepartmentSectionExpanded);
  };

  // Create department sections
  const departments: DepartmentSection[] = [
    { 
      name: "Blåbär", 
      conversations: departmentConversations.filter(conv => 
        conv.participants.some(p => p.toLowerCase().includes("blåbär".toLowerCase()))
      ) 
    },
    { 
      name: "Lingon", 
      conversations: departmentConversations.filter(conv => 
        conv.participants.some(p => p.toLowerCase().includes("lingon".toLowerCase()))
      ) 
    },
    { 
      name: "Odon", 
      conversations: departmentConversations.filter(conv => 
        conv.participants.some(p => p.toLowerCase().includes("odon".toLowerCase()))
      ) 
    },
    { 
      name: "Vildhallon", 
      conversations: departmentConversations.filter(conv => 
        conv.participants.some(p => p.toLowerCase().includes("vildhallon".toLowerCase()))
      ) 
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative">
        <ScrollArea className="absolute inset-0">
          {showDepartments && departmentConversations && departmentConversations.length > 0 && (
            <DepartmentsSection
              departments={departments}
              departmentConversations={departmentConversations}
              expandedDepartments={expandedDepartments}
              toggleDepartment={toggleDepartment}
              isDepartmentSectionExpanded={isDepartmentSectionExpanded}
              toggleDepartmentSection={toggleDepartmentSection}
              selectedConversation={selectedConversation}
              onConversationSelect={onConversationSelect}
            />
          )}
          
          {showDepartments && <div className="px-4 py-3 font-medium">Övriga meddelanden</div>}
          
          <ConversationsSection
            conversations={conversations}
            selectedConversation={selectedConversation}
            onConversationSelect={onConversationSelect}
            isDepartmentView={isDepartmentView}
          />
        </ScrollArea>
      </div>
    </div>
  );
};
