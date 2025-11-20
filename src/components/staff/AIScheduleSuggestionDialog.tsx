import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

interface AIScheduleSuggestion {
  staffId: string;
  staffName: string;
  department: string;
  schedule: {
    monday?: { start: string; end: string } | null;
    tuesday?: { start: string; end: string } | null;
    wednesday?: { start: string; end: string } | null;
    thursday?: { start: string; end: string } | null;
    friday?: { start: string; end: string } | null;
    saturday?: { start: string; end: string } | null;
    sunday?: { start: string; end: string } | null;
  };
}

interface AIResponse {
  recommendations: AIScheduleSuggestion[];
  reasoning: string;
  warnings: string[];
  optimizations: string[];
}

interface AIScheduleSuggestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekStart: Date;
  childCounts: any;
  staffList: any[];
  staffingRatios: any[];
  currentSchedules: any[];
  onAcceptSuggestions: (suggestions: AIScheduleSuggestion[]) => void;
}

export function AIScheduleSuggestionDialog({
  open,
  onOpenChange,
  weekStart,
  childCounts,
  staffList,
  staffingRatios,
  currentSchedules,
  onAcceptSuggestions,
}: AIScheduleSuggestionDialogProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Set<string>>(new Set());

  const handleGenerate = async () => {
    setIsLoading(true);
    setAiResponse(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('suggest-staff-schedule', {
        body: {
          weekStart: weekStart.toISOString(),
          childCounts,
          staffList,
          staffingRatios,
          currentSchedules,
        }
      });

      if (error) throw error;

      setAiResponse(data);
      // Select all by default
      setSelectedStaff(new Set(data.recommendations.map((r: AIScheduleSuggestion) => r.staffId)));
      
      toast.success("AI-förslag genererade!");
    } catch (error: any) {
      console.error("Error generating AI suggestions:", error);
      
      if (error.message?.includes('429') || error.message?.includes('Rate limit')) {
        toast.error("Rate limit överskriden. Försök igen om en stund.");
      } else if (error.message?.includes('402') || error.message?.includes('krediter')) {
        toast.error("AI-krediter slut. Lägg till krediter i inställningar.");
      } else {
        toast.error("Kunde inte generera förslag: " + (error.message || "Okänt fel"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStaff = (staffId: string) => {
    const newSelected = new Set(selectedStaff);
    if (newSelected.has(staffId)) {
      newSelected.delete(staffId);
    } else {
      newSelected.add(staffId);
    }
    setSelectedStaff(newSelected);
  };

  const handleAccept = () => {
    if (!aiResponse) return;
    
    const selectedSuggestions = aiResponse.recommendations.filter(r => 
      selectedStaff.has(r.staffId)
    );
    
    if (selectedSuggestions.length === 0) {
      toast.error("Välj minst en personal att applicera schemat för");
      return;
    }
    
    onAcceptSuggestions(selectedSuggestions);
    toast.success(`Schema applicerat för ${selectedSuggestions.length} personal`);
    onOpenChange(false);
  };

  const formatTime = (time?: { start: string; end: string } | null) => {
    if (!time) return "Ledig";
    return `${time.start} - ${time.end}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>🤖 AI Schemaförslag</DialogTitle>
          <DialogDescription>
            AI analyserar barnantal och bemanningskrav för att föreslå optimala scheman
          </DialogDescription>
        </DialogHeader>

        {!aiResponse && !isLoading && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              Klicka på knappen nedan för att generera AI-förslag för vecka {weekStart.toLocaleDateString('sv-SE')}
            </p>
            <Button onClick={handleGenerate} size="lg">
              🤖 Generera förslag
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="py-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Genererar schemaförslag...</p>
            <p className="text-sm text-muted-foreground mt-2">
              AI analyserar barnantal, personal och bemanningskrav
            </p>
          </div>
        )}

        {aiResponse && (
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Reasoning */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">AI:s resonemang</h3>
                    <p className="text-sm text-blue-800">{aiResponse.reasoning}</p>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {aiResponse.warnings.length > 0 && (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-2">Varningar</h3>
                      <ul className="text-sm text-amber-800 space-y-1">
                        {aiResponse.warnings.map((warning, i) => (
                          <li key={i}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Optimizations */}
              {aiResponse.optimizations.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-2">Optimeringsförslag</h3>
                      <ul className="text-sm text-green-800 space-y-1">
                        {aiResponse.optimizations.map((opt, i) => (
                          <li key={i}>• {opt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations Table */}
              <div>
                <h3 className="font-semibold mb-3">Föreslagna scheman</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-3 py-2 text-left text-sm font-medium">
                          <Checkbox
                            checked={selectedStaff.size === aiResponse.recommendations.length}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedStaff(new Set(aiResponse.recommendations.map(r => r.staffId)));
                              } else {
                                setSelectedStaff(new Set());
                              }
                            }}
                          />
                        </th>
                        <th className="px-3 py-2 text-left text-sm font-medium">Personal</th>
                        <th className="px-3 py-2 text-left text-sm font-medium">Avdelning</th>
                        <th className="px-3 py-2 text-left text-sm font-medium">Mån</th>
                        <th className="px-3 py-2 text-left text-sm font-medium">Tis</th>
                        <th className="px-3 py-2 text-left text-sm font-medium">Ons</th>
                        <th className="px-3 py-2 text-left text-sm font-medium">Tor</th>
                        <th className="px-3 py-2 text-left text-sm font-medium">Fre</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiResponse.recommendations.map((rec) => (
                        <tr key={rec.staffId} className="border-t hover:bg-muted/50">
                          <td className="px-3 py-2">
                            <Checkbox
                              checked={selectedStaff.has(rec.staffId)}
                              onCheckedChange={() => handleToggleStaff(rec.staffId)}
                            />
                          </td>
                          <td className="px-3 py-2 text-sm font-medium">{rec.staffName}</td>
                          <td className="px-3 py-2">
                            <Badge variant="outline" className="text-xs">{rec.department}</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs">{formatTime(rec.schedule.monday)}</td>
                          <td className="px-3 py-2 text-xs">{formatTime(rec.schedule.tuesday)}</td>
                          <td className="px-3 py-2 text-xs">{formatTime(rec.schedule.wednesday)}</td>
                          <td className="px-3 py-2 text-xs">{formatTime(rec.schedule.thursday)}</td>
                          <td className="px-3 py-2 text-xs">{formatTime(rec.schedule.friday)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}

        {aiResponse && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Avbryt
            </Button>
            <Button onClick={handleAccept} disabled={selectedStaff.size === 0}>
              Acceptera {selectedStaff.size > 0 && `(${selectedStaff.size})`}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
