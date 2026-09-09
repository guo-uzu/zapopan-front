"use server";
import { EditInsumo } from "./definitions";
import * as z from "zod";
import { updateInsumo } from "./insumosOperations";

export const editInsumo = async (initialState: unknown, formData: FormData) => {
  const idInsumo = formData.get("idInsumo");
  const rawFile = formData.get("fileInsumo");
  // An untouched <input type="file"> submits an empty File; treat it as "keep the current file".
  const fileInsumo =
    rawFile instanceof File && rawFile.size > 0 ? rawFile : undefined;
  const titleInsumo = formData.get("titleInsumo");
  const descriptionInsumo = formData.get("descriptionInsumo");
  const dateInsumo = formData.get("dateInsumo");
  const labelInsumo = formData.get("labelInsumo");
  console.log(formData);

  const fields = { titleInsumo, descriptionInsumo, dateInsumo, labelInsumo };

  const validated = EditInsumo.safeParse({
    fileInsumo,
    titleInsumo,
    descriptionInsumo,
    dateInsumo,
    labelInsumo,
  });

  if (!validated.success) {
    const errors = z.treeifyError(validated.error);
    return { ok: false, errors: errors.properties, fields };
  }

  if (typeof idInsumo !== "string" || !idInsumo) {
    return { ok: false, formError: "No se pudo actualizar el insumo", fields };
  }

  try {
    await updateInsumo(idInsumo, {
      title: validated.data.titleInsumo,
      description: validated.data.descriptionInsumo,
      date: validated.data.dateInsumo,
      labelPublicId: validated.data.labelInsumo,
      file: validated.data.fileInsumo,
    });
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false, formError: "No se pudo actualizar el insumo", fields };
  }
};
