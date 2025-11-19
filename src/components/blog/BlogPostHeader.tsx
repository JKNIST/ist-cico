import { BlogPost } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Lock, Calendar, Building2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { mockGroups } from "@/data/groups/mockGroups";

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
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      {/* Title and Expand Button */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onExpandChange(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Tags and Status Badges */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Category Badge */}
        <Badge
          variant="outline"
          className={cn(
            "border-2",
            post.category === "VIKTIGA DATUM" && "bg-red-50 text-red-700 border-red-300",
            post.category === "REGELBUNDNA UPPDATERINGAR" &&
              "bg-blue-50 text-blue-700 border-blue-300",
            post.category === "INFORMATION" && "bg-purple-50 text-purple-700 border-purple-300"
          )}
        >
          {post.category}
        </Badge>

        {/* Department Badges */}
        {post.departments?.map((dept) => (
          <Badge 
            key={dept} 
            variant="secondary"
            className="bg-teal-50 text-teal-700 border border-teal-200"
          >
            <Building2 className="h-3 w-3 mr-1" />
            {dept}
          </Badge>
        ))}

        {/* Group Badges */}
        {post.groups?.map((groupFullName) => {
          const group = mockGroups.find(g => g.fullName === groupFullName);
          return (
            <Badge 
              key={groupFullName} 
              variant="secondary"
              className="border"
              style={
                group?.color
                  ? {
                      backgroundColor: `${group.color}20`,
                      borderColor: group.color,
                      color: group.color,
                    }
                  : {}
              }
            >
              <Users className="h-3 w-3 mr-1" />
              {groupFullName}
            </Badge>
          );
        })}

        {/* Tags */}
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}

        {/* Status Badges */}
        {post.status === "Schemalagd" && (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-300"
          >
            <Calendar className="h-3 w-3 mr-1" />
            {t("blog.status.scheduled")}
          </Badge>
        )}

        {!isRead && post.status === "Publicerad" && (
          <Badge
            variant="outline"
            className="bg-[#FEC6A1] text-amber-700 border-amber-300"
          >
            {t("blog.status.unread")}
          </Badge>
        )}

        {post.internalOnly && (
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-700 border-purple-300"
          >
            <Lock className="h-3 w-3 mr-1" />
            Internt
          </Badge>
        )}
      </div>
    </div>
  );
}
