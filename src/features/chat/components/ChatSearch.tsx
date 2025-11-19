import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatSearchProps {
  onSearch?: (query: string) => void;
}

export const ChatSearch = ({ onSearch }: ChatSearchProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="px-4 py-3 bg-background border-b">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Sök..."
          className="w-full pl-10 pr-4 py-2 text-sm border bg-muted rounded-md"
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};
