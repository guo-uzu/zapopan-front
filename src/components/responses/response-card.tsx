import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { formatDataFrom, getUserFullName } from "@/lib/formatters/responses";
import { Hash } from "lucide-react";
import { Badge } from "../ui/badge";
import type { ResponseFromAPI } from "@/types/respuestas";
import { Dispatch, SetStateAction } from "react";
import { CardActions } from "./card-actions";

type ResponseCard = {
  openDialog: boolean;
  selectedResponse?: ResponseFromAPI;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  handleTagClick: (tag: string) => void;
  handleEditRespuesta: () => Promise<void>;
  handleDeleteRespuesta: () => Promise<void>;
};

export const ResponseCard = ({
  openDialog,
  selectedResponse,
  setOpenDialog,
  handleTagClick,
  handleDeleteRespuesta,
  handleEditRespuesta,
}: ResponseCard) => {
  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedResponse?.title}</DialogTitle>
          <DialogDescription className="flex flex-col gap-2 text-xs mt-2">
            <div className="flex items-center justify-between">
              <span className="flex flex-row items-center justify-between text-xs pt-2 w-full font-medium text-zinc-700">
                {getUserFullName(selectedResponse?.user_id)}
              </span>
              <span>{formatDataFrom(selectedResponse?.created_at)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex flex-row items-center justify-between text-xs pt-2 w-full font-medium text-zinc-700">
                {getUserFullName(selectedResponse?.latest_updated_user_id)}
              </span>
              <span>{formatDataFrom(selectedResponse?.updated_at)}</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogContent className="flex flex-col gap-4 max-h-96 overflow-y-scroll">
          <div>
            <h2 className="text-sm font-bold">JJF</h2>
            <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap break-words">
              {selectedResponse?.description_jjf}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold">Gobierno de Zapopan</h2>
            <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap break-words">
              {selectedResponse?.description_gob}
            </p>
          </div>
        </DialogContent>
        <DialogFooter>
          <div className="flex flex-col w-full gap-8">
            <div className="flex flex-wrap gap-1.5 mt-auto w-full">
              {selectedResponse?.labels_areas?.map((tag) => (
                <Badge
                  key={tag.value}
                  variant="secondary"
                  className="cursor-pointer hover:bg-zinc-200/80 transition-colors px-2 py-0.5 text-xs font-normal"
                  // 3. UPDATED CLICK HANDLER
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
            <CardActions
              handleEditRespuesta={handleEditRespuesta}
              handleDeleteRespuesta={handleDeleteRespuesta}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
