import { Department, ChildGroup } from "@/types/groups";
import { mockChildren } from "./mockChildren";

const blåbärGroups: ChildGroup[] = [
  {
    id: "group-1",
    name: "Blå",
    department: "Blåbär",
    fullName: "Blåbär-Blå",
    children: ["child-1", "child-2", "child-3", "child-4", "child-5"],
    createdBy: "Ingrid Bergman",
    createdAt: new Date(2024, 0, 15),
    color: "#3b82f6"
  },
  {
    id: "group-2",
    name: "Grön",
    department: "Blåbär",
    fullName: "Blåbär-Grön",
    children: ["child-6", "child-7", "child-8", "child-9", "child-10"],
    createdBy: "Astrid Lindgren",
    createdAt: new Date(2024, 0, 15),
    color: "#10b981"
  },
];

const lingonGroups: ChildGroup[] = [
  {
    id: "group-3",
    name: "Röd",
    department: "Lingon",
    fullName: "Lingon-Röd",
    children: ["child-11", "child-12", "child-13", "child-14"],
    createdBy: "Selma Lagerlöf",
    createdAt: new Date(2024, 1, 10),
    color: "#ef4444"
  },
  {
    id: "group-4",
    name: "Gul",
    department: "Lingon",
    fullName: "Lingon-Gul",
    children: ["child-15", "child-16", "child-17", "child-18"],
    createdBy: "Astrid Lindgren",
    createdAt: new Date(2024, 1, 10),
    color: "#eab308"
  },
];

const odonGroups: ChildGroup[] = [
  {
    id: "group-5",
    name: "Lila",
    department: "Odon",
    fullName: "Odon-Lila",
    children: ["child-19", "child-20", "child-21"],
    createdBy: "Pippi Långstrump",
    createdAt: new Date(2024, 2, 5),
    color: "#a855f7"
  },
  {
    id: "group-6",
    name: "Orange",
    department: "Odon",
    fullName: "Odon-Orange",
    children: ["child-22", "child-23", "child-24"],
    createdBy: "Pippi Långstrump",
    createdAt: new Date(2024, 2, 5),
    color: "#f97316"
  },
];

const vildhallonGroups: ChildGroup[] = [
  {
    id: "group-7",
    name: "Rosa",
    department: "Vildhallon",
    fullName: "Vildhallon-Rosa",
    children: ["child-25", "child-26", "child-27"],
    createdBy: "Barbro Lindgren",
    createdAt: new Date(2024, 3, 12),
    color: "#ec4899"
  },
  {
    id: "group-8",
    name: "Turkos",
    department: "Vildhallon",
    fullName: "Vildhallon-Turkos",
    children: ["child-28", "child-29", "child-30"],
    createdBy: "Barbro Lindgren",
    createdAt: new Date(2024, 3, 12),
    color: "#06b6d4"
  },
];

export const mockDepartments: Department[] = [
  {
    id: "dept-1",
    name: "Blåbär",
    unit: "Kaninerna",
    groups: blåbärGroups,
    children: mockChildren.filter(c => c.department === "Blåbär"),
  },
  {
    id: "dept-2",
    name: "Lingon",
    unit: "Kaninerna",
    groups: lingonGroups,
    children: mockChildren.filter(c => c.department === "Lingon"),
  },
  {
    id: "dept-3",
    name: "Odon",
    unit: "Ekorrarna",
    groups: odonGroups,
    children: mockChildren.filter(c => c.department === "Odon"),
  },
  {
    id: "dept-4",
    name: "Vildhallon",
    unit: "Ekorrarna",
    groups: vildhallonGroups,
    children: mockChildren.filter(c => c.department === "Vildhallon"),
  },
];

// Flattened array av alla grupper för enkel access
export const mockGroups: ChildGroup[] = mockDepartments.flatMap(dept => dept.groups);
