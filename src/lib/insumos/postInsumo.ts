"use server";
import { UploadFilesState, UploadFiles } from "./definitions";

export const postInsumos = async (
  initialState: UploadFilesState,
  formData: FormData,
) => {
  const validateFormFiles = UploadFiles.safeParse({
    file: formData.get("file"),
    title: formData.get("title"),
    date: formData.get("date"),
    owner: formData.get("ownser"),
    description: formData.get("description"),
    label: formData.get("label"),
  });

  if (!validateFormFiles.success) {
    return {
      errors: validateFormFiles.error?.flatten().fieldErrors,
    };
  }

  const URL = "http://localhost:8000/api/insumos/upload-file";
  //const URL = "http://zapopan-api.insumos.appsuzu.fun/api/insumos/upload-file";
  const dataToSend = new FormData();
  dataToSend.append("file", formData.get("file"));
  const data = await fetch(URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });
  return {message: data};
};
