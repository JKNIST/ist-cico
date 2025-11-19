import { Calendar, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function StaffSchedule() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Personalschema</h1>
        </div>

        <Card className="bg-card">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <Users className="h-16 w-16 text-muted-foreground/50" />
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">Personalschema</h2>
                <p className="text-muted-foreground max-w-md">
                  Här kommer personalscheman att visas. Funktionalitet för att hantera personalens arbetstider och scheman kommer snart.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
