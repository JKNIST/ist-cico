import { Conversation, Message } from "../types";

// Sort conversations by the latest message timestamp
export const sortConversationsByLatestMessage = (conversations: Conversation[]): Conversation[] => {
  return [...conversations].sort((a, b) => {
    // Get the last message timestamp for each conversation
    const aTimestamp = a.messages.length > 0 ? 
      new Date(a.messages[a.messages.length - 1].timestamp).getTime() : 0;
    const bTimestamp = b.messages.length > 0 ? 
      new Date(b.messages[b.messages.length - 1].timestamp).getTime() : 0;
    
    // Sort in descending order (latest first)
    return bTimestamp - aTimestamp;
  });
};

// Count total unread messages across all conversations
export const countTotalUnreadMessages = (conversations: Conversation[]): number => {
  return conversations.reduce((total, conv) => 
    total + conv.messages.filter(msg => !msg.isRead).length, 0
  );
};

// Create a system message
export const createSystemMessage = (content: string): Message => {
  return {
    id: Date.now(),
    sender: "System",
    content,
    timestamp: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
    isRead: true,
    type: 'system'
  };
};

// Mark all messages in a conversation as read
export const markConversationAsRead = (conversation: Conversation): Conversation => {
  return {
    ...conversation,
    messages: conversation.messages.map(msg => ({ ...msg, isRead: true }))
  };
};

// Local storage operations
export const saveConversationsToStorage = (conversations: Conversation[]): void => {
  localStorage.setItem('conversations', JSON.stringify(conversations));
};

export const loadConversationsFromStorage = (defaultConversations: Conversation[]): Conversation[] => {
  const savedConversations = localStorage.getItem('conversations');
  return savedConversations ? JSON.parse(savedConversations) : sortConversationsByLatestMessage(defaultConversations);
};

// Update unread count in localStorage and dispatch event
export const updateUnreadMessagesCount = (count: number): void => {
  localStorage.setItem('unreadMessages', count.toString());
  window.dispatchEvent(new CustomEvent('unreadMessagesUpdated', { 
    detail: { count }
  }));
};
