import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import type { ResponseFromAPI } from "@/types/respuestas";
import { formatDataFrom } from "@/lib/formatters/responses";
import { Hash } from "lucide-react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

type ResponsesFilteredProps = {
  upperMenu: boolean;
  responses: ResponseFromAPI[];
  handleViewDialog: (item: ResponseFromAPI) => void;
  handleTagClick: (tag: string) => void;
  isSearching: boolean;
  isFetchingResponses: boolean;
};

export const ResponsesFiltered = ({
  upperMenu,
  responses,
  handleViewDialog,
  handleTagClick,
  isSearching,
  isFetchingResponses,
}: ResponsesFilteredProps) => {
  if (isSearching || isFetchingResponses)
    return <Skeleton className="w-full h-[800px]" />;

  if (upperMenu)
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {responses.map((response) => (
          <Card
            onClick={() => handleViewDialog(response)}
            key={response.id}
            className="overflow-hidden rounded-lg hover:shadow-md transition-all duration-200 border-zinc-200"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold leading-tight truncate max-w-[300px]">
                {response.title}
              </CardTitle>
              <CardDescription className="flex items-center justify-between text-xs mt-2">
                <span className="font-medium text-zinc-700 truncate max-w-[120px]">
                  {response.full_name}
                </span>
                <span>{formatDataFrom(response.created_at)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <h2 className="text-sm font-bold">JJF</h2>
                <p className="line-clamp-4 text-sm text-zinc-600 leading-relaxed">
                  {response.description_jjf}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-bold">Gobierno de Zapopan</h2>
                <p className="line-clamp-4 text-sm text-zinc-600 leading-relaxed">
                  {response.description_gob}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {response.labels_areas?.map((tag) => (
                  <Badge
                    key={tag.value}
                    variant="secondary"
                    className="cursor-pointer hover:bg-zinc-200/80 transition-colors px-2 py-0.5 text-xs font-normal"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTagClick(tag.label);
                    }}
                  >
                    <Hash className="w-3 h-3 mr-1 opacity-50" />
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
};
