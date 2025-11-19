import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupAvatarProps {
  participants: string[];
  className?: string;
}

export const GroupAvatar = ({ participants, className }: GroupAvatarProps) => {
  const count = participants.length;
  
  // Define colors for the avatar backgrounds
  const avatarColors = [
    "bg-orange-300", "bg-blue-300", "bg-green-300", 
    "bg-purple-300", "bg-pink-300", "bg-yellow-300"
  ];

  if (count === 0) {
    return (
      <Avatar className={cn("h-10 w-10", className)}>
        <AvatarFallback className="bg-muted">
          <UsersIcon className="h-5 w-5 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
    );
  }

  if (count === 1) {
    return (
      <Avatar className={cn("h-10 w-10", className)}>
        <AvatarImage src={`https://source.unsplash.com/random/300x300?portrait&${participants[0]}`} />
        <AvatarFallback className={cn("text-white", avatarColors[0])}>
          {participants[0].charAt(0)}
        </AvatarFallback>
      </Avatar>
    );
  }

  if (count === 2) {
    return (
      <div className={cn("relative", className)}>
        <Avatar className="h-10 w-10">
          <AvatarImage src={`https://source.unsplash.com/random/300x300?portrait&${participants[0]}`} />
          <AvatarFallback className={cn("text-white", avatarColors[0])}>
            {participants[0].charAt(0)}
          </AvatarFallback>
        </Avatar>
        <Avatar className="h-6 w-6 absolute -bottom-1 -right-1 border-2 border-background">
          <AvatarImage src={`https://source.unsplash.com/random/300x300?portrait&${participants[1]}`} />
          <AvatarFallback className={cn("text-white", avatarColors[1])}>
            {participants[1].charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  // More than 2 participants
  return (
    <div className={cn("relative", className)}>
      <div className="flex -space-x-2">
        <Avatar className="h-8 w-8 border-2 border-background z-30">
          <AvatarImage src={`https://source.unsplash.com/random/300x300?portrait&${participants[0]}`} />
          <AvatarFallback className={cn("text-white", avatarColors[0])}>
            {participants[0].charAt(0)}
          </AvatarFallback>
        </Avatar>
        <Avatar className="h-8 w-8 border-2 border-background z-20">
          <AvatarImage src={`https://source.unsplash.com/random/300x300?portrait&${participants[1]}`} />
          <AvatarFallback className={cn("text-white", avatarColors[1])}>
            {participants[1].charAt(0)}
          </AvatarFallback>
        </Avatar>
        {count > 2 && (
          <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center z-10">
            <span className="text-xs font-medium text-muted-foreground">+{count - 2}</span>
          </div>
        )}
      </div>
    </div>
  );
};
