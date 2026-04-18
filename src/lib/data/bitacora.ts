import type { FetchData } from "@/types/fetchData";
import { createClient } from "@/utils/supabase/client";
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
    console.log(globalFilter);
    const from = pageIndex * pageSize;
    const to = from + pageSize - 1;
    let query = supabase
        .from("bitacora")
        .select(
            `
          user_id(full_name),
          created_by_name
          `,
            { count: "exact" },
        )
        .range(from, to);
    console.log(filters);
    if (idFilter) query = query.eq("id", idFilter);
    if (globalFilter) query = query.ilike("full_name", `%${globalFilter}%`);
    if (filters.account !== "all")
        query = query.eq("account_name", filters.account);
    if (filters.area !== "all") query = query.eq("area", filters.area);
    if (filters.status !== "all") query = query.eq("status", filters.status);
    if (filters.channel !== "all") query = query.eq("channel", filters.channel);
    if (filters.category !== "all")
        query = query.eq("category", filters.category);
    if (filters.priority !== "all")
        query = query.eq("priority", filters.priority);
    if (filters.userName !== "all")
        query = query.eq("user_name", filters.userName);
    if (dateRange?.from)
        query = query.gte("created_at", dateRange.from.toISOString());
    if (dateRange?.to)
        query = query.lte("created_at", dateRange.to.toISOString());
    console.log(query);
    return query;
};
