import { Info, Share2, Lock, Repeat } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export function ColorLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="text-sm font-medium flex items-center gap-2 hover:text-gray-700 transition-colors">
          <Info className="h-4 w-4" />
          Färgförklaring
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-red-500 flex-shrink-0" />
            <span>Stängningar</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-amber-500 flex-shrink-0" />
            <span>Varningar/Planering</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-green-500 flex-shrink-0" />
            <span>Externa aktiviteter</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-blue-500 flex-shrink-0" />
            <span>Interna aktiviteter</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex items-center gap-2 text-xs">
            <Share2 className="h-3 w-3 flex-shrink-0" />
            <span>Delad med vårdnadshavare</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Lock className="h-3 w-3 flex-shrink-0" />
            <span>Endast personal</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Repeat className="h-3 w-3 flex-shrink-0" />
            <span>Återkommande</span>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
