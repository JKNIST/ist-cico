import { useState } from "react";
import { Calendar, Plus, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TemporarySchemaPeriodDialog } from "@/components/TemporarySchemaPeriodDialog";
import { ClosurePeriodDialog } from "@/components/ClosurePeriodDialog";
import { GroupsManagement } from "@/components/administration/GroupsManagement";
import { TemporarySchemaPeriod, ClosurePeriod } from "@/types/administration";

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
    limitedCapacityDays: [
      new Date(2025, 11, 24),
      new Date(2025, 11, 25),
      new Date(2025, 11, 31),
    ],
  },
];

const mockClosurePeriods: ClosurePeriod[] = [
  {
    id: "1",
    title: "Planeringsdag",
    startDate: new Date(2025, 11, 18),
    endDate: new Date(2025, 11, 18),
    departments: ["örg", "Gräsparven", "laser kittens"],
    publishDate: new Date(2025, 10, 4),
    isArchived: false,
  },
];

export default function Administration() {
  const [periods, setPeriods] = useState<TemporarySchemaPeriod[]>(mockPeriods);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<TemporarySchemaPeriod | null>(null);

  const [closurePeriods, setClosurePeriods] = useState<ClosurePeriod[]>(mockClosurePeriods);
  const [closureDialogOpen, setClosureDialogOpen] = useState(false);
  const [editingClosurePeriod, setEditingClosurePeriod] = useState<ClosurePeriod | null>(null);
  const [activePeriodsOpen, setActivePeriodsOpen] = useState(true);
  const [archivedPeriodsOpen, setArchivedPeriodsOpen] = useState(false);

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

  const handleCreateNewClosure = () => {
    setEditingClosurePeriod(null);
    setClosureDialogOpen(true);
  };

  const handleEditClosure = (period: ClosurePeriod) => {
    setEditingClosurePeriod(period);
    setClosureDialogOpen(true);
  };

  const handleDeleteClosure = (id: string) => {
    setClosurePeriods(closurePeriods.filter((p) => p.id !== id));
  };

  const handleSaveClosure = (period: ClosurePeriod) => {
    if (editingClosurePeriod) {
      setClosurePeriods(closurePeriods.map((p) => (p.id === period.id ? period : p)));
    } else {
      setClosurePeriods([...closurePeriods, { ...period, id: Date.now().toString() }]);
    }
    setClosureDialogOpen(false);
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
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="temporary" className="text-xs uppercase font-medium">
              Temporära schemaperioder
            </TabsTrigger>
            <TabsTrigger value="closures" className="text-xs uppercase font-medium">
              Stängningsperioder
            </TabsTrigger>
            <TabsTrigger value="staff" className="text-xs uppercase font-medium">
              Personal
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-xs uppercase font-medium">
              Grupper
            </TabsTrigger>
            <TabsTrigger value="archived" className="text-xs uppercase font-medium">
              Arkiv
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

          <TabsContent value="closures" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Stängningsperioder</h2>
              </div>
              <Button onClick={handleCreateNewClosure} className="bg-primary hover:bg-primary/90 gap-2">
                <Plus className="h-4 w-4" />
                Skapa stängningsperiod
              </Button>
            </div>

            <div className="space-y-4">
              <Collapsible open={activePeriodsOpen} onOpenChange={setActivePeriodsOpen}>
                <Card className="bg-card">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Stängningsperioder</span>
                        <Badge variant="secondary" className="ml-2">
                          {closurePeriods.filter((p) => !p.isArchived).length}
                        </Badge>
                      </div>
                      {activePeriodsOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t">
                      {closurePeriods
                        .filter((p) => !p.isArchived)
                        .map((period) => (
                          <div key={period.id} className="p-6 space-y-3">
                            <h3 className="font-semibold">{period.title}</h3>
                            <p className="text-sm">
                              {formatDate(period.startDate)}
                              {period.endDate.getTime() !== period.startDate.getTime() &&
                                ` - ${formatDate(period.endDate)}`}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground border border-input rounded px-3 py-1">
                                {period.departments.join(", ")}
                                <ChevronDown className="h-3 w-3 ml-1" />
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Publicering: {formatDate(period.publishDate)}
                            </p>
                            <div className="flex items-center gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClosure(period.id)}
                                className="gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Ta bort
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleEditClosure(period)}
                                className="bg-primary hover:bg-primary/90 gap-2"
                              >
                                <Pencil className="h-4 w-4" />
                                Redigera
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              <Collapsible open={archivedPeriodsOpen} onOpenChange={setArchivedPeriodsOpen}>
                <Card className="bg-card">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Tidigare stängningsperioder</span>
                        <Badge variant="secondary" className="ml-2">
                          {closurePeriods.filter((p) => p.isArchived).length}
                        </Badge>
                      </div>
                      {archivedPeriodsOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t p-6">
                      <p className="text-sm text-muted-foreground">Inga tidigare stängningsperioder</p>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </div>
          </TabsContent>

          <TabsContent value="staff">
            <div className="text-center py-12 text-muted-foreground">
              Personal kommer snart
            </div>
          </TabsContent>

          <TabsContent value="groups">
            <GroupsManagement />
          </TabsContent>

          <TabsContent value="archived">
            <div className="text-center py-12 text-muted-foreground">
              Arkiv kommer snart
            </div>
          </TabsContent>
        </Tabs>

        <TemporarySchemaPeriodDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          period={editingPeriod}
          onSave={handleSave}
        />

        <ClosurePeriodDialog
          open={closureDialogOpen}
          onOpenChange={setClosureDialogOpen}
          period={editingClosurePeriod}
          onSave={handleSaveClosure}
        />
      </div>
    </div>
  );
}
