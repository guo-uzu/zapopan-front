"use server";
import { UploadFilesState, UploadFiles } from "./definitions";
import * as z from "zod";

export const postInsumos = async (
  initialState: UploadFilesState,
  formData: FormData,
) => {
  const fileInsumos = formData.get("fileInsumos")
  const nameInsumos = formData.get("nameInsumos")
  const dateInsumos = formData.get("dateInsumos")
  const userInsumos = formData.get("userInsumos")
  const descriptionInsumos = formData.get("descriptionInsumos")
  const labelInsumos = formData.get("labelInsumos")

  const validateFormFiles = UploadFiles.safeParse({
    fileInsumos,
    nameInsumos,
    dateInsumos,
    userInsumos,
    descriptionInsumos,
    labelInsumos,
  });

  if (!validateFormFiles.success) {
    const errorsXD = z.treeifyError(validateFormFiles.error)
    return {
      errors: errorsXD.properties,
      fields: {
        nameInsumos,
        dateInsumos,
        userInsumos,
        descriptionInsumos,
        labelInsumos,
      }
    };
  }
  console.log("Llegue", formData);
  return {};
};
