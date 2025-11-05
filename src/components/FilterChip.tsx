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
  red: 'border-red-500 text-red-700 bg-red-50 hover:bg-red-100',
  amber: 'border-amber-500 text-amber-700 bg-amber-50 hover:bg-amber-100',
  green: 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100',
  blue: 'border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100',
};

const activeColorClasses = {
  red: 'border-red-500 bg-red-500 text-white hover:bg-red-600',
  amber: 'border-amber-500 bg-amber-500 text-white hover:bg-amber-600',
  green: 'border-green-500 bg-green-500 text-white hover:bg-green-600',
  blue: 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600',
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
