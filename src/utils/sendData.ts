"use server"
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUSHABLE_KEY || ""
import { auth } from "@clerk/nextjs/server";
import { Inputs } from "@/hooks/types";

export const sendDataSupabase = async (formData: Inputs) => {
  const { userId } = await auth()
  if (!userId) throw new Error("User not founded")
  const supabase = createClient(supabaseUrl, supabaseKey)
  const payload = {
    user_id: userId,
    account_id: mustMap(accountMap, formData.account, 'account'),
    area_id: mustMap(areaMap, formData.area_responsable, 'area_responsable'),
    category_id: mustMap(categoryMap, formData.category, 'category'),
    chanel_id: mustMap(chanelMap, formData.chanel, 'chanel'),
    priority_id: mustMap(priorityMap, formData.priority, 'priority'),
    status_id: mustMap(statusMap, formData.status, 'status'),
    colonia: formData.colonia || null,
    description: formData.description,
    direction: formData.direction || null,
    link: formData.link || null,
    name: formData.name,
    observations: formData.observations || null,
    created_at: new Date().toISOString(),
    username: formData.username
  }

  const { error } = await supabase.from("bitacora").insert(payload)

  if (error) {
    console.log("error bitacora insert", error)
    throw new Error("DB insert failed")
  }
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

const areaMap: Record<Inputs['area_responsable'], number> = {
  infraestructura_comercio: 0,
  servicios_municipales: 1,
  gestion_integral: 2,
  secretaria_ayuntamiento: 3,
  desarrollo_economico: 4,
  construccion_comunidad: 5,
  dif: 6,
  tesoreria: 7,
  cfe: 8,
  siapa: 9,
  siop: 10,
  otras_coordinaciones: 11,
  otras_dependencias_estatales: 12,
  presidencia: 13,
  guadalajara: 14,
  inspeccion_vigilancia: 15,
  pcyb: 16,
  cercania_ciudadana: 17,
  salud_zapopan: 18,
  comisaria: 19,
  comude: 20,
  caec: 21,
  sindicatura: 22,
  administracion_inovacion_gubernamental: 23,
  amim: 24,
  cursos_parque_ninas_ninos: 25,
  romeria: 26,
  contraloria_ciudadana: 27,
};

const categoryMap: Record<Inputs['category'], number> = {
  solicitud_informacion: 0,
  canalizacion_dependencia: 1,
  solicitudes_nuevas: 2,
  reportes_servicios: 3,
  reporte_obras: 4,
  reporte_externos: 5,
  solicitudes_especiales: 6,
  reporte_inspeccion_vigilancia: 7,
  reportes_denuncias: 8,
  solicitud_empleo: 9,
  coyuntura: 10,
  participacion_curso: 11,
  solicitud_obra: 12,
  otros: 13,
};

const chanelMap: Record<Inputs['chanel'], number> = {
  coment: 0,
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

