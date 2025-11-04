import { useState } from "react";
import { Calendar, Plus, Pencil, Trash2, ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TemporarySchemaPeriodDialog } from "@/components/TemporarySchemaPeriodDialog";

interface TemporarySchemaPeriod {
  id: string;
  title: string;
  createdBy: string;
  startDate: Date;
  endDate: Date;
  departments: string[];
  activateDate: Date;
  deadline: Date;
  submitted: number;
  remaining: number;
  limitedCapacityDays: Date[];
}

const mockPeriods: TemporarySchemaPeriod[] = [
  {
    id: "1",
    title: "Jul & Nyår 25/26",
    createdBy: "Beatrice Olofson",
    startDate: new Date(2025, 11, 22),
    endDate: new Date(2026, 0, 4),
    departments: ["Gräsparven", "laser kittens", "örg"],
    activateDate: new Date(2025, 10, 15),
    deadline: new Date(2025, 11, 1),
    submitted: 0,
    remaining: 29,
    limitedCapacityDays: [],
  },
];

export default function Administration() {
  const [periods, setPeriods] = useState<TemporarySchemaPeriod[]>(mockPeriods);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<TemporarySchemaPeriod | null>(null);

  const handleCreateNew = () => {
    setEditingPeriod(null);
    setDialogOpen(true);
  };

  const handleEdit = (period: TemporarySchemaPeriod) => {
    setEditingPeriod(period);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPeriods(periods.filter((p) => p.id !== id));
  };

  const handleSave = (period: TemporarySchemaPeriod) => {
    if (editingPeriod) {
      setPeriods(periods.map((p) => (p.id === period.id ? period : p)));
    } else {
      setPeriods([...periods, { ...period, id: Date.now().toString() }]);
    }
    setDialogOpen(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("sv-SE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="p-6">
        <Tabs defaultValue="temporary" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="temporary" className="text-xs uppercase font-medium">
              Temporära schemaperioder
            </TabsTrigger>
            <TabsTrigger value="closures" className="text-xs uppercase font-medium">
              Stängningsperioder
            </TabsTrigger>
            <TabsTrigger value="no-schedule" className="text-xs uppercase font-medium">
              Saknar schema
            </TabsTrigger>
            <TabsTrigger value="places" className="text-xs uppercase font-medium">
              Platser
            </TabsTrigger>
          </TabsList>

          <TabsContent value="temporary" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Temporära schemaperioder</h2>
              </div>
              <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary/90 gap-2">
                <Plus className="h-4 w-4" />
                Skapa temporär schemaperiod
              </Button>
            </div>

            <div className="space-y-4">
              {periods.map((period) => (
                <Card key={period.id} className="bg-card">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold">{period.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Skapad av: {period.createdBy}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">
                          {formatDate(period.startDate)} - {formatDate(period.endDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground border border-input rounded px-3 py-1">
                          {period.departments.join(", ")}
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Aktiveras {formatDate(period.activateDate)}
                        </span>
                        <span className="text-destructive font-medium">
                          Deadline: {formatDate(period.deadline)}
                        </span>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-muted-foreground">
                          {period.submitted} Inskickade
                        </span>
                        <span className="text-primary font-medium">
                          {period.remaining} Kvar att skickas in
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(period.id)}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Ta bort
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleEdit(period)}
                          className="bg-primary hover:bg-primary/90 gap-2"
                        >
                          <Pencil className="h-4 w-4" />
                          Redigera
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="closures">
            <div className="text-center py-12 text-muted-foreground">
              Stängningsperioder kommer snart
            </div>
          </TabsContent>

          <TabsContent value="no-schedule">
            <div className="text-center py-12 text-muted-foreground">
              Saknar schema kommer snart
            </div>
          </TabsContent>

          <TabsContent value="places">
            <div className="text-center py-12 text-muted-foreground">
              Platser kommer snart
            </div>
          </TabsContent>
        </Tabs>

        <TemporarySchemaPeriodDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          period={editingPeriod}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
