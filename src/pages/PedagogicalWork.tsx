import { Menu, ChevronDown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GoalProgress {
  category: string;
  total: number;
  filled: number;
  grid: boolean[][];
}

interface GroupData {
  name: string;
  childCount: number;
  goals: GoalProgress[];
}

const mockGroups: GroupData[] = [
  {
    name: "Apelsln",
    childCount: 3,
    goals: [
      { category: "1 - Normer och värden", total: 30, filled: 0, grid: [[false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false]] },
      { category: "2 - Omsorg, utveckling och lärande", total: 30, filled: 0, grid: [[false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false]] },
      { category: "3 - Barns delaktighet och inflytande", total: 10, filled: 0, grid: [[false, false, false, false, false, false, false, false, false, false]] },
    ],
  },
  {
    name: "Fjärilen",
    childCount: 14,
    goals: [
      { category: "1 - Normer och värden", total: 30, filled: 6, grid: [[true, true, false, true, false, false, false, false, false, false], [false, true, true, false, false, false, false, false, false, false], [true, false, false, false, false, false, false, false, false, false]] },
      { category: "2 - Omsorg, utveckling och lärande", total: 30, filled: 0, grid: [[false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false]] },
      { category: "3 - Barns delaktighet och inflytande", total: 10, filled: 3, grid: [[true, true, true, false, false, false, false, false, false, false]] },
    ],
  },
  {
    name: "Myran",
    childCount: 18,
    goals: [
      { category: "1 - Normer och värden", total: 30, filled: 0, grid: [[false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false]] },
      { category: "2 - Omsorg, utveckling och lärande", total: 30, filled: 0, grid: [[false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false]] },
      { category: "3 - Barns delaktighet och inflytande", total: 10, filled: 0, grid: [[false, false, false, false, false, false, false, false, false, false]] },
    ],
  },
  {
    name: "Päronet",
    childCount: 0,
    goals: [
      { category: "1 - Normer och värden", total: 30, filled: 0, grid: [[false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false]] },
      { category: "2 - Omsorg, utveckling och lärande", total: 30, filled: 0, grid: [[false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false]] },
      { category: "3 - Barns delaktighet och inflytande", total: 10, filled: 0, grid: [[false, false, false, false, false, false, false, false, false, false]] },
    ],
  },
  {
    name: "Spindeln",
    childCount: 14,
    goals: [
      { category: "1 - Normer och värden", total: 30, filled: 0, grid: [[false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false]] },
      { category: "2 - Omsorg, utveckling och lärande", total: 30, filled: 0, grid: [[false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false]] },
      { category: "3 - Barns delaktighet och inflytande", total: 10, filled: 0, grid: [[false, false, false, false, false, false, false, false, false, false]] },
    ],
  },
];

function GoalProgressGrid({ goals }: { goals: GoalProgress[] }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-600">
        Summering av mål för skolåret 2025-08-01 - 2026-07-31
      </p>
      {goals.map((goal, idx) => (
        <div key={idx} className="space-y-2">
          <p className="text-xs font-normal text-gray-900">{goal.category}</p>
          <div className="space-y-1">
            {goal.grid.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-1">
                {row.map((filled, colIdx) => (
                  <div
                    key={colIdx}
                    className={`w-5 h-5 border ${
                      filled ? "bg-[#7fb069] border-[#7fb069]" : "bg-gray-100 border-gray-300"
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PedagogicalWork() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#4a6682] text-white shadow-sm">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-base font-medium">Pedagogisk dokumentation</h1>
          </div>

          <div className="flex items-center gap-4">
            <Select defaultValue="skogans">
              <SelectTrigger className="w-48 bg-white/10 text-white border-white/20 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="skogans">Skogans förskola</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Version indicator */}
      <div className="container mx-auto px-6 py-2">
        <p className="text-xs text-gray-500 text-right">1.36-1</p>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockGroups.map((group, idx) => (
            <Card key={idx} className="overflow-hidden border-0 shadow-sm">
              {/* Blue header section */}
              <div className="bg-[#5b7a9b] p-6">
                <h2 className="text-xl font-semibold text-white">{group.name}</h2>
                <p className="text-sm text-white/90">{group.childCount} child</p>
              </div>

              {/* White content section */}
              <div className="bg-white p-6">
                <GoalProgressGrid goals={group.goals} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
