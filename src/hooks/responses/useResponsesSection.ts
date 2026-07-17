import { useState, useEffect } from "react";
import type { ResponseFromAPI, DefaultForm } from "@/types/respuestas";
import { sendResponse } from "@/lib/data/sendResponse";
import { updateResponse } from "@/lib/data/updateResponse";
import { toast } from "sonner";
import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";
import { deleteRespuesta } from "@/hooks/deleteRow";
import { sanitizeSearchTerm } from "@/lib/sanitizeInput";
import { filterResponses } from "@/lib/responses/filterResponses";
import useDebouncedValue from "../bitacora/useDebounce";
import { fetchResponses } from "@/lib/responses/fetchResponses";

const supabase = SingletonClientSupabase.instance;

export const useResponsesSection = () => {
  const [responses, setResponses] = useState<ResponseFromAPI[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<ResponseFromAPI>();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 800);

  const [upperMenu, setUpperMenu] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [formDefaultData, setFormDefaultData] = useState<DefaultForm>({
    title: "",
    jjfDescription: "",
    gobDescription: "",
    selectedAreas: [],
  });

  const [isEditing, setEditing] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const filteredResponses = filterResponses({ responses, searchTerm });

  const handleViewDialog = (item: ResponseFromAPI) => {
    setSelectedResponse(item);
    setOpenDialog(!openDialog);
  };

  const handleSearchTerm = (input: string) => {
    setSearchTerm(sanitizeSearchTerm(input));
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

  const handleTagClick = (tag: string) => {
    const tagWithHash = `#${tag}`;
    if (searchTerm.includes(tagWithHash)) return;

    // If search is empty, just set the tag
    // If not empty, append with a comma
    setSearchTerm((prev) => (prev ? `${prev}, ${tagWithHash}` : tagWithHash));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (formDefaultData.selectedAreas.length === 0) {
      toast.error("Error. Verifica los datos ingresados", {
        position: "top-center",
      });
      setLoading(false);
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
            setLoading(false);
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
            setLoading(false);
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
    const handleFetchData = async () => {
      const data = await fetchResponses(debouncedSearchTerm);
      setResponses(data);
    };
    handleFetchData();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (searchTerm !== "") {
      setUpperMenu(true);
    } else if (searchTerm === "") {
      setUpperMenu(false);
    }
  }, [searchTerm]);

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

  useEffect(() => {
    const subscription = supabase
      .channel("changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "respuestas",
        },
        async () => {
          const data = await fetchResponses(debouncedSearchTerm);
          setResponses(data);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return {
    searchTerm,
    handleSearchTerm,
    openSheet,
    setOpenSheet,
    isEditing,
    upperMenu,
    handleTagClick,
    handleReset,
    handleFormSubmit,
    formDefaultData,
    setFormDefaultData,
    isLoading,
    setUpperMenu,
    filteredResponses,
    handleViewDialog,
    openDialog,
    setOpenDialog,
    selectedResponse,
    handleDeleteRespuesta,
    handleEditRespuesta,
  };
};
