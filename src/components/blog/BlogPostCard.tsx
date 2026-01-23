import { BlogPost } from "@/types/blog";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BlogPostHeader } from "./BlogPostHeader";
import { BlogPostContent } from "./BlogPostContent";
import { BlogPostReaders } from "./BlogPostReaders";
import { BlogPostFooter } from "./BlogPostFooter";

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

  // Calculate seen/total from readers
  const totalReaders = post.readers?.length || 0;
  const seenReaders = post.readers?.filter(r => r.readAt).length || 0;

  return (
    <Card
      className={cn(
        "overflow-hidden shadow-sm hover:shadow-md transition-shadow",
        isScheduled ? "bg-[#FFF8E0]" : "bg-white"
      )}
    >
      {/* Main content area */}
      <div className="p-6">
        <BlogPostHeader
          post={post}
          isExpanded={isExpanded}
          isRead={isRead}
          onExpandChange={onExpandChange}
        />

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <BlogPostContent post={post} />
          </div>
        )}

        {/* Footer with author and category */}
        <BlogPostFooter post={post} />
      </div>

      {/* Readers section - separated with border */}
      {post.readers && post.readers.length > 0 && (
        <BlogPostReaders 
          readers={post.readers} 
          internalOnly={post.internalOnly}
          seenCount={seenReaders}
          totalCount={totalReaders}
        />
      )}
    </Card>
  );
}
