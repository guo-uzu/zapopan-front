import { ResponseFromAPI } from "@/types/respuestas";
import { Button } from "../ui/button";

type CleanFiltersProps = {
  filteredResponses: ResponseFromAPI[];
  searchTerm: string;
  handleSearchTerm: (input: string) => void;
};

export const CleanFilters = ({
  filteredResponses,
  searchTerm,
  handleSearchTerm,
}: CleanFiltersProps) => {
  if (filteredResponses.length === 0)
    return (
      <div>
        <div className="col-span-full text-center py-10 text-muted-foreground">
          <p>No se encontraron resultados para &quot;{searchTerm}&quot;</p>
          <Button variant="link" onClick={() => handleSearchTerm("")}>
            Limpiar filtros
          </Button>
        </div>
      </div>
    );
};
