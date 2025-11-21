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
