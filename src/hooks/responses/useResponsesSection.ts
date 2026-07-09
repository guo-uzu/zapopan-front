import { useState, useEffect } from "react";
import type { ResponseFromAPI, DefaultForm } from "@/types/respuestas";
import { getResponses } from "@/hooks/fetch-data";
import { sendResponse } from "@/lib/data/sendResponse";
import { updateResponse } from "@/lib/data/updateResponse";
import { toast } from "sonner";
import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";
import { deleteRespuesta } from "@/hooks/deleteRow";

const supabase = SingletonClientSupabase.instance;

export const useResponsesSection = () => {
  const [responses, setResponses] = useState<ResponseFromAPI[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<ResponseFromAPI>();
  const [searchTerm, setSearchTerm] = useState("");
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
            fetchResponses();
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
          fetchResponses();
          return "Respuesta actualizada";
        },
        error: "Error",
        position: "top-center",
      });
    }
  };

  const filteredResponses = responses?.filter((response) => {
    if (!searchTerm) return true;

    const terms = searchTerm
      .toLowerCase()
      .split(",")
      .map((term) => term.trim()) // Remove spaces around words
      .filter((term) => term.length > 0); // Remove empty strings (e.g. trailing comma)
    // If user typed a comma but no words yet, return true
    if (terms.length === 0) return true;

    // B. Check if ANY of the terms match (OR logic)
    // If you want them to match ALL terms (AND logic), change .some() to .every()
    return terms.some((term: string) => {
      const matchesTitle = response.title.toLowerCase().includes(term);
      const matchesDescJJF = response.description_jjf
        .toLowerCase()
        .includes(term);
      const matchesTagsAreas = term.startsWith("#")
        ? response.labels_areas?.some((tag) =>
            tag.label.toLowerCase().includes(term.slice(1)),
          )
        : false;
      return matchesTitle || matchesDescJJF || matchesTagsAreas;
    });
  });

  const fetchResponses = async () => {
    const data = await getResponses();
    if (!data) {
      setResponses([]);
      return;
    }

    const formattedData = data.map((item: ResponseFromAPI) => ({
      ...item,

      // REGLA: Si user_id es un array, extrae la posición [0]. Si ya es objeto o null, déjalo igual.
      user_id: Array.isArray(item.user_id) ? item.user_id[0] : item.user_id,

      // Misma lógica para el usuario que actualizó
      latest_updated_user_id: Array.isArray(item.latest_updated_user_id)
        ? item.latest_updated_user_id[0]
        : item.latest_updated_user_id,
    }));

    // Ahora sí, los datos coinciden perfectamente con tu interfaz Response[]
    setResponses(formattedData);
  };

  useEffect(() => {
    fetchResponses();
  }, []);

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
        () => {
          fetchResponses();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return {
    searchTerm,
    setSearchTerm,
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
