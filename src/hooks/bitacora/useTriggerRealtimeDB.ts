import { useEffect, useState } from "react";
import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";
const supabase = SingletonClientSupabase.instance;

export const useTriggerRealtimeDB = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("👤 Estado de sesión en el WebSocket:", data.session ? "Autenticado" : "Anónimo");
    });
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
        (payload) => {
          console.log("🔥 Cambio detectado en tiempo real:", payload);
          setRefreshTrigger((old) => old + 1);
        }
      )
      .subscribe((status) => {
        // Esto te ayudará a ver el estado limpio en la consola sin errores fantasmas
        if (status === "SUBSCRIBED") {
          console.log(`📡 Conectado exitosamente al canal: ${uniqueChannelName}`);
        }
      });

    return () => {
      // 🧼 Nos aseguramos de remover este canal específico al desmontar
      supabase.removeChannel(subscription);
    };
  }, []);

  return refreshTrigger;
};
