import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchMessagesProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchMessages({ onSearch, placeholder = "Search messages..." }: SearchMessagesProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="text-muted-foreground hover:text-foreground"
        title="Search messages"
      >
        <Search className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-1 max-w-xs">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="pl-9 pr-8 h-9"
          autoFocus
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={clearSearch}
        className="text-muted-foreground"
      >
        Cancel
      </Button>
    </div>
  );
}
