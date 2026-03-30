import { BlogPost } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Paperclip } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { BlogPostActions } from "./BlogPostActions";
import { formatDistanceToNow } from "date-fns";
import { sv, enUS, nb } from "date-fns/locale";

interface BlogPostHeaderProps {
  post: BlogPost;
  isExpanded: boolean;
  isRead: boolean;
  onExpandChange: (isExpanded: boolean) => void;
}

export function BlogPostHeader({
  post,
  isExpanded,
  isRead,
  onExpandChange,
}: BlogPostHeaderProps) {
  const { t, i18n } = useTranslation();

  const getDateLocale = () => {
    switch (i18n.language) {
      case 'sv': return sv;
      case 'no': return nb;
      default: return enUS;
    }
  };

  const publishedAgo = formatDistanceToNow(new Date(post.publishedDate), {
    addSuffix: true,
    locale: getDateLocale(),
  });

  const hasAttachments = post.attachments && post.attachments.length > 0;

  return (
    <div className="space-y-3">
      {/* Row 1: Title + Status + Menu */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">{post.title}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Internal Badge */}
          {post.internalOnly && (
            <Badge className="bg-[#7C3AED] text-white hover:bg-[#7C3AED]/90 font-medium">
              Intern
            </Badge>
          )}
          {/* Status Badge - GREEN for published */}
          <Badge
            className={cn(
              "font-medium",
              post.status === "Publicerad"
                ? "bg-[#22A06B] text-white hover:bg-[#22A06B]/90"
                : "bg-amber-100 text-amber-700 hover:bg-amber-100/90"
            )}
          >
            {post.status === "Publicerad" 
              ? t("blog.status.published") 
              : t("blog.status.scheduled")}
          </Badge>

          {/* Actions Menu */}
          <BlogPostActions postId={post.id} />
        </div>
      </div>

      {/* Row 2: Groups/Classes badges + Attachment icon + Published date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Group/Class badges in TEAL/BLUE */}
          {post.groups?.map((groupName) => (
            <Badge 
              key={groupName} 
              className="bg-[#287E95] text-white hover:bg-[#287E95]/90 font-normal"
            >
              {groupName}
            </Badge>
          ))}

          {/* Department badges if no groups - also TEAL/BLUE */}
          {!post.groups?.length && post.departments?.map((dept) => (
            <Badge 
              key={dept} 
              className="bg-[#287E95] text-white hover:bg-[#287E95]/90 font-normal"
            >
              {dept}
            </Badge>
          ))}

          {/* Attachment indicator */}
          {hasAttachments && (
            <Paperclip className="h-4 w-4 text-muted-foreground ml-1" />
          )}
        </div>

        {/* Published date in teal */}
        <span className="text-sm text-[#287E95]">
          {t("blog.publishedAgo", { time: publishedAgo }) || `Inlägget publicerades ${publishedAgo}`}
        </span>
      </div>

      {/* Content preview when collapsed */}
      {!isExpanded && post.content && (
        <p className="text-muted-foreground text-sm line-clamp-2 mt-2">
          {post.content.slice(0, 150)}...
        </p>
      )}

      {/* Expand/Collapse button - centered with rounded corners */}
      <div className="flex justify-center pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExpandChange(!isExpanded)}
          className="gap-1 text-muted-foreground border-gray-300 hover:bg-gray-50 rounded-full px-6"
        >
          {isExpanded ? (
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
    </div>
  );
}
