"use client";

import { useEffect } from "react";
import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";

export function InsumosRealtime() {
  useEffect(() => {

    const supabase = SingletonClientSupabase.instance;
    const channel = supabase
      .channel("insumos-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "insumos",
        },
        (payload) => {
          console.log("Change received!", payload);
          // Re-render the Server Component and call getInsumos() again
        },
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
}

export function LabelsRealtime() {
  useEffect(() => {

    const supabase = SingletonClientSupabase.instance;
    const channel = supabase
      .channel("insumos-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "labels",
        },
        (payload) => {
          console.log("Change received!", payload);
          // Re-render the Server Component and call getInsumos() again
        },
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
}
