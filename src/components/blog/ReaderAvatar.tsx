import { cn } from "@/lib/utils";

interface ReaderAvatarProps {
  name: string;
  className?: string;
}

// Generate a consistent color based on the name
const avatarColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-amber-500",
];

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

export function ReaderAvatar({ name, className }: ReaderAvatarProps) {
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  return (
    <div
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium",
        bgColor,
        className
      )}
    >
      {initials}
    </div>
  );
}
