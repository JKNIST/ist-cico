import { BlogPost } from "@/types/blog";
import { useTranslation } from "react-i18next";

interface BlogPostFooterProps {
  post: BlogPost;
}

export function BlogPostFooter({ post }: BlogPostFooterProps) {
  const { t } = useTranslation();

  // Get category display name
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "VIKTIGA DATUM":
        return t("blog.categories.importantdates");
      case "REGELBUNDNA UPPDATERINGAR":
        return t("blog.categories.regularupdates");
      case "INFORMATION":
        return t("blog.categories.information");
      default:
        return category;
    }
  };

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
      <div className="text-sm text-muted-foreground">
        <span>{t("blog.writtenBy") || "Skrivet av"}: </span>
        <span className="font-medium text-foreground">{post.author}</span>
        <span className="mx-2">•</span>
        <span>{post.date}</span>
      </div>
      <span className="text-sm text-muted-foreground capitalize">
        {getCategoryLabel(post.category)}
      </span>
    </div>
  );
}
