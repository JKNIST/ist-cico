export interface StaffSchedule {
  id: string;
  name: string;
  role: string;
  department?: string;
  schedules: {
    [key: string]: { start: string; end: string } | null;
  };
}

export const mockStaffSchedules: StaffSchedule[] = [
  // Blåbär department
  {
    id: "staff1",
    name: "Jonas Nilsson",
    role: "Teacher",
    department: "Blåbär",
    schedules: {
      "0": { start: "07:00", end: "16:00" },
      "1": { start: "07:00", end: "16:00" },
      "2": { start: "07:00", end: "16:00" },
      "3": { start: "07:00", end: "16:00" },
      "4": { start: "07:00", end: "16:00" },
      "5": null,
      "6": null,
    },
  },
  {
    id: "staff6",
    name: "Karl Pettersson",
    role: "Support Staff",
    department: "Blåbär",
    schedules: {
      "0": { start: "08:00", end: "17:00" },
      "1": { start: "08:00", end: "17:00" },
      "2": { start: "08:00", end: "17:00" },
      "3": null,
      "4": { start: "08:00", end: "17:00" },
      "5": null,
      "6": null,
    },
  },
  {
    id: "staff13",
    name: "Maria Bergström",
    role: "Assistant",
    department: "Blåbär",
    schedules: {
      "0": null,
      "1": { start: "09:00", end: "15:00" },
      "2": { start: "09:00", end: "15:00" },
      "3": { start: "09:00", end: "15:00" },
      "4": { start: "09:00", end: "15:00" },
      "5": null,
      "6": null,
    },
  },
  
  // Lingon department
  {
    id: "staff2",
    name: "Maria Larsson",
    role: "Support Staff",
    department: "Lingon",
    schedules: {
      "0": { start: "06:30", end: "15:30" },
      "1": { start: "06:30", end: "15:30" },
      "2": { start: "06:30", end: "15:30" },
      "3": { start: "06:30", end: "15:30" },
      "4": { start: "06:30", end: "15:30" },
      "5": null,
      "6": null,
    },
  },
  {
    id: "staff7",
    name: "Emma Johansson",
    role: "Department Head",
    department: "Lingon",
    schedules: {
      "0": { start: "07:30", end: "16:30" },
      "1": { start: "07:30", end: "16:30" },
      "2": { start: "07:30", end: "16:30" },
      "3": { start: "07:30", end: "16:30" },
      "4": { start: "07:30", end: "16:30" },
      "5": null,
      "6": null,
    },
  },
  {
    id: "staff14",
    name: "Lars Eriksson",
    role: "Teacher",
    department: "Lingon",
    schedules: {
      "0": { start: "08:00", end: "17:00" },
      "1": null,
      "2": { start: "08:00", end: "17:00" },
      "3": { start: "08:00", end: "17:00" },
      "4": { start: "08:00", end: "17:00" },
      "5": null,
      "6": null,
    },
  },
  
  // Odon department
  {
    id: "staff3",
    name: "Anna Svensson",
    role: "Team Leader",
    department: "Odon",
    schedules: {
      "0": { start: "07:00", end: "16:00" },
      "1": { start: "07:00", end: "16:00" },
      "2": { start: "07:00", end: "16:00" },
      "3": { start: "07:00", end: "16:00" },
      "4": { start: "07:00", end: "16:00" },
      "5": null,
      "6": null,
    },
  },
  {
    id: "staff8",
    name: "Oscar Nilsson",
    role: "Teacher",
    department: "Odon",
    schedules: {
      "0": { start: "08:00", end: "17:00" },
      "1": { start: "08:00", end: "17:00" },
      "2": null,
      "3": { start: "08:00", end: "17:00" },
      "4": { start: "08:00", end: "17:00" },
      "5": null,
      "6": null,
    },
  },
  
  // Vildhallon department
  {
    id: "staff5",
    name: "Lisa Andersson",
    role: "Teacher",
    department: "Vildhallon",
    schedules: {
      "0": { start: "06:30", end: "15:30" },
      "1": { start: "06:30", end: "15:30" },
      "2": { start: "06:30", end: "15:30" },
      "3": { start: "06:30", end: "15:30" },
      "4": { start: "06:30", end: "15:30" },
      "5": null,
      "6": null,
    },
  },
  {
    id: "staff9",
    name: "Sara Berg",
    role: "Activity Leader",
    department: "Vildhallon",
    schedules: {
      "0": { start: "07:30", end: "16:30" },
      "1": { start: "07:30", end: "16:30" },
      "2": { start: "07:30", end: "16:30" },
      "3": { start: "07:30", end: "16:30" },
      "4": null,
      "5": null,
      "6": null,
    },
  },
  {
    id: "staff15",
    name: "Karin Lundgren",
    role: "Support Staff",
    department: "Vildhallon",
    schedules: {
      "0": { start: "08:00", end: "17:00" },
      "1": { start: "08:00", end: "17:00" },
      "2": { start: "08:00", end: "17:00" },
      "3": null,
      "4": { start: "08:00", end: "17:00" },
      "5": null,
      "6": null,
    },
  },
  
  // Staff without specific department
  {
    id: "staff4",
    name: "Erik Berg",
    role: "IT Support",
    schedules: {
      "0": { start: "08:00", end: "17:00" },
      "1": { start: "08:00", end: "17:00" },
      "2": { start: "08:00", end: "17:00" },
      "3": { start: "08:00", end: "17:00" },
      "4": { start: "08:00", end: "17:00" },
      "5": null,
      "6": null,
    },
  },
];
