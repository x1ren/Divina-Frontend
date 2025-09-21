import { useState, useEffect, useCallback } from "react";

export function useDebounceSearch(delay: number = 500) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setIsSearching(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  const handleSearch = useCallback((text: string) => {
    setSearchTerm(text);
  }, []);

  return {
    searchTerm,
    debouncedTerm,
    isSearching,
    handleSearch,
  };
}
