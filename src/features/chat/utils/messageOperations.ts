import { Conversation, Message } from "../types";
import { createSystemMessage } from "./conversationUtils";

// Create a new message
export const createMessage = (content: string, sender: string): Message => {
  return {
    id: Date.now(),
    sender,
    content,
    timestamp: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
    isRead: true
  };
};

// Add a participant to a conversation
export const addParticipantToConversation = (
  conversation: Conversation,
  participant: string
): Conversation => {
  if (conversation.participants.includes(participant)) {
    return conversation;
  }

  const systemMessage = createSystemMessage(`${participant} has joined the conversation`);

  return {
    ...conversation,
    participants: [...conversation.participants, participant],
    messages: [...conversation.messages, systemMessage],
    lastMessage: systemMessage.content
  };
};

// Remove a participant from a conversation
export const removeParticipantFromConversation = (
  conversation: Conversation,
  participant: string
): Conversation => {
  if (!conversation.participants.includes(participant)) {
    return conversation;
  }

  const systemMessage = createSystemMessage(`${participant} has been removed from the conversation`);

  return {
    ...conversation,
    participants: conversation.participants.filter(p => p !== participant),
    messages: [...conversation.messages, systemMessage],
    lastMessage: systemMessage.content
  };
};

// Leave a conversation (participant leaves voluntarily)
export const leaveConversation = (
  conversation: Conversation,
  participant: string
): Conversation => {
  if (!conversation.participants.includes(participant)) {
    return conversation;
  }

  const systemMessage = createSystemMessage(`${participant} has left the conversation`);

  return {
    ...conversation,
    participants: conversation.participants.filter(p => p !== participant),
    messages: [...conversation.messages, systemMessage],
    lastMessage: systemMessage.content
  };
};
