"use server"
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export const sendLabel = async (label: string) => {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore);
  const payload = {
    label,
  };

  const { error } = await supabase.from("labels").insert(payload);
  if (error) {
    throw new Error("DB insert failed");
  }

  return { ok: true };
};
