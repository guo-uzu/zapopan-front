export const postInsumos = async (file: File) => {
  // const URL = "http://localhost:8000/api/insumos/upload-file";
  const URL = "http://zapopan-api.insumos.appsuzu.fun/api/insumos/upload-file";
  const formData = new FormData();
  formData.append("file", file);
  const data = await fetch(URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });
  return data;
};
