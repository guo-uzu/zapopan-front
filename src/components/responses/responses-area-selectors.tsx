import { Badge } from "../ui/badge";
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";

type ResponsesAreaSelectorsProps = {
  upperMenu: boolean;
  handleTagClick: (tag: string) => void;
  debouncedText: string;
};

export const ResponsesAreaSelectors = ({
  upperMenu,
  handleTagClick,
  debouncedText,
}: ResponsesAreaSelectorsProps) => {
  const separatedText = debouncedText.split(",").map((e) => e.trim());
  const tags = separatedText
    .filter((e) => e.includes("#"))
    .map((e) => e.slice(1, e.length));

  if (upperMenu)
    return (
      <div className="scroller w-full flex flex-row gap-x-2 overflow-x-scroll text-xs py-2 px-8">
        {ColumnsBitacoraOpts.area_id
          .filter(
            (area) =>
              !ColumnsBitacoraOpts.excluded_view.find(
                (data) => area.id === data.id,
              ),
          )
          .map((area) => {
            if (tags.includes(area.label))
              return (
                <Badge
                  key={area.value}
                  variant="outline"
                  onClick={() => handleTagClick(area.label)}
                  className="cursor-pointer bg-zinc-800 text-zinc-200 border-2 border-zinc-800 transition-colors px-2 py-0.5 text-xs font-normal"
                >
                  {area.value}
                </Badge>
              );
            return (
              <Badge
                key={area.value}
                variant="outline"
                onClick={() => handleTagClick(area.label)}
                className="cursor-pointer hover:bg-zinc-200/80 text-zinc-800 border-zinc-200 transition-colors px-2 py-0.5 text-xs font-normal"
              >
                {area.value}
              </Badge>
            );
          })}
      </div>
    );
};
