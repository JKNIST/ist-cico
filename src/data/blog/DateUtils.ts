import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

/**
 * Formaterar ett datum till relativ tid (t.ex. "för 3 dagar sedan")
 */
export function formatRelativeDate(date: string): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: sv,
  });
}

/**
 * Skapar ett datum X dagar i framtiden (för schemalagda inlägg)
 */
export function createFutureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
}

/**
 * Skapar ett datum X dagar i det förflutna
 */
export function createPastDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

/**
 * Kontrollerar om ett datum är i framtiden
 */
export function isFutureDate(date: string): boolean {
  return new Date(date) > new Date();
}
