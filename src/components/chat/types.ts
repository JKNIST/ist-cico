import { Message, Conversation } from "@/features/chat/types";

export interface ConversationListProps {
  conversations: Conversation[];
  departmentConversations?: Conversation[];
  selectedConversation: Conversation;
  onConversationSelect: (conversation: Conversation) => void;
  onNewMessageClick?: () => void;
  totalUnreadMessages?: number;
  showDepartments?: boolean;
  isDepartmentView?: boolean;
}

export interface DepartmentSection {
  name: string;
  conversations: Conversation[];
}
