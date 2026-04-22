import { ColumnsBitacoraOpts } from "@/hooks/dataBitacoraColumns";
import type { FetchData } from "@/types/fetchData";
import { createClient } from "@/utils/supabase/client";
import { accountMap, areaMap, mustMap } from "../bitacora/maps";
import { formatData } from "../formatters/formatData";
const supabase = createClient();

export const fetchBitacora = async ({
  pageIndex,
  pageSize,
  idFilter,
  filters,
  globalFilter,
  dateRange,
}: FetchData) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");
  const from = pageIndex * pageSize;
  const to = from + pageSize - 1;
  let query = supabase
    .from("bitacora")
    .select(
      `
          user_id(full_name),
          created_by_name,
          account_id(name),
          area_id(name)
          `,
      { count: "exact" },
    )
    .range(from, to);
  if (idFilter) query = query.eq("id", idFilter);
  // if (filters.area !== "all") query = query.eq("area", filters.area);
  // if (filters.status !== "all") query = query.eq("status", filters.status);
  // if (filters.channel !== "all") query = query.eq("channel", filters.channel);
  // if (filters.category !== "all")
  //   query = query.eq("category", filters.category);
  // if (filters.priority !== "all")
  //   query = query.eq("priority", filters.priority);
  if (filters.area === "N/A") {
    query = query.is("area_id", null);
  } else if (filters.area && filters.area !== "all") {
    query = query.eq("area_id", mustMap(areaMap, formatData(filters.area), "area_responsable"));
  }
  if (filters.account === "N/A") {
    query = query.is("account_id", null);
  } else if (filters.account && filters.account !== "all") {
    query = query.eq("account_id", mustMap(accountMap, filters.account, "account"));
  }
  if (filters.userName === "N/A") {
    query = query.is("user_id", null);
  } else if (filters.userName && filters.userName !== "all") {
    query = query.eq("user_id", filters.userName);
  }
  if (dateRange?.from)
    query = query.gte("created_at", dateRange.from.toISOString());
  if (dateRange?.to)
    query = query.lte("created_at", dateRange.to.toISOString());
  const { data, error, count } = await query
  if (error) throw error

  console.log(await query)

  return {
    data,
    count,
    from: from + 1,
    to: Math.min(to + 1, count ?? 0)
  }

};
