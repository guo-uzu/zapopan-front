"use server";
// getReportsToday.ts
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export const getReportsToday = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");

  const now = new Date();
  const todayStr = now.toLocaleDateString("en-CA", {
    timeZone: "America/Mexico_City",
  });
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString("en-CA", {
    timeZone: "America/Mexico_City",
  });

  const [{ count: todayCount }, { count: yesterdayCount }] = await Promise.all([
    supabase
      .from("bitacora")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${todayStr}T00:00:00Z`)
      .eq("available", true),
    supabase
      .from("bitacora")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${yesterdayStr}T00:00:00Z`)
      .lt("created_at", `${todayStr}T00:00:00Z`)
      .eq("available", true),
  ]);

  const delta = yesterdayCount
    ? Math.round(((todayCount! - yesterdayCount) / yesterdayCount) * 100)
    : 0;

  return { today: todayCount ?? 0, delta };
};
