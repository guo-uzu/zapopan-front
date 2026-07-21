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
  handleCopyText: (text: string) => void;
};

export const ResponseCard = ({
  openDialog,
  selectedResponse,
  setOpenDialog,
  handleTagClick,
  handleDeleteRespuesta,
  handleEditRespuesta,
  handleCopyText,
}: ResponseCard) => {
  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedResponse?.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 max-h-96 overflow-y-scroll">
          <div>
            <h2 className="text-sm font-bold">Respuesta en tono JJF:</h2>
            <p
              className="text-sm cursor-pointer text-zinc-600 leading-relaxed whitespace-pre-wrap break-words"
              onClick={() =>
                handleCopyText(
                  selectedResponse ? selectedResponse?.description_jjf : "",
                )
              }
            >
              {selectedResponse?.description_jjf}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold">Gobierno de Zapopan</h2>
            <p
              onClick={() =>
                handleCopyText(
                  selectedResponse ? selectedResponse?.description_gob : "",
                )
              }
              className="cursor-pointer text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap break-words"
            >
              {selectedResponse?.description_gob}
            </p>
          </div>
        </div>
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
            <div className="flex flex-col text-xs">
              <h2 className="font-black">Hecho por:</h2>
              <div className="flex items-center justify-between">
                <span>{selectedResponse?.full_name}</span>
                <span>{formatDataFrom(selectedResponse?.created_at)}</span>
              </div>
            </div>
            {selectedResponse?.lastest_updated_user_full_name ? (
              <div className="flex flex-col text-xs">
                <h2 className="font-bold">Última edición por:</h2>
                <div className="flex items-center justify-between">
                  <span>
                    {getUserFullName(
                      selectedResponse?.lastest_updated_user_full_name,
                    )}
                  </span>
                  <span>{formatDataFrom(selectedResponse?.updated_at)}</span>
                </div>
              </div>
            ) : (
              ""
            )}
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
