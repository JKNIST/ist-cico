import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FilterChipProps {
  icon?: ReactNode;
  label: string;
  color?: 'red' | 'amber' | 'green' | 'blue';
  active: boolean;
  onClick: () => void;
}

const colorClasses = {
  red: 'border-calendar-closure bg-calendar-closure/30 text-calendar-closure-foreground hover:bg-calendar-closure/50',
  amber: 'border-calendar-warning bg-calendar-warning/30 text-calendar-warning-foreground hover:bg-calendar-warning/50',
  green: 'border-calendar-external bg-calendar-external/30 text-calendar-external-foreground hover:bg-calendar-external/50',
  blue: 'border-calendar-internal bg-calendar-internal/30 text-calendar-internal-foreground hover:bg-calendar-internal/50',
};

const activeColorClasses = {
  red: 'border-calendar-closure bg-calendar-closure text-calendar-closure-foreground hover:bg-calendar-closure/90',
  amber: 'border-calendar-warning bg-calendar-warning text-calendar-warning-foreground hover:bg-calendar-warning/90',
  green: 'border-calendar-external bg-calendar-external text-calendar-external-foreground hover:bg-calendar-external/90',
  blue: 'border-calendar-internal bg-calendar-internal text-calendar-internal-foreground hover:bg-calendar-internal/90',
};

export function FilterChip({ icon, label, color, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors flex items-center gap-1.5",
        color && active ? activeColorClasses[color] : 
        color && !active ? colorClasses[color] :
        active ? "border-gray-700 bg-gray-700 text-white hover:bg-gray-800" :
        "border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
