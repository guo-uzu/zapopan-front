import { useEffect, useState } from "react";
import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";

export const useTriggerRealtimeDB = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const supabase = SingletonClientSupabase.instance;

    // 🎲 Generamos un nombre único por cada renderizado para evitar colisiones
    const uniqueChannelName = `bitacora-realtime-${Math.random().toString(36).substring(7)}`;

    const subscription = supabase
      .channel(uniqueChannelName) // 👈 Usamos el nombre único aquí
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bitacora",
        },
        () => {
          setRefreshTrigger((old) => old + 1);
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(
            `📡 Conectado exitosamente al canal: ${uniqueChannelName}`,
          );
        }
      });

    return () => {
      // 🧼 Nos aseguramos de remover este canal específico al desmontar
      supabase.removeChannel(subscription);
    };
  }, []);

  return refreshTrigger;
};
