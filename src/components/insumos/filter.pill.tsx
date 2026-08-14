import { Button } from "../ui/button"

const FilterPill = ({ name }: { name: string }) => {
  return (
    <Button size="xs" className="rounded-2xl text-current/70" variant="outline">{name}</Button>
  )
}
export default FilterPill
