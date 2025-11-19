export interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type?: 'system';
}

export interface Conversation {
  id: number;
  title: string;
  lastMessage: string;
  participants: string[];
  messages: Message[];
  student?: string;
  isLocked?: boolean;
}

export interface Recipient {
  id: string;
  name: string;
  subtitle?: string;
  class: string;
}
