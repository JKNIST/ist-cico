import { Attachment } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttachmentItemProps {
  attachment: Attachment;
}

const fileTypeColors: Record<string, { bg: string; text: string }> = {
  docx: { bg: "bg-blue-100", text: "text-blue-700" },
  pdf: { bg: "bg-red-100", text: "text-red-700" },
  jpg: { bg: "bg-green-100", text: "text-green-700" },
  png: { bg: "bg-green-100", text: "text-green-700" },
  xlsx: { bg: "bg-emerald-100", text: "text-emerald-700" },
  other: { bg: "bg-gray-100", text: "text-gray-700" },
};

export function AttachmentItem({ attachment }: AttachmentItemProps) {
  const colors = fileTypeColors[attachment.fileType] || fileTypeColors.other;

  const handleDownload = () => {
    // In a real app, this would trigger a download
    console.log("Download:", attachment.filename);
    window.open(attachment.url, "_blank");
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-3">
        <Badge
          className={cn(
            "uppercase text-xs font-semibold",
            colors.bg,
            colors.text,
            "hover:opacity-90"
          )}
        >
          {attachment.fileType}
        </Badge>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {attachment.filename}
          </span>
          <span className="text-xs text-muted-foreground">
            {attachment.size}
          </span>
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        aria-label="Download attachment"
      >
        <Download className="h-4 w-4 text-[#287E95]" />
      </button>
    </div>
  );
}
