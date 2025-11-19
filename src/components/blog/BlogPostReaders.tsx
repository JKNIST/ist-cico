import { Reader } from "@/types/blog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, Users, Building } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface BlogPostReadersProps {
  readers: Reader[];
  internalOnly?: boolean;
}

export function BlogPostReaders({ readers, internalOnly }: BlogPostReadersProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Gruppera läsare
  const externalReaders = readers.filter((r) => r.role === "guardian");
  const internalReaders = readers.filter((r) => r.role === "staff");

  // Gruppera externa läsare per barn
  const groupedByChild = externalReaders.reduce((acc, reader) => {
    const childName = reader.childName || "Okänt barn";
    if (!acc[childName]) {
      acc[childName] = [];
    }
    acc[childName].push(reader);
    return acc;
  }, {} as Record<string, Reader[]>);

  const totalReaders = readers.length;

  if (totalReaders === 0) {
    return (
      <div className="text-sm text-muted-foreground border-t pt-4">
        {t("blog.readers.noneYet")}
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-t pt-4">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {t("blog.readers.seenBy")} ({totalReaders})
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-4 mt-4">
        {/* Externa mottagare (grupperade per barn) */}
        {!internalOnly && Object.keys(groupedByChild).length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="h-4 w-4" />
              {t("blog.readers.external")}
            </div>
            <div className="space-y-3 pl-6">
              {Object.entries(groupedByChild).map(([childName, childReaders]) => (
                <div key={childName} className="space-y-1">
                  <p className="text-sm font-medium">{childName}</p>
                  <div className="space-y-1 pl-4">
                    {childReaders.map((reader) => (
                      <div
                        key={reader.id}
                        className="text-sm text-muted-foreground flex items-center justify-between"
                      >
                        <span>{reader.name}</span>
                        <span className="text-xs">
                          {format(new Date(reader.readAt), "d MMM, HH:mm", {
                            locale: sv,
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interna mottagare (personal) */}
        {internalReaders.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Building className="h-4 w-4" />
              {t("blog.readers.internal")}
            </div>
            <div className="space-y-1 pl-6">
              {internalReaders.map((reader) => (
                <div
                  key={reader.id}
                  className="text-sm text-muted-foreground flex items-center justify-between"
                >
                  <span>{reader.name}</span>
                  <span className="text-xs">
                    {format(new Date(reader.readAt), "d MMM, HH:mm", {
                      locale: sv,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
