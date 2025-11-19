import { useState, useEffect } from 'react';
import { Conversation } from '../types';
import { 
  sortConversationsByLatestMessage, 
  countTotalUnreadMessages, 
  markConversationAsRead,
  saveConversationsToStorage,
  loadConversationsFromStorage,
  updateUnreadMessagesCount
} from '../utils/conversationUtils';
import {
  createMessage,
  addParticipantToConversation,
  removeParticipantFromConversation,
  leaveConversation as leaveConversationUtil
} from '../utils/messageOperations';

export const useConversations = (initialConversations: Conversation[]) => {
  // Initialize state with localStorage or sorted initial conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => 
    loadConversationsFromStorage(initialConversations)
  );
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(() => 
    conversations[0]
  );

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    saveConversationsToStorage(conversations);
  }, [conversations]);

  // Sort conversations whenever they change
  useEffect(() => {
    const sortedConversations = sortConversationsByLatestMessage(conversations);
    setConversations(sortedConversations);
  }, [conversations]);

  // Calculate total unread messages whenever conversations change
  useEffect(() => {
    const totalUnread = countTotalUnreadMessages(conversations);
    console.log("Updating total unread messages:", totalUnread);
    updateUnreadMessagesCount(totalUnread);
  }, [conversations]);

  // Listen for mark all as read events
  useEffect(() => {
    const handleMarkAsRead = (event: CustomEvent) => {
      const { tabName } = event.detail;
      
      let convsToUpdate: Conversation[] = [];
      
      // Determine which conversations to mark as read based on the tab
      if (tabName === "All") {
        convsToUpdate = [...conversations];
      } else if (tabName === "Guardians") {
        // For guardians tab, we consider "external" conversations
        convsToUpdate = conversations.filter(conv => 
          !conv.participants.some(p => p.includes("Teacher") || p.includes("Staff"))
        );
      } else if (tabName === "Staff") {
        // For staff tab, we consider "internal" conversations
        convsToUpdate = conversations.filter(conv => 
          conv.participants.some(p => p.includes("Teacher") || p.includes("Staff"))
        );
      }
      
      // Mark all messages in the filtered conversations as read
      const updatedConversations = conversations.map(conv => {
        if (convsToUpdate.some(c => c.id === conv.id)) {
          return markConversationAsRead(conv);
        }
        return conv;
      });
      
      setConversations(updatedConversations);
      
      // If the selected conversation was updated, update it too
      if (selectedConversation && convsToUpdate.some(c => c.id === selectedConversation.id)) {
        setSelectedConversation(markConversationAsRead(selectedConversation));
      }
    };

    // Add event listener for marking messages as read
    window.addEventListener('markMessagesAsRead', handleMarkAsRead as EventListener);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('markMessagesAsRead', handleMarkAsRead as EventListener);
    };
  }, [conversations, selectedConversation]);

  // Handle selecting a conversation
  const handleConversationSelect = (conversation: Conversation) => {
    const updatedConversation = markConversationAsRead(conversation);
    setSelectedConversation(updatedConversation);
    setConversations(conversations.map(conv => 
      conv.id === conversation.id ? updatedConversation : conv
    ));
  };

  // Calculate total unread messages
  const totalUnreadMessages = countTotalUnreadMessages(conversations);

  // Send a message in the selected conversation
  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    const message = createMessage(content, "You");
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, message],
      lastMessage: content
    };

    setConversations(conversations.map(conv => 
      conv.id === selectedConversation.id ? updatedConversation : conv
    ));
    setSelectedConversation(updatedConversation);
  };

  // Add participant to a conversation
  const addParticipant = (conversationId: number, participant: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const updatedConversation = addParticipantToConversation(conversation, participant);
    
    setConversations(conversations.map(conv => 
      conv.id === conversationId ? updatedConversation : conv
    ));
    
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(updatedConversation);
    }
  };

  // Remove participant from a conversation
  const removeParticipant = (conversationId: number, participant: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const updatedConversation = removeParticipantFromConversation(conversation, participant);
    
    setConversations(conversations.map(conv => 
      conv.id === conversationId ? updatedConversation : conv
    ));
    
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(updatedConversation);
    }
  };

  // Leave a conversation
  const leaveConversation = (conversationId: number, participant: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const updatedConversation = leaveConversationUtil(conversation, participant);
    
    setConversations(conversations.map(conv => 
      conv.id === conversationId ? updatedConversation : conv
    ));
    
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(updatedConversation);
    }
  };

  return {
    conversations,
    selectedConversation,
    totalUnreadMessages,
    handleConversationSelect,
    handleSendMessage,
    addParticipant,
    removeParticipant,
    leaveConversation
  };
};
