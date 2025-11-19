import { useState } from "react";
import { ChevronLeft, Search, ChevronDown } from "lucide-react";
import { ChildCard } from "@/components/ChildCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockChildren = [
  { name: "Zero Aarne", initials: "ZA", department: "Spindeln", status: "absent" as const, time: "06:35", timeLabel: "Ej hämtas:" },
  { name: "Mio Adler", initials: "MA", department: "Spindeln", status: "present" as const, time: "10:00", timeLabel: "Ej hämtas:" },
  { name: "Ilse Nilsson", initials: "IN", department: "Fjärilen", status: "soon" as const, time: "12:00", timeLabel: "Hämtas snart:" },
  { name: "Lemmy Tedsson", initials: "LT", department: "Baggen", status: "present" as const, time: "15:00", timeLabel: "Hämtas:" },
  { name: "Lisa Karlsson", initials: "LK", department: "Spindeln", status: "present" as const, time: "15:00", timeLabel: "Hämtas:" },
  { name: "Iris Ahlberg", initials: "IA", department: "Fjärilen", status: "present" as const, time: "15:50", timeLabel: "Hämtas:" },
  { name: "-- --", initials: "--", department: "Baggen", status: "present" as const, time: "16:00", timeLabel: "Hämtas:" },
  { name: "Anna Andersson", initials: "AA", department: "Spindeln", status: "present" as const, time: "16:00", timeLabel: "Hämtas:" },
  { name: "Anna Hillman", initials: "AH", department: "Fjärilen", status: "present" as const, time: "16:00", timeLabel: "Hämtas:" },
  { name: "Emil Jr Gunnarsson", initials: "EG", department: "Baggen", status: "present" as const, time: "16:00", timeLabel: "Hämtas:" },
  { name: "Hanna Olsson", initials: "HO", department: "Fjärilen", status: "present" as const, time: "16:00", timeLabel: "Hämtas:" },
  { name: "Hemline Team", initials: "HT", department: "Baggen", status: "present" as const, time: "16:00", timeLabel: "Hämtas:" },
  { name: "Ismat Khan", initials: "IK", department: "Spindeln", status: "present" as const, time: "16:00", timeLabel: "Hämtas:" },
  { name: "Justin Ferdinand", initials: "JF", department: "Baggen", status: "present" as const, time: "16:00", timeLabel: "Hämtas:" },
  { name: "Marit Larsson", initials: "ML", department: "Baggen", status: "present" as const, time: "16:00", timeLabel: "Hämtas:" },
];

export default function Overview() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Överblick</h1>
          </div>

          <div className="flex items-center gap-4">
            <Select defaultValue="svenska">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="svenska">Svenska</SelectItem>
                <SelectItem value="english">English</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="apelsln">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apelsln">Apelsln, Baggen, Fjärilsle</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="sm" className="text-primary">
              BERTIL
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <Tabs defaultValue="dagoversikt" className="w-full">
        <div className="border-b bg-white">
          <div className="px-6">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="dagoversikt" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                DAGSÖVERSIKT
              </TabsTrigger>
              <TabsTrigger 
                value="vem-ar-var"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                VEM ÄR VAR
              </TabsTrigger>
              <TabsTrigger 
                value="rakna-in-barn"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                RÄKNA IN BARN
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="dagoversikt" className="p-6 space-y-6">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-2xl font-semibold">
                <span>37</span>
                <span className="text-muted-foreground">incheckade</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="select-all" />
                <Label htmlFor="select-all" className="text-sm">
                  Välj alla
                </Label>
              </div>
            </div>

            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sök efter barn"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Children Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {mockChildren
              .filter((child) =>
                child.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((child, index) => (
                <ChildCard key={index} {...child} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="vem-ar-var" className="p-6">
          <p className="text-muted-foreground">Vem är var innehåll...</p>
        </TabsContent>

        <TabsContent value="rakna-in-barn" className="p-6">
          <p className="text-muted-foreground">Räkna in barn innehåll...</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
