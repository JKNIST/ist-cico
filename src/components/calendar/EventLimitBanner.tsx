import { useState } from "react";
import { Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventLimitBannerProps {
  displayedCount: number;
  totalCount: number;
  batchSize: number;
  onLoadMore: () => void;
}

export function EventLimitBanner({
  displayedCount,
  totalCount,
  batchSize,
  onLoadMore,
}: EventLimitBannerProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (displayedCount >= totalCount) return null;

  const remaining = totalCount - displayedCount;
  const nextBatch = Math.min(batchSize, remaining);

  const handleClick = () => {
    setIsLoading(true);
    // Simulate API fetch latency
    setTimeout(() => {
      onLoadMore();
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="flex items-start gap-2">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
        <div className="text-sm text-amber-900">
          <span className="font-medium">
            Visar {displayedCount} av {totalCount} händelser denna månad.
          </span>{" "}
          <span className="text-amber-800">
            Vissa dagar kan sakna händelser tills de laddas.
          </span>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={handleClick}
        disabled={isLoading}
        className="flex-shrink-0 border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Laddar…
          </>
        ) : (
          <>Ladda nästa {nextBatch}</>
        )}
      </Button>
    </div>
  );
}
