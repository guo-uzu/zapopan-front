import { useEffect, useState } from "react";
import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";
const supabase = SingletonClientSupabase.instance;

export const useTriggerRealtimeDB = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  useEffect(() => {
    const subscription = supabase
      .channel("changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bitacora",
        },
        () => setRefreshTrigger(old => old + 1),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [])
  return refreshTrigger
}
