import { BlogPost } from "@/types/blog";
import { useTranslation } from "react-i18next";
import { AttachmentItem } from "./AttachmentItem";

interface BlogPostContentProps {
  post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Full content - no truncation since header handles expand/collapse */}
      {post.content && (
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-foreground">{post.content}</div>
        </div>
      )}

      {/* Images as thumbnails */}
      {post.hasImages && post.images && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {post.images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`${post.title} - bild ${index + 1}`}
                className="rounded-lg object-cover w-full h-24 border cursor-pointer hover:opacity-90 transition-opacity"
              />
            </div>
          ))}
        </div>
      )}

      {/* Attachments */}
      {post.attachments && post.attachments.length > 0 && (
        <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
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
