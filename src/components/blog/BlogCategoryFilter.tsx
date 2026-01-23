import { BlogCategory } from "@/types/blog";
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
    <div className="flex flex-wrap gap-6">
      {categories.map((category) => {
        // Map category to translation key
        const translationKey = category === "ALLA" 
          ? "alla"
          : category === "VIKTIGA DATUM" 
            ? "importantdates"
            : category === "REGELBUNDNA UPPDATERINGAR"
              ? "regularupdates"
              : "information";

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={cn(
              "relative pb-2 text-sm font-medium uppercase tracking-wide transition-colors",
              selectedCategory === category
                ? "text-[#287E95]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t(`blog.categories.${translationKey}`)}
            {selectedCategory === category && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#287E95] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
