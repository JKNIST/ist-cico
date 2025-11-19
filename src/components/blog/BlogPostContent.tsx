import { BlogPost } from "@/types/blog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface BlogPostContentProps {
  post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const { t } = useTranslation();
  const [showFullContent, setShowFullContent] = useState(false);

  if (!post.content) {
    return null;
  }

  const lines = post.content.split("\n");
  const shouldTruncate = lines.length > 6;
  const displayedContent = showFullContent || !shouldTruncate
    ? post.content
    : lines.slice(0, 6).join("\n");

  return (
    <div className="space-y-4">
      <div className="prose prose-sm max-w-none">
        <div className="whitespace-pre-wrap text-foreground">{displayedContent}</div>
      </div>

      {shouldTruncate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFullContent(!showFullContent)}
          className="text-primary hover:bg-[#FFF8E0]"
        >
          {showFullContent ? "Visa mindre" : "Visa mer"}
        </Button>
      )}

      {post.hasImages && post.images && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${post.title} - bild ${index + 1}`}
              className="rounded-lg object-cover w-full h-48 border"
            />
          ))}
        </div>
      )}
    </div>
  );
}
