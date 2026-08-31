import { Button } from "../ui/button";

const FilterPill = ({ name }: { name: string }) => {
  return (
    <Button size="xs" className="rounded-md text-current/70" variant="outline">
      {name}
    </Button>
  );
};
export default FilterPill;
