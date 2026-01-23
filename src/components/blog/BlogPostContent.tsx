import { BlogPost } from "@/types/blog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AttachmentItem } from "./AttachmentItem";

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
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFullContent(!showFullContent)}
            className="gap-1 text-muted-foreground border-gray-300 hover:bg-gray-50"
          >
            {showFullContent ? (
              <>
                {t("blog.showLess")}
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                {t("blog.showMore")}
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Images */}
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

      {/* Attachments */}
      {post.attachments && post.attachments.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            {t("blog.attachments") || "Bilagor"}
          </h4>
          <div className="space-y-2">
            {post.attachments.map((attachment) => (
              <AttachmentItem key={attachment.id} attachment={attachment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
