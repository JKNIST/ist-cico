export interface Child {
  id: string;
  name: string;
  initials: string;
  department: string;
  unit: string;
  avatarUrl?: string;
  age?: number;
}

export interface ChildGroup {
  id: string;
  name: string; // e.g., "Blå", "Röd"
  department: string; // e.g., "Blåbär"
  fullName: string; // Auto-generated: "Blåbär-Blå"
  children: string[]; // Array of child IDs
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  color?: string; // Optional: color coding for groups
}

export interface Department {
  id: string;
  name: string;
  unit: string; // e.g., "Kaninerna"
  groups: ChildGroup[];
  children: Child[];
}
