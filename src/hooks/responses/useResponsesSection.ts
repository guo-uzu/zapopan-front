import { useState, useEffect } from "react";
import type { ResponseFromAPI, DefaultForm } from "@/types/respuestas";
import { sendResponse } from "@/lib/data/sendResponse";
import { updateResponse } from "@/lib/data/updateResponse";
import { toast } from "sonner";
import { deleteRespuesta } from "@/hooks/deleteRow";

export const useResponsesSection = () => {
  const [selectedResponse, setSelectedResponse] = useState<ResponseFromAPI>();

  const [formDefaultData, setFormDefaultData] = useState<DefaultForm>({
    title: "",
    jjfDescription: "",
    gobDescription: "",
    selectedAreas: [],
  });

  const [isEditing, setEditing] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleViewDialog = (item: ResponseFromAPI) => {
    setSelectedResponse(item);
    setOpenDialog(!openDialog);
  };

  const handleEditRespuesta = async () => {
    setOpenSheet(true);
    setEditing(true);
    setOpenDialog(false);
    setFormDefaultData({
      id: selectedResponse?.id,
      title: selectedResponse?.title || "",
      jjfDescription: selectedResponse?.description_jjf || "",
      gobDescription: selectedResponse?.description_gob || "",
      selectedAreas: selectedResponse?.labels_areas || [],
    });
  };

  const handleDeleteRespuesta = async () => {
    toast.promise(deleteRespuesta(selectedResponse?.id), {
      loading: "Eliminando registro...",
      success: "Registro eliminado correctamente.",
      error: "Error eliminado este registro, intente nuevamente más tarde.",
      position: "top-center",
    });
  };

  const handleReset = () => {
    setFormDefaultData({
      id: "",
      title: "",
      jjfDescription: "",
      gobDescription: "",
      selectedAreas: [],
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formDefaultData.selectedAreas.length === 0) {
      toast.error("Error. Verifica los datos ingresados", {
        position: "top-center",
      });
      return;
    }
    if (!isEditing) {
      const formData: DefaultForm = {
        title: formDefaultData.title,
        jjfDescription: formDefaultData.jjfDescription,
        gobDescription: formDefaultData.gobDescription,
        selectedAreas: formDefaultData.selectedAreas,
      };
      toast.promise(sendResponse(formData), {
        loading: "Cargando...",
        success: (response) => {
          if (response.ok === true) {
            handleReset();
            // fetchResponses(setResponses);
          }
          return "Respuesta creada";
        },
        error: "Error",
        position: "top-center",
      });
    } else {
      const formData: DefaultForm = formDefaultData;
      toast.promise(updateResponse(formData), {
        loading: "Cargando...",
        success: (response: { ok: boolean }) => {
          if (response.ok === true) {
          }
          handleReset();
          // fetchResponses(setResponses);
          return "Respuesta actualizada";
        },
        error: "Error",
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    if (!openSheet) {
      setEditing(false);
    }
  }, [openSheet]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenSheet((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return {
    openSheet,
    setOpenSheet,
    isEditing,
    handleReset,
    handleFormSubmit,
    formDefaultData,
    setFormDefaultData,
    handleViewDialog,
    openDialog,
    setOpenDialog,
    selectedResponse,
    handleDeleteRespuesta,
    handleEditRespuesta,
  };
};
