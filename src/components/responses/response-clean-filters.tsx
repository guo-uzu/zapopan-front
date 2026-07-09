import { ResponseFromAPI } from "@/types/respuestas";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";

type CleanFiltersProps = {
  filteredResponses: ResponseFromAPI[];
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
};

export const CleanFilters = ({
  filteredResponses,
  searchTerm,
  setSearchTerm,
}: CleanFiltersProps) => {
  if (filteredResponses.length === 0)
    return (
      <div>
        <div className="col-span-full text-center py-10 text-muted-foreground">
          <p>No se encontraron resultados para &quot;{searchTerm}&quot;</p>
          <Button variant="link" onClick={() => setSearchTerm("")}>
            Limpiar filtros
          </Button>
        </div>
      </div>
    );
};
