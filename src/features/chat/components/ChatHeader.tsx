import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onNewMessageClick: () => void;
}

export const ChatHeader = ({ onNewMessageClick }: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b flex items-center justify-between bg-background">
      <h2 className="text-lg font-medium text-foreground">Chat</h2>
      <Button 
        onClick={onNewMessageClick}
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-full"
      >
        <PlusCircle className="w-5 h-5" />
      </Button>
    </div>
  );
};
