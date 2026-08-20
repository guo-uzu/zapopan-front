"use server"
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export const getLabels = async () => {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore);

  const { error, data } = await supabase.from("labels").select("name")

  if (error) {
    throw new Error("DB insert failed");
  }
  console.log(data)
  return { message: data, error: error };
};
