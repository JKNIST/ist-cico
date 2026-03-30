import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import { BlogPostList } from "@/components/blog/BlogPostList";
import { BlogCategoryFilter } from "@/components/blog/BlogCategoryFilter";
import { FilterOptions } from "@/components/blog/FilterOptions";
import { BlogPostForm } from "@/components/BlogPostForm";
import { allBlogPosts } from "@/data/blog";
import { BlogCategory } from "@/types/blog";
import { useDepartmentFilter } from "@/contexts/DepartmentFilterContext";
import { filterByDepartmentsAndGroups } from "@/lib/groupFilterUtils";

export default function Blog() {
  const { t } = useTranslation();
  const { selectedDepartments, selectedGroups } = useDepartmentFilter();
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

  // Derive parent departments from selected groups (e.g., "Lingon-Röd" → "Lingon")
  const parentDepartmentsFromGroups = [...new Set(
    selectedGroups.map(g => g.split("-")[0])
  )];

  // Combine explicit department selections with implicit ones from groups
  const effectiveDepartments = [...new Set([
    ...selectedDepartments,
    ...parentDepartmentsFromGroups,
  ])];

  // Final filter combining department, group, and internal logic
  const finalFilteredPosts = (selectedDepartments.length === 0 && selectedGroups.length === 0)
    ? filteredPosts
    : filteredPosts.filter(post => {
        const postDepartments = post.departments || [];
        const postGroups = post.groups || [];

        // Global internal posts (no dept/group targeting) always visible
        if (post.internalOnly && postDepartments.length === 0 && postGroups.length === 0) {
          return true;
        }

        // If post targets specific groups, check group match
        if (postGroups.length > 0 && selectedGroups.length > 0) {
          if (postGroups.some(g => selectedGroups.includes(g))) return true;
        }

        // Check if post targets a department that matches (either directly selected or parent of selected group)
        if (postDepartments.length > 0 && effectiveDepartments.length > 0) {
          if (postDepartments.some(d => effectiveDepartments.includes(d))) return true;
        }

        return false;
      });

  // Sortering: Nyaste först baserat på publishedDate
  const sortedPosts = [...finalFilteredPosts].sort((a, b) => {
    return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
  });

  const activeFiltersCount = [showInternalOnly, showUnpublished].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t("blog.title")}</h1>
          <Button 
            onClick={() => setShowNewPostForm(true)}
            className="bg-[#287E95] hover:bg-[#287E95]/90 text-white gap-2"
          >
            <PenLine className="h-4 w-4" />
            {t("blog.createPost") || "SKAPA ETT INLÄGG"}
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
