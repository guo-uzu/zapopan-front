import { Dispatch, SetStateAction } from "react";
import { Card, CardHeader } from "../ui/card";
import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";

type ResponsesCardContainerProps = {
  upperMenu: boolean;
  handleTagClick: (tag: string) => void;
  setUpperMenu: Dispatch<SetStateAction<boolean>>;
};

export const ResponsesCardContainer = ({
  upperMenu,
  handleTagClick,
  setUpperMenu,
}: ResponsesCardContainerProps) => {
  if (!upperMenu)
    return (
      <div className={`flex flex-col gap-6 mb-10`}>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ColumnsBitacoraOpts.area_id
            .filter(
              (area) =>
                !ColumnsBitacoraOpts.excluded_view.find(
                  (data) => area.id === data.id,
                ),
            )
            .map((area) => (
              <Card
                key={area.value}
                onClick={() => {
                  handleTagClick(area.label);
                  setUpperMenu((prev) => !prev);
                }}
                className="rounded-lg hover:shadow-md transition-all duration-200"
              >
                <CardHeader>{area.value}</CardHeader>
              </Card>
            ))}
        </div>
      </div>
    );
};
