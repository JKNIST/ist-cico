export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department?: string;
}

export const staffMembers: StaffMember[] = [
  { id: "staff1", name: "Jonas Nilsson", role: "Teacher", department: "Blåbär" },
  { id: "staff2", name: "Maria Larsson", role: "Support Staff", department: "Lingon" },
  { id: "staff3", name: "Anna Svensson", role: "Team Leader", department: "Odon" },
  { id: "staff4", name: "Erik Berg", role: "IT Support" },
  { id: "staff5", name: "Lisa Andersson", role: "Teacher", department: "Vildhallon" },
  { id: "staff6", name: "Karl Pettersson", role: "Support Staff", department: "Blåbär" },
  { id: "staff7", name: "Emma Johansson", role: "Department Head", department: "Lingon" },
  { id: "staff8", name: "Oscar Nilsson", role: "Teacher", department: "Odon" },
  { id: "staff9", name: "Sara Berg", role: "Activity Leader", department: "Vildhallon" },
  { id: "staff10", name: "David Svensson", role: "System Admin" },
  { id: "staff11", name: "Helena Larsson", role: "HR Staff" },
  { id: "staff12", name: "Peter Karlsson", role: "Network Team" },
];
