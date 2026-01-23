import { MoreVertical, Edit, Trash2, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

interface BlogPostActionsProps {
  postId: string;
}

export function BlogPostActions({ postId }: BlogPostActionsProps) {
  const { t } = useTranslation();

  const handleEdit = () => {
    console.log("Edit post:", postId);
    // TODO: Implement edit functionality
  };

  const handleDelete = () => {
    console.log("Delete post:", postId);
    // TODO: Implement delete functionality
  };

  const handleShare = () => {
    console.log("Share post:", postId);
    // TODO: Implement share functionality
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          {t("administration.edit") || "Redigera"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShare}>
          <Share className="h-4 w-4 mr-2" />
          {t("blog.share") || "Dela"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          {t("administration.delete") || "Ta bort"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
