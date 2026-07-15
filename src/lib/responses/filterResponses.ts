import { type ResponseFromAPI } from "@/types/respuestas";

type filteredReponsesProps = {
  responses: ResponseFromAPI[];
  searchTerm: string;
};

const filterResponses = ({ responses, searchTerm }: filteredReponsesProps) => {
  if (!searchTerm) return responses;

  const terms = searchTerm
    .toLowerCase()
    .split(",")
    .map((term) => term.trim())
    .filter((term) => term.length > 0);

  if (terms.length === 0) return responses;

  return responses.filter((response) =>
    terms.some((term) => {
      const matchesTitle = response.title.toLowerCase().includes(term);
      const matchesDesc = response.description_jjf.toLowerCase().includes(term);
      const matchesTagsAreas = term.startsWith("#")
        ? response.labels_areas.some((tag) =>
            tag.label.toLowerCase().includes(term.slice(1)),
          )
        : false;

      return matchesTitle || matchesDesc || matchesTagsAreas;
    }),
  );
};

export { filterResponses };
