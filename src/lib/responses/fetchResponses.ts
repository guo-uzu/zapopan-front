import { getResponses } from "../data/getResponses";
import { type ResponseFromAPI } from "@/types/respuestas";
import { Dispatch, SetStateAction } from "react";

const fetchResponses = async (setResponses: Dispatch<SetStateAction<ResponseFromAPI[]>>) => {
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

export { fetchResponses }
