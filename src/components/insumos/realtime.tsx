"use client";

import { useEffect } from "react";
import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";
import { useRouter } from "next/navigation";

export function InsumosRealtime() {
  const router = useRouter()
  useEffect(() => {
    const supabase = SingletonClientSupabase.instance;
    let channel: ReturnType<typeof supabase.channel>;

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      supabase.realtime.setAuth(session?.access_token);

      channel = supabase
        .channel("insumos-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "insumos",
          },
          () => router.refresh(),
        )
        .subscribe((status) => {
          console.log("Realtime status:", status);
        });
    })();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return null;
}

export function LabelsRealtime() {
  const router = useRouter()
  useEffect(() => {
    const supabase = SingletonClientSupabase.instance;
    let channel: ReturnType<typeof supabase.channel>;

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      supabase.realtime.setAuth(session?.access_token);

      channel = supabase
        .channel("labels-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "labels",
          },
          () => router.refresh()
        )
        .subscribe((status) => {
          console.log("Realtime status:", status);
        });
    })();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return null;
}
