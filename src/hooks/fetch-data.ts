import { Option } from "@/app/respuestas/[[...respuestas]]/multi-select";
import { formatDataDate } from "@/lib/formatters/date";
import { DashBoardTable } from "@/types/dashboardTable";
import { createClient } from "@/utils/supabase/client";

export const fetchData = async (id?: string | null) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");
  let query = supabase
    .from("bitacora")
    .select(
      `
      id,
      user_id(full_name),
      account_bitacora:account_id(name),
      created_at,
      category_bitacora:category_id(name),
      description,
      folio,
      link,
      observations,
      priority_bitacora:priority_id(name),
      status_bitacora:status_id(name),
      username,
      responsable_area_bitacora:area_id(name),
      colonia,
      channel_bitacora:channel_id(name),
      social_network_bitacora:social_network_id(name),
      updated_at,
      latest_updated_user_id(full_name),
      snapshot_before_edit(*)
    `,
    )
    .eq("available", true);

  if (id) {
    query = query.eq("id", id);
  }
  const response = await query.order("created_at", { ascending: false });
  return response;
};

export const getDashboardCategory = async (data_from: Date, data_to: Date) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");
  if (!data_from && !data_to) {
    return;
  }
  const dataFrom = new Date(`${formatDataDate(data_from)}:00:00:00`)
  const dataTo = new Date(`${formatDataDate(data_to)}:23:59:59`)
  const { data, error } = await supabase.rpc("getcategorycount", {
    data_from: dataFrom.toISOString(),
    data_to: dataTo.toISOString(),
  });
  if (error) {
    console.log("Error", error);
  }
  return data;
};

export const getDashboardReportesPorDependencias = async (data_from: Date, data_to: Date) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");
  if (!data_from && !data_to) {
    return;
  }
  const dataFrom = new Date(`${formatDataDate(data_from)}:00:00:00`)
  const dataTo = new Date(`${formatDataDate(data_to)}:23:59:59`)
  const { data, error } = await supabase.rpc("getreportespordependencias", {
    data_from: dataFrom.toISOString(),
    data_to: dataTo.toISOString(),
  });
  if (error) {
    console.log("Error", error);
  }
  return data;
};


export const getDashboardAreaEstatal = async (data_from: Date, data_to: Date) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");
  if (!data_from && !data_to) {
    return;
  }
  const dataFrom = new Date(`${formatDataDate(data_from)}:00:00:00`)
  const dataTo = new Date(`${formatDataDate(data_to)}:23:59:59`)
  const { data, error } = await supabase.rpc("getareacount", {
    data_from: dataFrom.toISOString(),
    data_to: dataTo.toISOString(),
  });
  if (error) {
    console.log("Error", error);
  }
  return data;
};


export const getDataChartsAreaEstatal = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");
  const { data } = await supabase
    .from("daily_area_counts")
    .select("*")
    .eq("municipal", false)
    .order("date", { ascending: true });
  return data;
};

export const getPendientesUser = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");
  const { data, error } = await supabase
    .from("bitacora")
    .select("status_id", { head: false })
    .eq("user_id", user.id)
    .in("status_id", [0, 1, 2, 3]);

  if (error) throw error;

  const counts = {
    status0: data.filter((x) => x.status_id === 0).length,
    status1: data.filter((x) => x.status_id === 1).length,
    status2: data.filter((x) => x.status_id === 2).length,
    status3: data.filter((x) => x.status_id === 3).length,
  };
  return { counts, error };
};

export const getPendientesTotal = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");
  const { data, error } = await supabase
    .from("bitacora")
    .select("status_id", { head: false })
    .in("status_id", [0, 1, 2, 3]);

  if (error) throw error;

  const counts = {
    status0: data.filter((x) => x.status_id === 0).length,
    status1: data.filter((x) => x.status_id === 1).length,
    status2: data.filter((x) => x.status_id === 2).length,
    status3: data.filter((x) => x.status_id === 3).length,
  };
  return { counts, error };
};

interface Response {
  id: string;
  labels_areas: Option[];
  created_at: string;
  description_jjf: string;
  description_gob: string;
  title: string;
  updated_at: string;
  latest_updated_user_id?: {
    full_name: string;
  };
  user_id?: {
    full_name: string;
    email: string;
    avatar_url: string;
  };
}

export const getResponses = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");

  const { data, error } = await supabase
    .from("respuestas")
    .select(
      `
      id,
      title,
      description_jjf,
      description_gob,
      labels_areas,
      created_at,
      updated_at,
      latest_updated_user_id(full_name),
      user_id(full_name,email,avatar_url)
      `,
    )
    .eq("available", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.log(error);
  }
  return data;
};

export const getUsersFilter = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");
  const { data, error } = await supabase.from("users").select(`
      id,
      full_name
      `);
  console.log(data);
  if (error) {
    console.log(error);
  }
  return data;
};

export const handleFetchPng = async (data: DashBoardTable[]) => {
  console.log(data)
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not founded");

  const response = await fetch("http://localhost:8080/api/export-png", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      data,
    ),
  })

  if (!response.ok) {
    throw new Error(`Response status`);
  }
  return response

}
