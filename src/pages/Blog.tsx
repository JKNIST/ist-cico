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

  // Apply department and group filtering
  const departmentAndGroupFilteredPosts = filterByDepartmentsAndGroups(
    filteredPosts,
    selectedDepartments,
    selectedGroups,
    (post) => post.departments?.[0] ?? (post.internalOnly ? selectedDepartments[0] : undefined),
    (post) => post.groups
  );

  // Final filter: internal posts without department/group targeting should still be visible
  const finalFilteredPosts = (selectedDepartments.length === 0 && selectedGroups.length === 0) 
    ? filteredPosts 
    : departmentAndGroupFilteredPosts.filter(post => {
        const postDepartments = post.departments || [];
        const postGroups = post.groups || [];
        const isInternalGlobalPost = post.internalOnly && postDepartments.length === 0 && postGroups.length === 0;

        if (isInternalGlobalPost) {
          return true;
        }
        
        // If groups are selected, check if post has any matching group
        if (selectedGroups.length > 0) {
          const hasMatchingGroup = postGroups.some(group => selectedGroups.includes(group));
          if (hasMatchingGroup) return true;
        }
        
        // If departments are selected (and no matching groups), check departments
        if (selectedDepartments.length > 0) {
          const hasMatchingDepartment = postDepartments.some(dept => selectedDepartments.includes(dept));
          return hasMatchingDepartment;
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
