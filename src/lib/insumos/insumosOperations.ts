"use server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import parseSearchQuery from "./parse.params.input";
import type { Insumo } from "@/components/insumos/grid.insumos";

export async function sendInsumo(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not founded");
  const URL = "http://zapopan-api.insumos.appsuzu.fun/api/insumos/upload-file";
  // const URL = "http://localhost:8080/api/insumos/upload-file";
  const dataToSend = new FormData();

  const fileInsumos = formData.get("fileInsumos");
  if (!fileInsumos) {
    throw new Error("File is required");
  }
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
  const { filename } = await response.json();
  if (!response.ok) {
    throw new Error(`FastAPI upload failed ${response.status}`);
  }
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
    throw new Error("DB fetching data");
  }
  revalidatePath("/insumos");
  return { ok: "ok" };
}

export async function getInsumos(searchParams: { search?: string }) {
  const search = searchParams.search ?? "";
  const parsedParams = parseSearchQuery(search);

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const textFilter =
    parsedParams.text.length > 0
      ? parsedParams.text
          .flatMap((term) => [
            `title.ilike.%${term}%`,
            `description.ilike.%${term}%`,
          ])
          .join(",")
      : "";

  const labelFilter =
    parsedParams.labels.length > 0
      ? parsedParams.labels.map((label) => `name.ilike.%${label}%`).join(",")
      : "";

  let query = supabase
    .from("insumos")
    .select(
      `
      id_public,
      file_name,
      title,
      created_at,
      description,
      user_id(full_name),
      label_id:labels!inner(
        name,
        id_public
      )
    `,
    )
    .eq("available", true);

  if (textFilter) {
    query = query.or(textFilter);
  }

  if (labelFilter) {
    query = query.or(labelFilter, {
      referencedTable: "labels",
    });
  }

  const { data, error } = await query.returns<Insumo[]>();

  if (error) {
    throw new Error("DB fetching data");
  }

  return { data };
}

export async function deleteInsumo(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("insumos")
    .update({ available: false })
    .eq("id_public", id);

  if (error) {
    throw new Error("DB update failed");
  }
  revalidatePath("/insumos");
  return { ok: true };
}
