import { BlogPost } from "@/types/blog";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BlogPostHeader } from "./BlogPostHeader";
import { BlogPostContent } from "./BlogPostContent";
import { BlogPostReaders } from "./BlogPostReaders";

interface BlogPostCardProps {
  post: BlogPost;
  isExpanded: boolean;
  isRead: boolean;
  onExpandChange: (isExpanded: boolean) => void;
}

export function BlogPostCard({
  post,
  isExpanded,
  isRead,
  onExpandChange,
}: BlogPostCardProps) {
  const isScheduled = post.status === "Schemalagd";

  return (
    <Card
      className={cn(
        "p-6 border-l-4 hover:shadow-md transition-shadow",
        // Schemalagt: ljusgul bakgrund + orange border
        isScheduled && "bg-[#FFF8E0] border-l-[#FEC6A1]",
        // Oläst: vit bakgrund + orange border
        !isScheduled && !isRead && "bg-white border-l-[#FEC6A1]",
        // Läst: grå bakgrund + neutral border
        !isScheduled && isRead && "bg-muted/10 border-l-border"
      )}
    >
      <BlogPostHeader
        post={post}
        isExpanded={isExpanded}
        isRead={isRead}
        onExpandChange={onExpandChange}
      />

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <BlogPostContent post={post} />
          {post.readers && post.readers.length > 0 && (
            <BlogPostReaders readers={post.readers} internalOnly={post.internalOnly} />
          )}
        </div>
      )}
    </Card>
  );
}
