import { useState, useEffect } from "react";
import type { ResponseFromAPI } from "@/types/respuestas";
import { sanitizeSearchTerm } from "@/lib/sanitizeInput";
import useDebouncedValue from "../bitacora/useDebounce";
import { fetchResponses } from "@/lib/responses/fetchResponses";
import { useTriggerRealtimeDB } from "./useTriggerRealtimeDB";

const useResponsesFetch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [upperMenu, setUpperMenu] = useState(false);
  const [responses, setResponses] = useState<ResponseFromAPI[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingResponses, setIsFetchingResponses] = useState(false);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 800);
  const realtimeDB = useTriggerRealtimeDB();

  // this function only works to avoid sql injections with the sanitize function
  const handleSearchTerm = (input: string) => {
    setSearchTerm(sanitizeSearchTerm(input));
  };

  const handleTagClick = (tag: string) => {
    const tagWithHash = `#${tag}`;
    if (searchTerm.includes(tagWithHash)) return;
    setSearchTerm((prev) => (prev ? `${prev}, ${tagWithHash}` : tagWithHash));
  };

  const handleFetchData = async () => {
    setIsFetchingResponses(true);
    const data = await fetchResponses(debouncedSearchTerm);
    setResponses(data);
    setIsFetchingResponses(false);
  };

  useEffect(() => {
    if (
      searchTerm &&
      debouncedSearchTerm &&
      searchTerm === debouncedSearchTerm
    ) {
      setIsSearching(false);
      handleFetchData();
    }
  }, [debouncedSearchTerm, realtimeDB]);

  useEffect(() => {
    if (searchTerm !== "") {
      setIsSearching(true);
      setUpperMenu(true);
      return;
    }
    setUpperMenu(false);
    setIsSearching(false);
    setResponses([]);
  }, [searchTerm]);

  return {
    searchTerm,
    setUpperMenu,
    upperMenu,
    isSearching,
    handleSearchTerm,
    handleTagClick,
    responses,
    isFetchingResponses,
  };
};

export { useResponsesFetch };
