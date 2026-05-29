import type { FetchData } from "@/types/fetchData";
import { createClient } from "@/utils/supabase/client";
import { accountMap, areaMap, categoryMap, channelMap, mustMap, priorityMap, socialNetworkMap, statusMap } from "../bitacora/maps";
import { formatData } from "../formatters/formatData";
import { formatDate } from "@/utils/bitacora/formatDate";

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
          id,
          user_id(full_name),
          created_by_name,
          account_id(name),
          area_id(name),
          category_id(name),
          social_network_id(name),
          channel_id(name),
          priority_id(name),
          status_id(name),
          description,
          link,
          username,
          created_at,
          updated_at,
          latest_updated_user_id(full_name),
          colonia,
          folio,
          observations
          `,
      { count: "exact" },
    )
    .range(from, to).eq("available", true)
    .order('created_at', { ascending: false })

  if (globalFilter) query = query.textSearch("search_in_bitacora", globalFilter.replaceAll(" ", "+"))
  if (idFilter) query = query.eq("id", idFilter);
  if (filters.status === "N/A") {
    query = query.is("status_id", null);
  } else if (filters.status && filters.status !== "all") {
    query = query.eq("status_id", mustMap(statusMap, formatData(filters.status), "status"));
  }
  if (filters.priority === "N/A") {
    query = query.is("priority_id", null);
  } else if (filters.priority && filters.priority !== "all") {
    query = query.eq("priority_id", mustMap(priorityMap, formatData(filters.priority), "priority"));
  }
  if (filters.channel === "N/A") {
    query = query.is("channel_id", null);
  } else if (filters.channel && filters.channel !== "all") {
    query = query.eq("channel_id", mustMap(channelMap, formatData(filters.channel), "channel"));
  }
  if (filters.socialNetwork === "N/A") {
    query = query.is("social_network_id", null);
  } else if (filters.socialNetwork && filters.socialNetwork !== "all") {
    query = query.eq("social_network_id", mustMap(socialNetworkMap, formatData(filters.socialNetwork), "social_network"));
  }
  if (filters.category === "N/A") {
    query = query.is("category_id", null);
  } else if (filters.category && filters.category !== "all") {
    query = query.eq("category_id", mustMap(categoryMap, formatData(filters.category), "category"));
  }
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

  if (dateRange?.from) {
    const date = new Date(dateRange.from)
    console.log(dateRange.from)
    query = query.gte("created_at", formatDate(date));
  }

  if (dateRange?.to) {
    let date = new Date(dateRange.to)
    date.setHours(23, 59, 59)
    console.log(dateRange.to)
    query = query.lte("created_at", formatDate(date));
  }

  const { data, error, count } = await query
  if (error) throw error
  console.log(data)
  return {
    data,
    count,
    from: from + 1,
    to: Math.min(to + 1, count ?? 0)
  }
};
