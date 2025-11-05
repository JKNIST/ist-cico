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
  red: 'border-calendar-closure-foreground/30 text-calendar-closure-foreground bg-calendar-closure hover:bg-calendar-closure/80',
  amber: 'border-calendar-warning-foreground/30 text-calendar-warning-foreground bg-calendar-warning hover:bg-calendar-warning/80',
  green: 'border-calendar-external-foreground/30 text-calendar-external-foreground bg-calendar-external hover:bg-calendar-external/80',
  blue: 'border-calendar-internal-foreground/30 text-calendar-internal-foreground bg-calendar-internal hover:bg-calendar-internal/80',
};

const activeColorClasses = {
  red: 'border-calendar-closure-foreground bg-calendar-closure-foreground text-white hover:opacity-90',
  amber: 'border-calendar-warning-foreground bg-calendar-warning-foreground text-white hover:opacity-90',
  green: 'border-calendar-external-foreground bg-calendar-external-foreground text-white hover:opacity-90',
  blue: 'border-calendar-internal-foreground bg-calendar-internal-foreground text-white hover:opacity-90',
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
