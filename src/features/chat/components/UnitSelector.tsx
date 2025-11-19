import { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface UnitSelectorProps {
  selectedUnits: string[];
  onSelectedUnitsChange: (units: string[]) => void;
}

export function UnitSelector({ selectedUnits, onSelectedUnitsChange }: UnitSelectorProps) {
  const [open, setOpen] = useState(false);
  
  const units = [
    {
      name: "Kaninerna",
      subunits: ["Hoppe", "Lille skutt", "Mini Hopp", "Stampe"]
    },
    {
      name: "Norrekaskolans FTH",
      subunits: ["Lodjuret"]
    },
    {
      name: "Skogens förskola",
      subunits: ["Apelsin", "Päron", "Banan"]
    },
    {
      name: "Solens förskola",
      subunits: ["Sol", "Måne", "Stjärna"]
    }
  ];

  const allUnits = units.flatMap(unit => [unit.name, ...unit.subunits]);
  const allSelected = selectedUnits.length === allUnits.length || selectedUnits.includes("Alla enheter");
  
  const toggleAll = () => {
    if (allSelected) {
      onSelectedUnitsChange([]);
    } else {
      onSelectedUnitsChange(["Alla enheter"]);
    }
  };

  const toggleUnit = (unit: string) => {
    if (selectedUnits.includes(unit)) {
      onSelectedUnitsChange(selectedUnits.filter(u => u !== unit));
    } else {
      onSelectedUnitsChange([...selectedUnits, unit]);
    }
  };

  const isUnitSelected = (unit: string) => {
    return selectedUnits.includes(unit) || allSelected;
  };

  const [expandedUnits, setExpandedUnits] = useState<string[]>(units.map(u => u.name));
  
  const toggleExpand = (unit: string) => {
    setExpandedUnits(prev => 
      prev.includes(unit) 
        ? prev.filter(u => u !== unit) 
        : [...prev, unit]
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center px-4 py-2 text-sm border rounded hover:bg-accent">
          {allSelected ? "Alla enheter" : selectedUnits.length > 0 ? `${selectedUnits.length} valda` : "Välj enheter"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="max-h-80 overflow-auto p-2">
          <div className="flex items-center space-x-2 p-2 border-b">
            <Checkbox 
              id="select-all" 
              checked={allSelected}
              onCheckedChange={toggleAll}
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              Alla enheter
            </label>
          </div>
          
          <div className="space-y-1 pt-2">
            {units.map((unit) => (
              <div key={unit.name} className="space-y-1">
                <div className="flex items-center justify-between p-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`unit-${unit.name}`} 
                      checked={isUnitSelected(unit.name)}
                      onCheckedChange={() => toggleUnit(unit.name)}
                    />
                    <label htmlFor={`unit-${unit.name}`} className="text-sm font-medium">
                      {unit.name}
                    </label>
                  </div>
                  <button onClick={() => toggleExpand(unit.name)} className="p-1">
                    {expandedUnits.includes(unit.name) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
                
                {expandedUnits.includes(unit.name) && (
                  <div className="ml-6 space-y-1">
                    {unit.subunits.map((subunit) => (
                      <div key={subunit} className="flex items-center justify-between p-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`subunit-${subunit}`} 
                            checked={isUnitSelected(subunit)}
                            onCheckedChange={() => toggleUnit(subunit)}
                          />
                          <label htmlFor={`subunit-${subunit}`} className="text-sm">
                            {subunit}
                          </label>
                        </div>
                        {isUnitSelected(subunit) && <Check className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
