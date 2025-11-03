import { Check, Home, MessageSquare, Phone, Info } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

interface ChildCardProps {
  name: string;
  initials: string;
  department: string;
  status: "present" | "absent" | "soon";
  time?: string;
  timeLabel?: string;
  avatarUrl?: string;
  borderColor?: string;
}

export function ChildCard({
  name,
  initials,
  department,
  status,
  time,
  timeLabel = "Hämtas:",
  avatarUrl,
  borderColor,
}: ChildCardProps) {
  const isChecked = status === "present";
  const borderClass = borderColor || (status === "present" ? "border-l-green-500" : status === "absent" ? "border-l-red-500" : "border-l-yellow-500");

  return (
    <Card className={`p-3 border-l-4 ${borderClass} hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground font-medium text-sm">{initials}</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{name}</h3>
          <p className="text-xs text-muted-foreground">{department}</p>

          {time && (
            <div className="flex items-center gap-1 mt-1">
              <Home className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{timeLabel}</span>
              <span className="text-xs font-medium">{time}</span>
            </div>
          )}

          <div className="flex items-center gap-1 mt-2">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Checkbox />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isChecked && (
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
