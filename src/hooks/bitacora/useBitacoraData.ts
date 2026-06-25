import { useEffect } from "react";
import { SingletonClientSupabase } from "@/utils/supabase/singleton-client-supabase";
import { fetchBitacora } from "@/lib/data/bitacora";
const supabase = SingletonClientSupabase.instance;

export const useBitacoraData = () => {
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
        () => {
          const fetchBitacoraData = async () => {
            try {
              const { data, count, from, to } = await fetchBitacora({
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
                idFilter,
                filters,
                globalFilter: debouncedGlobal,
                dateRange,
              })
              if (data) setDataBitacora(data as TData[]);
              setRowCount(count ?? 0);
              setUIPagination({ from, to });
            } catch (err) {
            }
          };
          fetchBitacoraData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [])

}
