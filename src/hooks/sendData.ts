"use server"
import { createClient } from "@/utils/supabase/server"
import { Inputs } from "@/hooks/types";

export const sendDataSupabase = async (formData: Inputs) => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not founded")

  const payload = {
    user_id: user.id,
    account_id: mustMap(accountMap, formData.account, 'account'),
    area_id: mustMap(areaMap, formData.area_responsable, 'area_responsable'),
    category_id: mustMap(categoryMap, formData.category, 'category'),
    channel_id: mustMap(chanelMap, formData.channel, 'channel'),
    priority_id: mustMap(priorityMap, formData.priority, 'priority'),
    status_id: mustMap(statusMap, formData.status, 'status'),
    colonia: formData.colonia || null,
    description: formData.description,
    direction: formData.direction || null,
    link: formData.link || null,
    observations: formData.observations || null,
    created_at: new Date().toISOString(),
    username: formData.username,
    folio: formData.folio || null,
    social_network_id: mustMap(socialNetworkMap, formData.social_network, 'social_network'),

  }
  const { error } = await supabase.from("bitacora").insert(payload)
  if (error) {
    console.log("error bitacora insert", error)
    throw new Error("DB insert failed")
  }
  return { ok: true }
}

export const updateDataSupabase = async (formData: Inputs) => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not founded")

  const payload = {
    user_id: user.id,
    account_id: mustMap(accountMap, formData.account, 'account'),
    area_id: mustMap(areaMap, formData.area_responsable, 'area_responsable'),
    category_id: mustMap(categoryMap, formData.category, 'category'),
    channel_id: mustMap(chanelMap, formData.channel, 'channel'),
    priority_id: mustMap(priorityMap, formData.priority, 'priority'),
    status_id: mustMap(statusMap, formData.status, 'status'),
    colonia: formData.colonia || null,
    description: formData.description,
    direction: formData.direction || null,
    link: formData.link || null,
    observations: formData.observations || null,
    created_at: new Date().toISOString(),
    username: formData.username,
    folio: formData.folio || null,
    social_network_id: mustMap(socialNetworkMap, formData.social_network, 'social_network'),
  }
  console.log(formData.id)
  const { error } = await supabase.from("bitacora").update(payload).eq("id", formData.id)
  if (error) {
    console.log("error bitacora updated", error)
    throw new Error("DB insert failed")
  }
  return { ok: true }
}

export const shareRow = async (formData: Inputs) => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("User not founded")
    console.log(":)")
    return { ok: true }
}

function mustMap<T extends string>(map: Record<T, number>, key: T, field: string) {
  const id = map[key];
  if (id === undefined || id === null) throw new Error(`Valor inválido para ${field}: "${key}"`);
  return id;
}

const accountMap: Record<Inputs['account'], number> = {
  zapopan: 0,
  jjf: 1,
};

const socialNetworkMap: Record<Inputs['social_network'], number> = {
  facebook: 1,
  x: 2,
  instagram: 3,
  tiktok: 4
};

const areaMap: Record<Inputs['area_responsable'], number> = {
  infraestructura_de_comercio: 0,
  servicios_municipales: 1,
  gestión_integral: 2,
  secretaría_del_ayuntamiento: 3,
  desarrollo_económico: 4,
  construcción_comunidad: 5,
  dif: 6,
  tesorería: 7,
  cfe: 8,
  siapa: 9,
  siop: 10,
  otras_coordinaciones: 11,
  otras_dependencias_estatales: 12,
  presidencia: 13,
  guadalajara: 14,
  inspección_y_vigilancia: 15,
  pcyb: 16,
  cercanía_ciudadana: 17,
  salud_zapopan: 18,
  comisaría: 19,
  comude: 20,
  "caec_(boletos_charros)": 21, // Se requieren comillas por los paréntesis
  sindicatura: 22,
  administración_e_innovación_gubernamental: 23,
  amim: 24,
  "cursos_en_el_parque_de_las_niñas_y_niños": 25, // Se requieren comillas por los espacios
  romería: 26,
  contraloría_ciudadana: 27,
};

const categoryMap: Record<Inputs['category'], number> = {
  solicitud_de_información: 0,
  canalización_a_dependencia: 1,
  solicitudes_nuevas: 2,
  reportes_de_servicios: 3,
  reportes_de_obras: 4,
  reportes_externos: 5,
  solicitudes_especiales: 6,
  reporte_de_inspección_y_vigilancia: 7,
  reportes_y_denuncias: 8,
  solicitud_de_empleo: 9,
  coyuntura: 10,
  participación_en_curso: 11,
  solicitud_de_obra: 12,
  otros: 13,
};

const chanelMap: Record<Inputs['channel'], number> = {
  comentarios: 0,
  inbox: 1,
};

const priorityMap: Record<Inputs['priority'], number> = {
  baja: 0,
  media: 1,
  alta: 2,
};

const statusMap: Record<Inputs['status'], number> = {
  pendiente: 0,
  en_proceso: 1,
  resuelto: 2,
};

