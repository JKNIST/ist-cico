import { useMemo } from 'react';
import { Conversation } from '../types';
import { staffMembers } from '@/components/staff/types';

interface ConversationFilters {
  externalConversations: Conversation[];
  internalConversations: Conversation[];
  departmentConversations: Conversation[];
  externalUnreadCount: number;
  internalUnreadCount: number;
  departmentUnreadCount: number;
}

export const useConversationFilters = (conversations: Conversation[]): ConversationFilters => {
  return useMemo(() => {
    // Create a Set of staff names for efficient lookup
    const staffNames = new Set(staffMembers.map(member => member.name));

    // Helper function to check if a participant is a staff member
    const isStaffMember = (participant: string) => {
      // First check if the participant is in our staffMembers list
      if (staffNames.has(participant)) {
        return true;
      }

      // If not found in staffMembers, check by role indicators
      const normalizedParticipant = participant.toLowerCase();
      const staffIndicators = [
        'teacher', 'support', 'leader', 'team', 'it',
        'lärare', 'pedagog', 'rektor', 'admin', 'chef',
        'assistent', 'koordinator', 'mentor', 'staff'
      ];

      return staffIndicators.some(indicator => normalizedParticipant.includes(indicator));
    };

    // Helper function to check if a participant is a guardian
    const isGuardian = (participant: string) => 
      participant.toLowerCase().includes('guardian') || 
      participant.toLowerCase().includes('parent') ||
      participant.toLowerCase().includes('vårdnadshavare');

    // Helper function to check if title represents an information post or group event rather than a one-to-one conversation
    const isInformationOrGroupEvent = (title: string) => {
      const excludeKeywords = [
        'information', 'info', 'material', 'program', 'schema', 'matte', 'matematik',
        'föräldramöte', 'möte', 'utomhusaktiviteter', 'aktivitet', 'utflykt', 'event',
        'grupp', 'group', 'klass', 'class', 'alla', 'all', 'föreläsning', 'workshop'
      ];
      return excludeKeywords.some(keyword => title.toLowerCase().includes(keyword));
    };

    // Helper function to check if conversation is likely a one-to-one guardian chat
    const isOneToOneGuardianChat = (conv: Conversation) => {
      // Must have exactly one guardian
      const guardianCount = conv.participants.filter(isGuardian).length;
      if (guardianCount !== 1) return false;
      
      // Should have student's name in title or be about a specific student
      const hasStudentIndicator = /\w+'s Guardian|\w+'s Parent|Guardian of \w+|Parent of \w+/.test(
        conv.participants.join(' ')
      );
      
      return hasStudentIndicator;
    };

    // Department names
    const departmentNames = ['blåbär', 'lingon', 'odon', 'vildhallon'];

    // Filter department conversations (staff from one department and a guardian to one specific child)
    const departmentConversations = conversations.filter(conv => {
      // Check if there's a guardian in the conversation
      const hasGuardian = conv.participants.some(isGuardian);
      if (!hasGuardian) return false;
      
      // Skip information posts and group events
      if (isInformationOrGroupEvent(conv.title)) return false;
      
      // Ensure this is a one-to-one guardian chat
      if (!isOneToOneGuardianChat(conv)) return false;
      
      // Count staff members from each department
      const departmentStaffCount = departmentNames.map(dept => {
        return conv.participants.filter(p => 
          p.toLowerCase().includes(dept.toLowerCase()) && isStaffMember(p)
        ).length;
      });
      
      // Check if there's at least one department with staff members
      const hasDepartmentStaff = departmentStaffCount.some(count => count >= 1);
      
      return hasDepartmentStaff;
    });

    // Get IDs of department conversations to exclude them
    const departmentIds = new Set(departmentConversations.map(conv => conv.id));

    // Filter external conversations (guardian conversations, excluding department and group chats)
    const externalConversations = conversations.filter(conv => 
      !departmentIds.has(conv.id) && 
      conv.participants.some(isGuardian)
    );

    // Get IDs of external conversations
    const externalIds = new Set(externalConversations.map(conv => conv.id));

    // Filter internal conversations (staff-only, excluding those already in other categories)
    const internalConversations = conversations.filter(conv => {
      // Skip if conversation is already in another category
      if (departmentIds.has(conv.id) || externalIds.has(conv.id)) {
        return false;
      }

      // Check if there are any guardians in the conversation
      const hasGuardians = conv.participants.some(isGuardian);
      
      // Check if at least one participant is a staff member
      const hasStaffMember = conv.participants.some(isStaffMember);

      // Internal conversations should have at least one staff member and no guardians
      return hasStaffMember && !hasGuardians;
    });

    // Calculate unread messages for each tab
    const externalUnreadCount = externalConversations.reduce(
      (total, conv) => total + conv.messages.filter(msg => !msg.isRead).length,
      0
    );

    const internalUnreadCount = internalConversations.reduce(
      (total, conv) => total + conv.messages.filter(msg => !msg.isRead).length,
      0
    );

    const departmentUnreadCount = departmentConversations.reduce(
      (total, conv) => total + conv.messages.filter(msg => !msg.isRead).length,
      0
    );

    return {
      externalConversations,
      internalConversations,
      departmentConversations,
      externalUnreadCount,
      internalUnreadCount,
      departmentUnreadCount
    };
  }, [conversations]);
};
