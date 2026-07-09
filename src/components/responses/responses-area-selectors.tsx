import { Badge } from "../ui/badge";
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";

type ResponsesAreaSelectorsProps = {
  upperMenu: boolean;
  handleTagClick: (tag: string) => void;
};

export const ResponsesAreaSelectors = ({
  upperMenu,
  handleTagClick,
}: ResponsesAreaSelectorsProps) => {
  if (upperMenu)
    return (
      <div className="scroller w-full flex flex-row gap-x-2 overflow-x-scroll text-xs py-2 px-8">
        <Badge>Áreas responsables</Badge>
        {ColumnsBitacoraOpts.area_id.map((area) => (
          <Badge
            key={area.value}
            variant="outline"
            onClick={() => handleTagClick(area.label)}
            className="cursor-pointer hover:bg-zinc-200/80 transition-colors px-2 py-0.5 text-xs font-normal"
          >
            {area.value}
          </Badge>
        ))}
      </div>
    );
};
