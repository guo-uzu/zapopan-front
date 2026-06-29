import { useEffect, useState } from "react";
import { BitacoraRecord } from "@/types/bitacoraTable";
import { fetchBitacora } from "@/lib/data/bitacora";
import useDateRange from "@/hooks/bitacora/useDateRange";
import { Filters } from "@/types/fetchData";
import useDebouncedValue from "@/hooks/bitacora/useDebounce";
import { useTriggerRealtimeDB } from "./useTriggerRealtimeDB";

export const useBitacoraUpdateData = <TData extends BitacoraRecord>(
  idFilter: string | null,
  manualRefresh: number = 0,
) => {
  const [dataBitacora, setDataBitacora] = useState<TData[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const { dateRange, setDateRange } = useDateRange();
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedGlobal = useDebouncedValue(globalFilter, 800);
  const bitacoraTrigger = useTriggerRealtimeDB();

  const [filters, setFilters] = useState<Filters>(() => {
    if (typeof window === "undefined")
      return {
        account: "",
        area: "",
        status: "",
        channel: "",
        category: "",
        priority: "",
        userName: "",
        socialNetwork: "",
        dateRange: "",
      };

    return {
      account: localStorage.getItem("account") ?? "",
      area: localStorage.getItem("area") ?? "",
      status: localStorage.getItem("status") ?? "",
      channel: localStorage.getItem("channel") ?? "",
      category: localStorage.getItem("category") ?? "",
      priority: localStorage.getItem("priority") ?? "",
      userName: localStorage.getItem("userName") ?? "",
      socialNetwork: localStorage.getItem("socialNetwork") ?? "",
      dateRange: localStorage.getItem("bitacora_date_range") ?? "",
    };
  });

  const goNextPage = () => {
    setPagination({
      pageIndex: 1 + pagination.pageIndex,
      pageSize: pagination.pageSize,
    });
  };

  const goPreviousPage = () => {
    setPagination({
      pageIndex: pagination.pageIndex - 1,
      pageSize: pagination.pageSize,
    });
  };

  const onChangeFilter = (key: string, value: string) => {
    localStorage.setItem(key, value);
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 })); // ← critical
  };

  const [uiPagination, setUIPagination] = useState<{
    from: number | undefined;
    to: number | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setLoading(true);
    const fetchBitacoraData = async () => {
      try {
        const { data, count, from, to } = await fetchBitacora({
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          idFilter,
          filters,
          globalFilter: debouncedGlobal,
          dateRange,
          signal,
        });
        if (data) setDataBitacora(data as TData[]);
        setRowCount(count ?? 0);
        setUIPagination({ from, to });
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
          return;
        }
        console.error("Error fetching bitácora data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBitacoraData();
    return () => {
      controller.abort();
    };
  }, [
    pagination,
    filters,
    debouncedGlobal,
    dateRange,
    idFilter,
    bitacoraTrigger,
    manualRefresh,
  ]);
  return {
    dataBitacora,
    debouncedGlobal,
    setGlobalFilter,
    filters,
    onChangeFilter,
    dateRange,
    setDateRange,
    loading,
    setPagination,
    pagination,
    rowCount,
    uiPagination,
    goPreviousPage,
    goNextPage,
  };
};
