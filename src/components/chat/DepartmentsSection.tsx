import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DepartmentSection } from "./DepartmentSection";
import { DepartmentSection as DepartmentSectionType } from "./types";
import { Conversation } from "@/features/chat/types";

interface DepartmentsSectionProps {
  departments: DepartmentSectionType[];
  departmentConversations: Conversation[];
  expandedDepartments: string[];
  toggleDepartment: (departmentName: string) => void;
  isDepartmentSectionExpanded: boolean;
  toggleDepartmentSection: () => void;
  selectedConversation: Conversation;
  onConversationSelect: (conversation: Conversation) => void;
}

export const DepartmentsSection = ({
  departments,
  departmentConversations,
  expandedDepartments,
  toggleDepartment,
  isDepartmentSectionExpanded,
  toggleDepartmentSection,
  selectedConversation,
  onConversationSelect,
}: DepartmentsSectionProps) => {
  // Calculate departmentUnreadCount
  const departmentUnreadCount = departmentConversations
    ? departmentConversations.reduce((total, conv) => total + conv.messages.filter(msg => !msg.isRead).length, 0)
    : 0;

  return (
    <div className="border-b">
      <button
        onClick={toggleDepartmentSection}
        className="w-full text-left px-4 py-3 hover:bg-muted flex justify-between items-center"
      >
        <span className="font-medium">Avdelningschattar</span>
        <div className="flex items-center gap-2">
          {departmentUnreadCount > 0 && (
            <Badge variant="secondary" className="bg-chat-badge text-white min-w-[20px] h-5">
              {departmentUnreadCount}
            </Badge>
          )}
          {isDepartmentSectionExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>
      {isDepartmentSectionExpanded && (
        <div>
          {departments.map((dept) => (
            <DepartmentSection
              key={dept.name}
              department={dept}
              expandedDepartments={expandedDepartments}
              toggleDepartment={toggleDepartment}
              selectedConversation={selectedConversation}
              onConversationSelect={onConversationSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
