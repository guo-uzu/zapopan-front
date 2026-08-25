import FilterPill from "./filter.pill";

const FilterLabels = ({
  labels,
}: {
  labels: { data: { name: string; id_public: string }[]; error: string | null };
}) => {
  return (
    <div className="flex gap-x-2 overflow-x-scroll py-4">
      {labels.data.map((label) => (
        <FilterPill name={label.name} />
      ))}
      {labels.data.map((label) => (
        <FilterPill name={label.name} />
      ))}
      {labels.data.map((label) => (
        <FilterPill name={label.name} />
      ))}
      {labels.data.map((label) => (
        <FilterPill name={label.name} />
      ))}
      {labels.data.map((label) => (
        <FilterPill name={label.name} />
      ))}
    </div>
  );
};
export default FilterLabels;
