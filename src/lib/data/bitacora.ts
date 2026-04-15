import { createClient } from "@/utils/supabase/client";
import { cache } from "react";
const supabase = createClient();


export async const fetchBitacora = (
  pageIndex,
  pageSize,
  idFilter
  filters,
  globalFilter,
  dateRange
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");

  const from = pageIndex * pageSize
  const to = from + pageSize
}
