import { ResponseFromAPI } from "@/types/respuestas";
import { Button } from "../ui/button";

type CleanFiltersProps = {
  responses: ResponseFromAPI[];
  searchTerm: string;
  handleSearchTerm: (input: string) => void;
};

export const CleanFilters = ({
  searchTerm,
  responses,
  handleSearchTerm,
}: CleanFiltersProps) => {
  if (responses.length === 0)
    return (
      <div className="col-span-full text-center py-10 text-muted-foreground">
        <p>No se encontraron resultados para &quot;{searchTerm}&quot; </p>
        <Button variant="link" onClick={() => handleSearchTerm("")}>
          Limpiar filtros
        </Button>
      </div>
    );
};
