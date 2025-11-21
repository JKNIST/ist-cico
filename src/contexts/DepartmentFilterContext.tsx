import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface DepartmentFilterContextType {
  selectedDepartments: string[];
  setSelectedDepartments: (deps: string[]) => void;
  selectedGroups: string[];
  setSelectedGroups: (groups: string[]) => void;
  clearFilters: () => void;
}

const DepartmentFilterContext = createContext<DepartmentFilterContextType | undefined>(undefined);

export const useDepartmentFilter = () => {
  const context = useContext(DepartmentFilterContext);
  if (!context) {
    throw new Error("useDepartmentFilter must be used within DepartmentFilterProvider");
  }
  return context;
};

interface DepartmentFilterProviderProps {
  children: ReactNode;
}

export const DepartmentFilterProvider = ({ children }: DepartmentFilterProviderProps) => {
  const [selectedDepartments, setSelectedDepartmentsState] = useState<string[]>(() => {
    const saved = localStorage.getItem("selectedDepartments");
    return saved ? JSON.parse(saved) : ["Blåbär"];
  });

  const [selectedGroups, setSelectedGroupsState] = useState<string[]>(() => {
    const saved = localStorage.getItem("selectedGroups");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("selectedDepartments", JSON.stringify(selectedDepartments));
  }, [selectedDepartments]);

  useEffect(() => {
    localStorage.setItem("selectedGroups", JSON.stringify(selectedGroups));
  }, [selectedGroups]);

  const setSelectedDepartments = (deps: string[]) => {
    setSelectedDepartmentsState(deps);
    
    // Auto-clear groups that don't belong to selected departments
    setSelectedGroupsState(prev => {
      const validGroups = prev.filter(groupFullName => {
        const department = groupFullName.split('-')[0];
        return deps.includes(department);
      });
      return validGroups;
    });
  };

  const setSelectedGroups = (groups: string[]) => {
    setSelectedGroupsState(groups);
  };

  const clearFilters = () => {
    setSelectedDepartmentsState([]);
    setSelectedGroupsState([]);
  };

  return (
    <DepartmentFilterContext.Provider
      value={{
        selectedDepartments,
        setSelectedDepartments,
        selectedGroups,
        setSelectedGroups,
        clearFilters,
      }}
    >
      {children}
    </DepartmentFilterContext.Provider>
  );
};
