"use server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function sendInsumo(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not founded");
  // const URL = "http://zapopan-api.insumos.appsuzu.fun/api/insumos/upload-file";
  const URL = "http://localhost:8080/api/insumos/upload-file";
  const dataToSend = new FormData();

  const fileInsumos = formData.get("fileInsumos");
  dataToSend.append("file", fileInsumos);
  const nameInsumos = formData.get("nameInsumos");
  const dateInsumos = formData.get("dateInsumos");
  const userInsumos = formData.get("userInsumos");
  const descriptionInsumos = formData.get("descriptionInsumos");
  const labelInsumos = formData.get("labelInsumos");

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: dataToSend,
  });
  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(
      `FastAPI upload failed ${response.status}: ${responseText}`,
    );
  }
  const { filename } = await response.json();
  const { data: userId, error: userTestError } = await supabase
    .from("users")
    .select("id_private")
    .eq("id", userInsumos)
    .single();

  const { data: labelId, error: userTestErro } = await supabase
    .from("labels")
    .select("id")
    .eq("id_public", labelInsumos)
    .single();

  const payload = {
    file_name: filename,
    title: nameInsumos,
    created_at: dateInsumos,
    user_id: userId?.id_private,
    description: descriptionInsumos,
    label_id: labelId?.id,
  };

  const { error } = await supabase.from("insumos").insert(payload);

  if (error) {
    console.log(error);
  }
  return { ok: "ok" };
}

export async function getInsumos() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not founded");
  const { data } = await supabase
    .from("insumos")
    .select(
      "id_public,file_name,title,created_at,description,user_id(full_name),label_id(name,id_public)",
    )
    .eq("available", true);
  return { data };
}
