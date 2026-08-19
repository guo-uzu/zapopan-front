const URL = "http://localhost:8000/api/insumos/upload-file";
//const URL = "http://zapopan-api.insumos.appsuzu.fun/api/insumos/upload-file";
async function sendData(formData: FormData) {
  const dataToSend = new FormData();
  console.log(formData.get("file"))
  dataToSend.append("file", formData.get("file"));
  const data = await fetch(URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });
  return { message: data };
}
