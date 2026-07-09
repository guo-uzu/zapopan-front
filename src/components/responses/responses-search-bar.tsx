import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type ResponsesSearchBarProps = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
};

export const ResponsesSearchBar = ({
  searchTerm,
  setSearchTerm,
}: ResponsesSearchBarProps) => {
  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Respuestas</h1>
        <p className="text-muted-foreground">
          Separa con comas para múltiples búsquedas (ej: obras, alumbrado)
        </p>
      </div>
      <div className="relative flex flex-col gap-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por #etiqueta, palabra..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-black"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};
