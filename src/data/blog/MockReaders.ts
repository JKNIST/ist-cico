import { Reader } from "@/types/blog";

export const mockGuardians: Omit<Reader, "id" | "readAt">[] = [
  { name: "Anna Andersson", role: "guardian", childName: "Emma" },
  { name: "Erik Eriksson", role: "guardian", childName: "Emma" },
  { name: "Maria Nilsson", role: "guardian", childName: "Lucas" },
  { name: "Johan Svensson", role: "guardian", childName: "Lucas" },
  { name: "Sofia Johansson", role: "guardian", childName: "Olivia" },
  { name: "Anders Karlsson", role: "guardian", childName: "Olivia" },
  { name: "Emma Larsson", role: "guardian", childName: "William" },
  { name: "Peter Olsson", role: "guardian", childName: "William" },
  { name: "Lisa Berg", role: "guardian", childName: "Elsa" },
  { name: "Magnus Lindgren", role: "guardian", childName: "Elsa" },
  { name: "Karin Petersson", role: "guardian", childName: "Oscar" },
  { name: "Thomas Hansson", role: "guardian", childName: "Oscar" },
  { name: "Helena Gustafsson", role: "guardian", childName: "Alice" },
  { name: "Mikael Forsberg", role: "guardian", childName: "Alice" },
  { name: "Sara Lundberg", role: "guardian", childName: "Hugo" },
  { name: "Daniel Sjöberg", role: "guardian", childName: "Hugo" },
];

export const mockStaff: Omit<Reader, "id" | "readAt">[] = [
  { name: "Ingrid Bergman", role: "staff" },
  { name: "Astrid Lindgren", role: "staff" },
  { name: "Greta Thunberg", role: "staff" },
  { name: "Zlatan Ibrahimović", role: "staff" },
  { name: "Alfred Nobel", role: "staff" },
  { name: "Björn Borg", role: "staff" },
  { name: "Annika Sörenstam", role: "staff" },
  { name: "Ingvar Kamprad", role: "staff" },
];
