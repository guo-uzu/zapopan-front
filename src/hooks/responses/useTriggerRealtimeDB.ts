import { useEffect, useState } from "react";
import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";

export const useTriggerRealtimeDB = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const supabase = SingletonClientSupabase.instance;

    // 🎲 Generamos un nombre único por cada renderizado para evitar colisiones
    const uniqueChannelName = `bitacora-realtime-${Math.random().toString(36).substring(7)}`;
    const subscription = supabase
      .channel(uniqueChannelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "respuestas",
        },
        () => {
          setRefreshTrigger((old) => old + 1);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return refreshTrigger;
};
