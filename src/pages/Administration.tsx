import { useState, useMemo } from "react";
import { Calendar, Plus, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TemporarySchemaPeriodDialog } from "@/components/TemporarySchemaPeriodDialog";
import { ClosurePeriodDialog } from "@/components/ClosurePeriodDialog";
import { GroupsManagement } from "@/components/administration/GroupsManagement";
import { PeriodConflictBadge } from "@/components/administration/PeriodConflictBadge";
import { TemporarySchemaPeriod, ClosurePeriod, CalendarEvent } from "@/types/administration";
import { mockEvents } from "@/data/calendar/mockEvents";
import { validateClosurePeriodConflicts, validateTemporaryPeriodConflicts } from "@/lib/periodConflictValidation";
import { toast } from "sonner";

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
  {
    id: "2",
    title: "Sportlov 2026",
    createdBy: "Maria Larsson",
    startDate: new Date(2026, 1, 16),
    endDate: new Date(2026, 1, 20),
    departments: ["Blåbär", "Lingon", "Odon", "Vildhallon"],
    activateDate: new Date(2026, 1, 1),
    deadline: new Date(2026, 1, 10),
    submitted: 12,
    remaining: 18,
    limitedCapacityDays: [
      new Date(2026, 1, 16),
      new Date(2026, 1, 17),
      new Date(2026, 1, 20),
    ],
  },
  {
    id: "3",
    title: "Påsklov 2026",
    createdBy: "Anna Andersson",
    startDate: new Date(2026, 2, 30),
    endDate: new Date(2026, 3, 6),
    departments: ["Blåbär", "Lingon", "Odon", "Vildhallon"],
    activateDate: new Date(2026, 2, 15),
    deadline: new Date(2026, 2, 25),
    submitted: 8,
    remaining: 22,
    limitedCapacityDays: [
      new Date(2026, 2, 30),
      new Date(2026, 2, 31),
      new Date(2026, 3, 2),
      new Date(2026, 3, 3),
    ],
  },
  {
    id: "4",
    title: "Sommar 2026",
    createdBy: "Maria Larsson",
    startDate: new Date(2026, 5, 22),
    endDate: new Date(2026, 7, 14),
    departments: ["Blåbär", "Lingon", "Odon", "Vildhallon"],
    activateDate: new Date(2026, 4, 1),
    deadline: new Date(2026, 4, 15),
    submitted: 0,
    remaining: 95,
    limitedCapacityDays: [
      new Date(2026, 5, 22),
      new Date(2026, 5, 23),
      new Date(2026, 5, 29),
      new Date(2026, 5, 30),
      new Date(2026, 6, 15),
      new Date(2026, 6, 16),
      new Date(2026, 7, 10),
      new Date(2026, 7, 11),
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
  {
    id: "2",
    title: "Påskstängning",
    startDate: new Date(2026, 3, 2),
    endDate: new Date(2026, 3, 3),
    departments: ["Blåbär", "Lingon", "Odon", "Vildhallon"],
    publishDate: new Date(2026, 2, 1),
    isArchived: false,
  },
  {
    id: "3",
    title: "Kristi himmelsfärd",
    startDate: new Date(2026, 4, 14),
    endDate: new Date(2026, 4, 15),
    departments: ["Blåbär", "Lingon", "Odon", "Vildhallon"],
    publishDate: new Date(2026, 3, 15),
    isArchived: false,
  },
  {
    id: "4",
    title: "Nationaldagen",
    startDate: new Date(2026, 5, 6),
    endDate: new Date(2026, 5, 6),
    departments: ["Blåbär", "Lingon", "Odon", "Vildhallon"],
    publishDate: new Date(2026, 4, 1),
    isArchived: false,
  },
  {
    id: "5",
    title: "Sommarstängning vecka 29-30",
    startDate: new Date(2026, 6, 13),
    endDate: new Date(2026, 6, 24),
    departments: ["Blåbär", "Lingon", "Odon", "Vildhallon"],
    publishDate: new Date(2026, 4, 15),
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

  // Inline event edit/delete handlers for PeriodConflictBadge
  const handleEditConflictEvent = (event: CalendarEvent, date: Date, scope?: "single" | "future" | "all") => {
    console.log("Edit event from Administration:", event.id, "at", date, "scope:", scope);
    toast.info(`Redigera händelse: ${event.title}`);
    // TODO: Open AddEventDialog for editing
  };

  const handleDeleteConflictEvent = (event: CalendarEvent, date: Date, scope?: "single" | "future" | "all") => {
    console.log("Delete event from Administration:", event.id, "at", date, "scope:", scope);
    toast.info(`Ta bort händelse: ${event.title}`);
    // TODO: Actually delete the event and refresh conflicts
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
            <TabsTrigger value="noSchedule" className="text-xs uppercase font-medium">
              Saknar schema
            </TabsTrigger>
            <TabsTrigger value="places" className="text-xs uppercase font-medium">
              Platser
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-xs uppercase font-medium">
              Grupper
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
              {periods.map((period) => {
                const conflicts = validateTemporaryPeriodConflicts(
                  period.limitedCapacityDays,
                  mockEvents
                );
                return (
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

                        {/* Conflict badge */}
                        <PeriodConflictBadge 
                          conflicts={conflicts} 
                          onEditEvent={handleEditConflictEvent}
                          onDeleteEvent={handleDeleteConflictEvent}
                        />

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
                );
              })}
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
                        .map((period) => {
                          const conflicts = validateClosurePeriodConflicts(
                            period.startDate,
                            period.endDate,
                            mockEvents
                          );
                          return (
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
                              
                              {/* Conflict badge */}
                              <PeriodConflictBadge 
                                conflicts={conflicts} 
                                onEditEvent={handleEditConflictEvent}
                                onDeleteEvent={handleDeleteConflictEvent}
                              />
                              
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
                          );
                        })}
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

          <TabsContent value="noSchedule">
            <Card className="bg-card">
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <Calendar className="h-16 w-16 text-muted-foreground/50" />
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">Saknar schema</h2>
                    <p className="text-muted-foreground max-w-md">
                      Här visas barn som saknar schema. Funktionalitet för att hantera barn utan schema kommer snart.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="places">
            <Card className="bg-card">
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <Calendar className="h-16 w-16 text-muted-foreground/50" />
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">Platser</h2>
                    <p className="text-muted-foreground max-w-md">
                      Här visas information om tillgängliga platser och kapacitet. Funktionalitet för platser kommer snart.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups">
            <GroupsManagement />
          </TabsContent>
        </Tabs>

        <TemporarySchemaPeriodDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          period={editingPeriod}
          onSave={handleSave}
          existingEvents={mockEvents}
        />

        <ClosurePeriodDialog
          open={closureDialogOpen}
          onOpenChange={setClosureDialogOpen}
          period={editingClosurePeriod}
          onSave={handleSaveClosure}
          existingEvents={mockEvents}
        />
      </div>
    </div>
  );
}
