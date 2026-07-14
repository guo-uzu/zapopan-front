import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

type ResponsesSearchBarProps = {
  searchTerm: string;
  handleSearchTerm: (input: string) => void;
};

export const ResponsesSearchBar = ({
  searchTerm,
  handleSearchTerm,
}: ResponsesSearchBarProps) => {
  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Respuestas</h1>
        <span className="text-muted-foreground text-md">
          Separa con comas para múltiples búsquedas (ej: obras, alumbrado)
        </span>
      </div>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por #etiqueta, palabra..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => handleSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => handleSearchTerm("")}
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-black"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </>
  );
};
