import { Reader } from "@/types/blog";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp, Check, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ReaderAvatar } from "./ReaderAvatar";
import { format } from "date-fns";
import { sv, enUS, nb } from "date-fns/locale";

interface BlogPostReadersProps {
  readers: Reader[];
  internalOnly?: boolean;
  seenCount?: number;
  totalCount?: number;
}

export function BlogPostReaders({ 
  readers, 
  internalOnly,
  seenCount,
  totalCount 
}: BlogPostReadersProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const getDateLocale = () => {
    switch (i18n.language) {
      case 'sv': return sv;
      case 'no': return nb;
      default: return enUS;
    }
  };

  // Calculate counts if not provided
  const actualSeenCount = seenCount ?? readers.filter(r => r.readAt).length;
  const actualTotalCount = totalCount ?? readers.length;

  // Separate external and internal readers
  const externalReaders = readers.filter(r => r.role === "guardian");
  const internalReaders = readers.filter(r => r.role === "staff");

  const formatReadDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd", { locale: getDateLocale() });
    } catch {
      return dateString;
    }
  };

  const getRoleLabel = (reader: Reader) => {
    if (reader.role === "guardian" && reader.childName) {
      return `Vårdnadshavare till ${reader.childName}`;
    }
    return reader.role === "staff" ? "Personal" : "Vårdnadshavare";
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">
              {t("blog.readers.seenBy")} {actualSeenCount}/{actualTotalCount}
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="px-6 pb-4 space-y-3">
          {/* External Readers */}
          {!internalOnly && externalReaders.length > 0 && (
            <div className="space-y-2">
              {externalReaders.map((reader) => (
                <div 
                  key={reader.id} 
                  className="flex items-center gap-3 py-2"
                >
                  <ReaderAvatar name={reader.name} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">{reader.name}</span>
                      
                      {/* Group badge placeholder - in TEAL/BLUE */}
                      <Badge 
                        variant="secondary"
                        className="bg-[#287E95] text-white text-xs font-normal"
                      >
                        Maries grundskola...
                      </Badge>
                      
                      {/* More groups badge */}
                      <Badge 
                        variant="outline"
                        className="border-[#287E95] text-[#287E95] text-xs"
                      >
                        +3 klasser/grupper
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getRoleLabel(reader)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {reader.readAt && (
                      <>
                        <span className="text-sm text-muted-foreground">
                          {formatReadDate(reader.readAt)}
                        </span>
                        <div className="w-5 h-5 rounded-full bg-[#22A06B] flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Internal Readers */}
          {internalReaders.length > 0 && (
            <div className="space-y-2">
              {internalReaders.map((reader) => (
                <div 
                  key={reader.id} 
                  className="flex items-center gap-3 py-2"
                >
                  <ReaderAvatar name={reader.name} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">{reader.name}</span>
                      
                      <Badge 
                        variant="secondary"
                        className="bg-[#287E95] text-white text-xs font-normal"
                      >
                        Personal
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getRoleLabel(reader)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {reader.readAt && (
                      <>
                        <span className="text-sm text-muted-foreground">
                          {formatReadDate(reader.readAt)}
                        </span>
                        <div className="w-5 h-5 rounded-full bg-[#22A06B] flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {readers.length === 0 && (
            <p className="text-sm text-muted-foreground py-2">
              {t("blog.readers.noneYet")}
            </p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
