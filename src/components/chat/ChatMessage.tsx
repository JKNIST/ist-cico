interface ChatMessageProps {
  sender: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  type?: 'system';
}

export const ChatMessage = ({ sender, content, timestamp, isCurrentUser, type }: ChatMessageProps) => {
  if (type === 'system') {
    return (
      <div className="flex justify-center">
        <div className="bg-muted px-4 py-2 rounded-full text-sm text-muted-foreground">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[85%]`}>
        {!isCurrentUser && (
          <div className="w-8 h-8 rounded-full bg-orange-300 flex-shrink-0 mt-1"></div>
        )}
        <div>
          <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
            <span className="text-sm text-muted-foreground mb-1">{sender}</span>
            <div
              className={`rounded-lg px-4 py-2 ${
                isCurrentUser 
                  ? 'bg-chat-message-own text-foreground' 
                  : 'bg-background border border-border text-foreground'
              }`}
            >
              <p className="whitespace-pre-wrap">{content}</p>
            </div>
            <span className="text-xs text-muted-foreground mt-1">{timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
