import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BlogPostList } from "@/components/blog/BlogPostList";
import { BlogCategoryFilter } from "@/components/blog/BlogCategoryFilter";
import { FilterOptions } from "@/components/blog/FilterOptions";
import { BlogPostForm } from "@/components/BlogPostForm";
import { allBlogPosts } from "@/data/blog";
import { BlogCategory } from "@/types/blog";

export default function Blog() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>("ALLA");
  const [showInternalOnly, setShowInternalOnly] = useState(false);
  const [showUnpublished, setShowUnpublished] = useState(false);
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  // Filtrering
  const filteredPosts = allBlogPosts.filter((post) => {
    // Kategorifilter
    if (selectedCategory !== "ALLA" && post.category !== selectedCategory) {
      return false;
    }

    // Internt-filter
    if (showInternalOnly && !post.internalOnly) {
      return false;
    }

    // Opublicerad-filter (visa även schemalagda)
    if (!showUnpublished && post.status === "Schemalagd") {
      return false;
    }

    return true;
  });

  // Sortering: Nyaste först baserat på publishedDate
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
  });

  const activeFiltersCount = [showInternalOnly, showUnpublished].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t("blog.title")}</h1>
          <Button onClick={() => setShowNewPostForm(true)}>
            <Plus className="h-4 w-4" />
            {t("blog.newPost")}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <BlogCategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <FilterOptions
            showInternalOnly={showInternalOnly}
            showUnpublished={showUnpublished}
            onShowInternalOnlyChange={setShowInternalOnly}
            onShowUnpublishedChange={setShowUnpublished}
            activeFiltersCount={activeFiltersCount}
          />
        </div>

        {/* Blog Posts List */}
        <BlogPostList posts={sortedPosts} />

        {/* New Post Form Dialog */}
        <BlogPostForm open={showNewPostForm} onOpenChange={setShowNewPostForm} />
      </div>
    </div>
  );
}
