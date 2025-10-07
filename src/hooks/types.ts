export type Inputs = {
  account: "jjf" | "zapopan",
  area_responsable: "infraestructura_comercio" | "servicios_municipales" | "gestion_integral" | "secretaria_ayuntamiento" | "desarrollo_economico" | "construccion_comunidad" | "dif" | "tesoreria" | "cfe" | "siapa" | "siop" | "otras_coordinaciones" | "otras_dependencias_estatales" | "presidencia" | "guadalajara" | "inspeccion_vigilancia" | "pcyb" | "cercania_ciudadana" | "salud_zapopan" | "comisaria" | "comude" | "caec" | "sindicatura" | "administracion_inovacion_gubernamental" | "amim" | "cursos_parque_ninas_ninos" | "romeria" | "contraloria_ciudadana",
  category: "solicitud_informacion" | "canalizacion_dependencia" | "solicitudes_nuevas" | "reportes_servicios" | "reporte_obras" | "reporte_externos" | "solicitudes_especiales" | "reporte_inspeccion_vigilancia" | "reportes_denuncias" | "solicitud_empleo" | "coyuntura" | "participacion_curso" | "solicitud_obra" | "otros",
  chanel: "coment" | "inbox",
  colonia: string,
  description: string,
  direction: string,
  link: string,
  name: string,
  observations: string,
  priority: "baja" | "media" | "alta",
  status: "pendiente" | "en_proceso" | "resuelto",
  username: string,
  folio: string
}
