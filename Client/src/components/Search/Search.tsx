import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";

type Props = {
  onSearch: (query: string) => void;
};

const SearchBar = ({ onSearch }: Props) => {
  const [input, setInput] = useState("");

  const debouncedSearch = debounce((value: string) => {
    onSearch(value);
  }, 300);

  useEffect(() => {
    debouncedSearch(input);
    return () => debouncedSearch.cancel(); 
  }, [input]);

  return (
    <Input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Search by long URL or short code..."
      className="w-full md:max-w-sm"
    />
  );
};

export default SearchBar;
