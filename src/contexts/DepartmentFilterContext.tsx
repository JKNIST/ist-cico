import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface DepartmentFilterContextType {
  selectedDepartments: string[];
  setSelectedDepartments: (deps: string[]) => void;
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

  useEffect(() => {
    localStorage.setItem("selectedDepartments", JSON.stringify(selectedDepartments));
  }, [selectedDepartments]);

  const setSelectedDepartments = (deps: string[]) => {
    setSelectedDepartmentsState(deps);
  };

  const clearFilters = () => {
    setSelectedDepartmentsState([]);
  };

  return (
    <DepartmentFilterContext.Provider
      value={{
        selectedDepartments,
        setSelectedDepartments,
        clearFilters,
      }}
    >
      {children}
    </DepartmentFilterContext.Provider>
  );
};
