import { EventCategory } from "@/types/administration";

export const getCategoryColor = (category: EventCategory): string => {
  const colors = {
    [EventCategory.CLOSURE]: '#ef4444',
    [EventCategory.WARNING]: '#f59e0b',
    [EventCategory.EXTERNAL]: '#10b981',
    [EventCategory.INTERNAL]: '#3b82f6',
  };
  return colors[category];
};

export const getCategoryBgClass = (category: EventCategory): string => {
  const classes = {
    [EventCategory.CLOSURE]: 'bg-red-500',
    [EventCategory.WARNING]: 'bg-amber-500',
    [EventCategory.EXTERNAL]: 'bg-green-500',
    [EventCategory.INTERNAL]: 'bg-blue-500',
  };
  return classes[category];
};
