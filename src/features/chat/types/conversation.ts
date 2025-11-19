import { Message } from "./index";

export interface Conversation {
  id: number;
  title: string;
  lastMessage: string;
  participants: string[];
  messages: Message[];
  isLocked?: boolean;
}

export interface ConversationsState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
}
