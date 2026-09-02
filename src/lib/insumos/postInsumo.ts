"use server";
import { UploadFiles } from "./definitions";
import * as z from "zod";
import { sendInsumo } from "./insumosOperations";

export const postInsumos = async (
  initialState: unknown,
  formData: FormData,
) => {
  const fileInsumos = formData.get("fileInsumos");
  const nameInsumos = formData.get("nameInsumos");
  const dateInsumos = formData.get("dateInsumos");
  const userInsumos = formData.get("userInsumos");
  const descriptionInsumos = formData.get("descriptionInsumos");
  const labelInsumos = formData.get("labelInsumos");

  const validateFormFiles = UploadFiles.safeParse({
    fileInsumos,
    nameInsumos,
    dateInsumos,
    userInsumos,
    descriptionInsumos,
    labelInsumos,
  });

  if (!validateFormFiles.success) {
    const errors = z.treeifyError(validateFormFiles.error);
    return {
      errors: errors.properties,
      fields: {
        nameInsumos,
        dateInsumos,
        userInsumos,
        descriptionInsumos,
        labelInsumos,
      },
    };
  }
  try {
    const { ok } = await sendInsumo(formData);
    return { ok };
  } catch {
    return {
      ok: false,
      formError: "No se pudo subir el archivo",
      fields: {
        nameInsumos,
        dateInsumos,
        userInsumos,
        descriptionInsumos,
        labelInsumos,
      },
    };
  }
};
