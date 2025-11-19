import { BlogCategory } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface BlogCategoryFilterProps {
  selectedCategory: BlogCategory;
  onSelectCategory: (category: BlogCategory) => void;
}

const categories: BlogCategory[] = [
  "ALLA",
  "VIKTIGA DATUM",
  "REGELBUNDNA UPPDATERINGAR",
  "INFORMATION",
];

export function BlogCategoryFilter({
  selectedCategory,
  onSelectCategory,
}: BlogCategoryFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant="outline"
          onClick={() => onSelectCategory(category)}
          className={cn(
            "border-2 transition-colors",
            selectedCategory === category
              ? "bg-[#F2FCE2] border-green-300 text-green-700 hover:bg-[#F2FCE2]/80"
              : "bg-white border-gray-200 hover:bg-gray-50"
          )}
        >
          {t(`blog.categories.${category.toLowerCase().replace(/ /g, "")}`)}
        </Button>
      ))}
    </div>
  );
}
