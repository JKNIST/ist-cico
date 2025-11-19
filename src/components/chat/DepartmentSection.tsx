import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ConversationItem } from "./ConversationItem";
import { DepartmentSection as DepartmentSectionType } from "./types";
import { Conversation } from "@/features/chat/types";
import { cn } from "@/lib/utils";

interface DepartmentSectionProps {
  department: DepartmentSectionType;
  expandedDepartments: string[];
  toggleDepartment: (departmentName: string) => void;
  selectedConversation: Conversation;
  onConversationSelect: (conversation: Conversation) => void;
}

export const DepartmentSection = ({
  department,
  expandedDepartments,
  toggleDepartment,
  selectedConversation,
  onConversationSelect,
}: DepartmentSectionProps) => {
  // Calculate total number of unread messages for the badge
  const departmentUnreadCount = department.conversations
    .reduce((total, conv) => total + conv.messages.filter(msg => !msg.isRead).length, 0);

  const hasUnreadMessages = departmentUnreadCount > 0;
  const hasConversations = department.conversations.length > 0;

  if (!hasConversations) return null;

  return (
    <div className="border-t">
      <button
        onClick={() => toggleDepartment(department.name)}
        className="w-full text-left px-8 py-2 hover:bg-muted flex justify-between items-center"
      >
        <span className={cn(
          "text-sm",
          hasUnreadMessages ? "font-bold" : "font-medium"
        )}>
          {department.name}
        </span>
        <div className="flex items-center gap-2">
          {hasUnreadMessages && (
            <Badge variant="secondary" className="bg-chat-badge text-white min-w-[20px] h-5">
              {departmentUnreadCount}
            </Badge>
          )}
          {expandedDepartments.includes(department.name) ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>
      {expandedDepartments.includes(department.name) && (
        <div className="bg-muted">
          <div className="space-y-2">
            {department.conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                title={conv.title}
                lastMessage={conv.lastMessage}
                isActive={selectedConversation?.id === conv.id}
                onClick={() => onConversationSelect(conv)}
                department={department.name}
                participants={conv.participants}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
