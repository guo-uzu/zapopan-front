"use server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const getLabels = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error, data } = await supabase
    .from("labels")
    .select("name, id_public")
    .eq("available", true);

  if (error) {
    throw new Error("DB fetch failed");
  }
  return { data, error: error };
};

export const sendLabel = async (label: string) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("labels")
    .insert({
      name: label,
    });

  if (error) {
    throw new Error("DB insert failed");
  }

  revalidatePath("/insumos");
};

export const deleteLabels = async (id: string) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("labels")
    .update({ available: false })
    .eq("id_public", id);

  if (error) {
    throw new Error("DB insert failed");
  }
  revalidatePath("/insumos");
  return { ok: true };
};
