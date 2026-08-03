import { getUsersFilter } from "./fetch-data";
import { formatData } from "../lib/formatters/formatData";

export const UsersFormatFilterBitacora = async () => {
  const users = await getUsersFilter();
  if (!users) {
    return [];
  }
  return users.map((user) => {
    return {
      id: formatData(user.full_name),
      value: user.full_name,
      label: formatData(user.full_name),
    };
  });
};

export const ColumnsBitacoraOpts = {
  account_id: [
    { id: "jjf", value: "JJF", color: "oklch(75% 0.183 55.934)" },
    { id: "zapopan", value: "Zapopan", color: "oklch(67.3% 0.182 276.935)" },
  ],

  area_id: [
    {
      id: "infraestructura_de_comercio",
      value: "Infraestructura de comercio",
      label: "infraestructura_de_comercio",
      color: "oklch(40.8% 0.123 38.172)",
    },
    {
      id: "servicios_municipales",
      value: "Servicios municipales",
      label: "servicios_municipales",
      color: "oklch(42% 0.14 182.503)",
    },
    {
      id: "gestión_integral",
      value: "Gestión integral",
      label: "gestión_integral",
      color: "oklch(41% 0.16 149.214)",
    },
    {
      id: "secretaría_del_ayuntamiento",
      value: "Secretaría del ayuntamiento",
      label: "secretaría_del_ayuntamiento",
      color: "oklch(44% 0.13 274.713)",
    },
    {
      id: "desarrollo_económico",
      value: "Desarrollo económico",
      label: "desarrollo_económico",
      color: "oklch(40.1% 0.17 325.612)",
    },
    {
      id: "construcción_comunidad",
      value: "Construcción comunidad",
      label: "construcción_comunidad",
      color: "oklch(43% 0.13 230.318)",
    },
    {
      id: "dif",
      value: "DIF",
      label: "dif",
      color: "oklch(30% 0.025 107.4)",
    },
    {
      id: "tesorería",
      value: "Tesorería",
      label: "tesorería",
      color: "oklch(45% 0.19 305.504)",
    },
    {
      id: "cfe",
      value: "CFE",
      label: "cfe",
      color: "oklch(42% 0.04 58.071)",
    },
    {
      id: "siapa",
      value: "SIAPA",
      label: "siapa",
      color: "oklch(39.1% 0.09 240.876)",
    },
    {
      id: "siop",
      value: "SIOP",
      label: "siop",
      color: "oklch(44% 0.13 103.193)",
    },
    {
      id: "otras_coordinaciones",
      value: "Otras coordinaciones",
      label: "otras_coordinaciones",
      color: "oklch(44% 0.1 18.334)",
    },
    {
      id: "otras_dependencias_estatales",
      value: "Otras dependencias estatales",
      label: "otras_dependencias_estatales",
      color: "oklch(42% 0.12 61.907)",
    },
    {
      id: "presidencia",
      value: "Presidencia",
      label: "presidencia",
      color: "oklch(45% 0.1 75.164)",
    },
    {
      id: "guadalajara",
      value: "Guadalajara",
      label: "guadalajara",
      color: "oklch(44% 0.18 13.428)",
    },
    {
      id: "inspección_y_vigilancia",
      value: "Inspección y vigilancia",
      label: "inspección_y_vigilancia",
      color: "oklch(25% 0.015 49.25)",
    },
    {
      id: "pcyb",
      value: "PCyB",
      label: "pcyb",
      color: "oklch(43% 0.2 16.935)",
    },
    {
      id: "cercanía_ciudadana",
      value: "Cercanía ciudadana",
      label: "cercanía_ciudadana",
      color: "oklch(38% 0.189 293.745)",
    },
    {
      id: "salud_zapopan",
      value: "Salud Zapopan",
      label: "salud_zapopan",
      color: "oklch(44% 0.21 354.308)",
    },
    {
      id: "comisaría",
      value: "Comisaría",
      label: "comisaría",
      color: "oklch(32% 0.1 267.935)",
    },
    {
      id: "comude",
      value: "COMUDE",
      label: "comude",
      color: "oklch(44% 0.17 126.665)",
    },
    {
      id: "caec_(boletos_charros)",
      value: "CAEC (Boletos Charros)",
      label: "caec_(boletos_charros)",
      color: "oklch(42% 0.14 163.225)",
    },
    {
      id: "sindicatura",
      value: "Sindicatura",
      label: "sindicatura",
      color: "oklch(43% 0.19 259.815)",
    },
    {
      id: "administración_e_innovación_gubernamental",
      value: "Administración e Innovación Gubernamental",
      label: "administración_e_innovación_gubernamental",
      color: "oklch(30% 0.06 192.524)",
    },
    {
      id: "amim",
      value: "AMIM",
      label: "amim",
      color: "oklch(42% 0.2 324.591)",
    },
    {
      id: "cursos_en_el_parque_de_las_niñas_y_niños",
      value: "Cursos en el Parque de las niñas y niños",
      label: "cursos_en_el_parque_de_las_niñas_y_niños",
      color: "oklch(43% 0.21 323.949)",
    },
    {
      id: "romeria",
      value: "Romería",
      label: "romeria",
      color: "oklch(45% 0.15 98.111)",
    },
    {
      id: "contraloría_ciudadana",
      value: "Contraloría ciudadana",
      label: "contraloría_ciudadana",
      color: "oklch(44% 0.08 10.001)",
    },
    {
      id: "toc_toc",
      value: "Toc toc",
      label: "toc_toc",
      color: "oklch(42% 0.16 35)",
    },
    {
      id: "otros",
      value: "Otros",
      label: "otros",
      color: "oklch(42% 0.13 165.612)",
    },
    {
      id: "equipo_campaña",
      value: "Equipo campaña",
      label: "equipo_campaña",
      color: "oklch(40% 0.16 285)",
    },
    {
      id: "fiesta_de_abril",
      value: "Fiesta de Abril",
      label: "fiesta_de_abril",
      color: "oklch(44% 0.11 293.283)",
    },
    {
      id: "desabasto_de_agua_en_lomas_de_centinela",
      value: "Desabasto de agua en Lomas de Centinela",
      label: "desabasto_de_agua_en_lomas_de_centinela",
      color: "oklch(40% 0.15 245)",
    },
  ],

  category: [
    {
      id: "solicitud_de_información",
      value: "Solicitud de información",
      label: "solicitud_de_información",
      color: "oklch(45% 0.19 305.504)",
    },
    {
      id: "canalización_a_dependencia",
      value: "Canalización a dependencia",
      label: "canalización_a_dependencia",
      color: "oklch(43% 0.12 223.128)",
    },
    {
      id: "solicitudes_nuevas",
      value: "Solicitudes nuevas",
      label: "solicitudes_nuevas",
      color: "oklch(40% 0.12 240.79)",
    },
    {
      id: "reportes_de_servicios",
      value: "Reportes de servicios",
      label: "reportes_de_servicios",
      color: "oklch(43% 0.13 164.978)",
    },
    {
      id: "reportes_de_obras",
      value: "Reportes de obras",
      label: "reportes_de_obras",
      color: "oklch(46% 0.13 103.193)",
    },
    {
      id: "reportes_externos",
      value: "Reportes externos",
      label: "reportes_externos",
      color: "oklch(45% 0.15 75.834)",
    },
    {
      id: "solicitudes_especiales",
      value: "Solicitudes especiales",
      label: "solicitudes_especiales",
      color: "oklch(43% 0.12 207.078)",
    },
    {
      id: "reporte_de_inspección_y_vigilancia",
      value: "Reporte de inspección y vigilancia",
      label: "reporte_de_inspección_y_vigilancia",
      color: "oklch(32% 0.05 264.665)",
    },
    {
      id: "reportes_y_denuncias",
      value: "Reportes y denuncias",
      label: "reportes_y_denuncias",
      color: "oklch(45% 0.17 130.85)",
    },
    {
      id: "solicitud_de_empleo",
      value: "Solicitud de empleo",
      label: "solicitud_de_empleo",
      color: "oklch(37% 0.1 240.876)",
    },
    {
      id: "coyuntura",
      value: "Coyuntura",
      label: "coyuntura",
      color: "oklch(43% 0.16 25)",
    },
    {
      id: "participación_en_curso",
      value: "Participación en curso",
      label: "participación_en_curso",
      color: "oklch(45% 0.18 349.761)",
    },
    {
      id: "solicitud_de_obra",
      value: "Solicitud de obra",
      label: "solicitud_de_obra",
      color: "oklch(45% 0.17 47.604)",
    },
    {
      id: "otros",
      value: "Otros",
      label: "otros",
      color: "oklch(44% 0.08 10.001)",
    },
  ],

  channel: [
    {
      id: "comentarios",
      value: "Comentarios",
      color: "oklch(87.9% 0.169 91.605)",
    },
    { id: "inbox", value: "Inbox", color: "oklch(68.5% 0.169 237.323)" },
  ],

  priority: [
    { id: "baja", value: "Baja", color: "oklch(78.5% 0.115 274.713)" },
    { id: "media", value: "Media", color: "oklch(90.5% 0.182 98.111)" },
    { id: "alta", value: "Alta", color: "oklch(80.8% 0.114 19.571)" },
  ],

  status: [
    { id: "pendiente", value: "Pendiente", color: "oklch(90.5% 0.182 98.111)" },
    {
      id: "en_proceso",
      value: "En Proceso",
      color: "oklch(57.7% 0.245 27.325)",
    },
    { id: "resuelto", value: "Resuelto", color: "oklch(62.7% 0.194 149.214)" },
    { id: "dirección", value: "Dirección", color: "oklch(78.9% 0.154 211.53)" },
  ],
  social_network: [
    { id: "x", value: "X", color: "oklch(13% 0.028 261.692)" },
    { id: "tiktok", value: "Tiktok", color: "oklch(29.1% 0.149 302.717)" },
    { id: "instagram", value: "Instagram", color: "oklch(82.3% 0.12 346.018)" },
    { id: "facebook", value: "Facebook", color: "oklch(48.8% 0.243 264.376)" },
  ],
  excluded_view: [
    { id: "siop", value: "SIOP", label: "siop" },
    {
      id: "otras_coordinaciones",
      value: "Otras coordinaciones",
      label: "otras_coordinaciones",
    },
    { id: "caec", value: "CAEC (Boletos Charros)", label: "caec" },
    { id: "romeria", value: "Romería", label: "romeria" },
    { id: "toc_toc", value: "Toc toc", label: "toc_toc" },
    { id: "otros", value: "Otros", label: "otros" },
    { id: "equipo_campana", value: "Equipo campaña", label: "equipo_campana" },
    {
      id: "fiesta_de_abril",
      value: "Fiesta de Abril",
      label: "fiesta_de_abril",
    },
    {
      id: "desabasto_de_agua_en_lomas_de_centinela",
      value: "Desabasto de agua en Lomas de Centinela",
      label: "desabasto_de_agua_en_lomas_de_centinela",
    },
  ],
};
