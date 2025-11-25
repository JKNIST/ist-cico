import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditorToolbar } from "@/components/blog/EditorToolbar";
import { CategorySection } from "@/components/blog/CategorySection";
import { RecipientsSection } from "@/components/blog/RecipientsSection";
import { PublicationSettings } from "@/components/blog/PublicationSettings";
import { useToast } from "@/hooks/use-toast";

interface BlogPostFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlogPostForm({ open, onOpenChange }: BlogPostFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [internalOnly, setInternalOnly] = useState(false);
  const [publicationDate, setPublicationDate] = useState<Date | undefined>(new Date());
  const [publicationTime, setPublicationTime] = useState("12:00");

  const handleSubmit = () => {
    if (!title || !content || !category) {
      toast({
        title: t("toast.fillRequiredFields"),
        description: t("toast.titleContentCategoryRequired"),
        variant: "destructive",
      });
      return;
    }

    // Här skulle backend-integration ske
    console.log("Skapa nytt inlägg:", {
      title,
      content,
      category,
      isImportant,
      internalOnly,
      publicationDate,
      publicationTime,
    });

    toast({
      title: t("toast.blogPostCreated"),
      description: t("toast.blogPostPublished"),
    });

    // Återställ formulär
    setTitle("");
    setContent("");
    setCategory("");
    setIsImportant(false);
    setInternalOnly(false);
    setPublicationDate(new Date());
    setPublicationTime("12:00");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("blog.form.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Titel */}
          <div className="space-y-2">
            <Input
              placeholder={t("blog.form.titlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium"
            />
          </div>

          {/* Editor Toolbar */}
          <EditorToolbar />

          {/* Innehåll */}
          <div className="space-y-2">
            <Textarea
              placeholder="Skriv ditt innehåll här..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] resize-y"
            />
          </div>

          {/* Kategori */}
          <CategorySection
            category={category}
            isImportant={isImportant}
            onCategoryChange={setCategory}
            onIsImportantChange={setIsImportant}
          />

          {/* Mottagare */}
          <RecipientsSection onInternalOnlyChange={setInternalOnly} />

          {/* Publiceringsinställningar */}
          <PublicationSettings
            publicationDate={publicationDate}
            publicationTime={publicationTime}
            onPublicationDateChange={setPublicationDate}
            onPublicationTimeChange={setPublicationTime}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("blog.form.cancel")}
            </Button>
            <Button onClick={handleSubmit}>{t("blog.form.publish")}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
