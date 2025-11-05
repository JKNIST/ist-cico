import { Info, Share2, Lock, Repeat } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function ColorLegend() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="text-sm font-medium flex items-center gap-2 hover:text-gray-700 transition-colors">
          <Info className="h-4 w-4" />
          {t('colorLegend.info')}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-red-500 flex-shrink-0" />
            <span>{t('colorLegend.closures')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-amber-500 flex-shrink-0" />
            <span>{t('colorLegend.warnings')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-green-500 flex-shrink-0" />
            <span>{t('colorLegend.external')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-blue-500 flex-shrink-0" />
            <span>{t('colorLegend.internal')}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex items-center gap-2 text-xs">
            <Share2 className="h-3 w-3 flex-shrink-0" />
            <span>{t('colorLegend.sharedIcon')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Lock className="h-3 w-3 flex-shrink-0" />
            <span>{t('colorLegend.staffOnlyIcon')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Repeat className="h-3 w-3 flex-shrink-0" />
            <span>{t('calendar.filters.recurring')}</span>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
