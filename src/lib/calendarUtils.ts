import { EventCategory } from "@/types/administration";

export const getCategoryColor = (category: EventCategory): string => {
  const colors = {
    [EventCategory.CLOSURE]: 'hsl(var(--calendar-closure-foreground))',
    [EventCategory.WARNING]: 'hsl(var(--calendar-warning-foreground))',
    [EventCategory.EXTERNAL]: 'hsl(var(--calendar-external-foreground))',
    [EventCategory.INTERNAL]: 'hsl(var(--calendar-internal-foreground))',
  };
  return colors[category];
};

export const getCategoryBgClass = (category: EventCategory): string => {
  const classes = {
    [EventCategory.CLOSURE]: 'bg-calendar-closure text-calendar-closure-foreground',
    [EventCategory.WARNING]: 'bg-calendar-warning text-calendar-warning-foreground',
    [EventCategory.EXTERNAL]: 'bg-calendar-external text-calendar-external-foreground',
    [EventCategory.INTERNAL]: 'bg-calendar-internal text-calendar-internal-foreground',
  };
  return classes[category];
};
