"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import type { BitacoraRecord } from "@/types/bitacoraTable"

type DuplicateRow = {
  id: string
  n: number
}

export const sendDuplicateRow = async ({ id, n }: DuplicateRow) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");

  const { data, error } = await supabase.from("bitacora").select("*").eq("id", id)
  if (error) {
    throw new Error("Error obteniendo los datos");
  }
  const payload = data.map(({ id, ...rest }) => rest)
  const arrayPayloads = Array(n).fill(payload[0] ?? null)

  const { error: errorInsert } = await supabase.from("bitacora").insert(arrayPayloads);
  if (errorInsert) {
    throw new Error("Error duplicando la fila");
  }
  return { ok: true };
};

