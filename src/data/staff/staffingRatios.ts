export interface StaffingRatio {
  department: string;
  maxChildrenPerStaff: number;
}

export const defaultStaffingRatios: StaffingRatio[] = [
  { department: "Blåbär", maxChildrenPerStaff: 5 },
  { department: "Lingon", maxChildrenPerStaff: 5 },
  { department: "Odon", maxChildrenPerStaff: 5 },
  { department: "Vildhallon", maxChildrenPerStaff: 5 },
];

const STORAGE_KEY = "staffingRatios";

export const getStaffingRatios = (): StaffingRatio[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Error loading staffing ratios:", error);
  }
  return defaultStaffingRatios;
};

export const updateStaffingRatio = (department: string, maxChildrenPerStaff: number): void => {
  const ratios = getStaffingRatios();
  const index = ratios.findIndex((r) => r.department === department);
  
  if (index >= 0) {
    ratios[index].maxChildrenPerStaff = maxChildrenPerStaff;
  } else {
    ratios.push({ department, maxChildrenPerStaff });
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ratios));
  
  // Dispatch event to notify other components
  window.dispatchEvent(new CustomEvent("staffingRatiosUpdated"));
};

export const getMaxRatioForDepartment = (department: string): number => {
  const ratios = getStaffingRatios();
  const ratio = ratios.find((r) => r.department === department);
  return ratio?.maxChildrenPerStaff ?? 5;
};
