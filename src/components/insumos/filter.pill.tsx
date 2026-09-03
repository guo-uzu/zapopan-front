"use client"
import { useDebouncedCallback } from "use-debounce";
import { Button } from "../ui/button";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Variant = "default" | "secondary";

const FilterPill = ({ name }: { name: string }) => {
  const searchParams = useSearchParams();
  const [variant, setVariant] = useState<Variant>("secondary")
  const pathname = usePathname();
  const { replace } = useRouter();

  const label = `#${name}`;

  const handleSearch = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    const isActive = params.get("search") === label;

    if (isActive) {
      params.delete("search");
    } else {
      params.set("search", label);
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 600);

  useEffect(() => {
    const isMatch = searchParams.get("search") === label;
    setVariant(isMatch ? "default" : "secondary");
  }, [searchParams, label])

  return (
    <Button variant={variant} onClick={handleSearch} size="xs" className="rounded-md cursor-pointer">
      {name}
    </Button>
  );
};
export default FilterPill;
