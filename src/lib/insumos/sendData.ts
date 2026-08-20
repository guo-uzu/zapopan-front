import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

async function sendData(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not founded");
  //const URL = "http://zapopan-api.insumos.appsuzu.fun/api/insumos/upload-file";
  const URL = "http://localhost:8000/api/insumos/upload-file";
  const dataToSend = new FormData();

  const fileInsumos = formData.get("fileInsumos");
  const nameInsumos = formData.get("nameInsumos");
  const dateInsumos = formData.get("dateInsumos");
  const userInsumos = formData.get("userInsumos");
  const descriptionInsumos = formData.get("descriptionInsumos");
  const labelInsumos = formData.get("labelInsumos");

  const payload = {
    nameInsumos,
    dateInsumos,
    userInsumos,
    descriptionInsumos,
    labelInsumos,
  };

  const { error } = await supabase.from("").insert(payload);

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
