"use client"
import { Search } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function InputSearchGrid() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);
  return (
    <InputGroup className="flex">
      <InputGroupAddon align="inline-start">
        <Search className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput
        type="text"
        id="inline-start-input"
        placeholder="Busca por nombre, etiqueta, reporte"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </InputGroup>
  )
}
