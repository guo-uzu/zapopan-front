"use server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import parseSearchQuery from "./parse.params.input";
import type { Insumo } from "@/components/insumos/grid.insumos";

const API_BASE = "http://zapopan-api.insumos.appsuzu.fun/api/insumos";
// const API_BASE = "http://localhost:8080/api/insumos";

async function deleteInsumoFile(fileName: string) {
  // FastAPI declares `file: str` without Form()/Body(), so it reads it from the query string.
  const url = `${API_BASE}/delete-file?file=${encodeURIComponent(fileName)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`FastAPI delete failed ${response.status}`);
  }
}

async function uploadInsumoFile(file: File) {
  const url = `${API_BASE}/upload-file`;
  const dataToSend = new FormData();
  dataToSend.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: dataToSend,
  });

  if (!response.ok) {
    throw new Error(`FastAPI upload failed ${response.status}`);
  }

  const { filename } = await response.json();
  return filename;
}

export async function sendInsumo(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not founded");
  const fileInsumos = formData.get("fileInsumos");
  if (!(fileInsumos instanceof File)) {
    throw new Error("File is required");
  }
  const nameInsumos = formData.get("nameInsumos");
  const dateInsumos = formData.get("dateInsumos");
  const userInsumos = formData.get("userInsumos");
  const descriptionInsumos = formData.get("descriptionInsumos");
  const labelInsumos = formData.get("labelInsumos");

  const filename = await uploadInsumoFile(fileInsumos);
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

  const { data: current, error: fetchError } = await supabase
    .from("insumos")
    .select("file_name")
    .eq("id_public", id)
    .single();
  if (fetchError || !current) {
    throw new Error("Insumo not found");
  }

  const { error } = await supabase
    .from("insumos")
    .update({ available: false })
    .eq("id_public", id);

  if (error) {
    throw new Error("DB update failed");
  }

  if (current.file_name) {
    await deleteInsumoFile(current.file_name);
  }

  revalidatePath("/insumos");
  return { ok: true };
}

export async function updateInsumo(
  id: string,
  data: {
    title: string;
    description: string;
    date: string;
    labelPublicId: string;
    file?: File;
  },
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");

  const { data: label, error: labelError } = await supabase
    .from("labels")
    .select("id")
    .eq("id_public", data.labelPublicId)
    .single();

  if (labelError || !label) {
    throw new Error("Label not found");
  }

  const payload: {
    title: string;
    description: string;
    created_at: string;
    label_id: number;
    file_name?: string;
  } = {
    title: data.title,
    description: data.description,
    created_at: data.date,
    label_id: label.id,
  };

  let previousFileName: string | null = null;

  if (data.file) {
    const { data: current, error: fetchError } = await supabase
      .from("insumos")
      .select("file_name")
      .eq("id_public", id)
      .single();

    if (fetchError || !current) {
      throw new Error("Insumo not found");
    }

    previousFileName = current.file_name;
    payload.file_name = await uploadInsumoFile(data.file);
  }

  const { error } = await supabase
    .from("insumos")
    .update(payload)
    .eq("id_public", id);

  if (error) {
    throw new Error("DB update failed");
  }

  // Only remove the old file once the row points at the new one.
  if (previousFileName && previousFileName !== payload.file_name) {
    await deleteInsumoFile(previousFileName);
  }

  revalidatePath("/insumos");
  return { ok: true };
}
