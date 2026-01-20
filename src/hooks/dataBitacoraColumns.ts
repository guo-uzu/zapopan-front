import { getUsersFilter } from "./fetch-data";
import { formatData } from "./formatData";

export const UsersFormatFilterBitacora = async () => {
    const users = await getUsersFilter()
    if (!users) {
        return []
    }
    return users.map(user => {
        return { id: formatData(user.full_name), value: user.full_name, label: formatData(user.full_name) }
    })
}


export const ColumnsBitacoraOpts = {
    account: [
        { id: "jjf", value: "JJF", color: "oklch(75% 0.183 55.934)" },
        { id: "zapopan", value: "Zapopan", color: "oklch(67.3% 0.182 276.935)" },
    ],

    area_responsable: [
        { id: "infraestructura_de_comercio", value: "Infraestructura de comercio", label: "infraestructura_de_comercio", color: "oklch(40.8% 0.123 38.172)" },
        { id: "servicios_municipales", value: "Servicios municipales", label: "servicios_municipales", color: "oklch(70.4% 0.14 182.503)" },
        { id: "gestión_integral", value: "Gestión integral", label: "gestión_integral", color: "oklch(62.7% 0.194 149.214)" },
        { id: "secretaría_del_ayuntamiento", value: "Secretaría del ayuntamiento", label: "secretaría_del_ayuntamiento", color: "oklch(78.5% 0.115 274.713)" },
        { id: "desarrollo_económico", value: "Desarrollo económico", label: "desarrollo_económico", color: "oklch(90.3% 0.076 319.62)" },
        { id: "construcción_comunidad", value: "Construcción comunidad", label: "construcción_comunidad", color: "oklch(82.8% 0.111 230.318)" },
        { id: "dif", value: "DIF", label: "dif", color: "oklch(70.8% 0 0)" },
        { id: "tesorería", value: "Tesorería", label: "tesorería", color: "oklch(71.4% 0.203 305.504)" },
        { id: "cfe", value: "CFE", label: "cfe", color: "oklch(55.3% 0.013 58.071)" },
        { id: "siapa", value: "SIAPA", label: "siapa", color: "oklch(58.8% 0.158 241.966)" },
        { id: "siop", value: "SIOP", label: "siop", color: "oklch(97.3% 0.071 103.193)" },
        { id: "otras_coordinaciones", value: "Otras coordinaciones", label: "otras_coordinaciones", color: "oklch(88.5% 0.062 18.334)" },
        { id: "otras_dependencias_estatales", value: "Otras dependencias estatales", label: "otras_dependencias_estatales", color: "oklch(47.6% 0.114 61.907)" },
        { id: "presidencia", value: "Presidencia", label: "presidencia", color: "oklch(95.4% 0.038 75.164)" },
        { id: "guadalajara", value: "Guadalajara", label: "guadalajara", color: "oklch(71.2% 0.194 13.428)" },
        { id: "inspección_y_vigilancia", value: "Inspección y vigilancia", label: "inspección_y_vigilancia", color: "oklch(93.2% 0.032 255.585)" },
        { id: "pcyb", value: "PCyB", label: "pcyb", color: "oklch(51.4% 0.222 16.935)" },
        { id: "cercanía_ciudadana", value: "Cercanía ciudadana", label: "cercanía_ciudadana", color: "oklch(38% 0.189 293.745)" },
        { id: "salud_zapopan", value: "Salud Zapopan", label: "salud_zapopan", color: "oklch(65.6% 0.241 354.308)" },
        { id: "comisaría", value: "Comisaría", label: "comisaría", color: "oklch(28.2% 0.091 267.935)" },
        { id: "comude", value: "COMUDE", label: "comude", color: "oklch(89.7% 0.196 126.665)" },
        { id: "caec_(boletos_charros)", value: "CAEC (Boletos Charros)", label: "caec_(boletos_charros)", color: "oklch(59.6% 0.145 163.225)" },
        { id: "sindicatura", value: "Sindicatura", label: "sindicatura", color: "oklch(62.3% 0.214 259.815)" },
        { id: "administración_e_innovación_gubernamental", value: "Administración e Innovación Gubernamental", label: "administración_e_innovación_gubernamental", color: "oklch(86.9% 0.022 252.894)" },
        { id: "amim", value: "AMIM", label: "amim", color: "oklch(45.2% 0.211 324.591)" },
        { id: "cursos_en_el_parque_de_las_niñas_y_niños", value: "Cursos en el Parque de las niñas y niños", label: "cursos_en_el_parque_de_las_niñas_y_niños", color: "oklch(51.8% 0.253 323.949)" },
        { id: "romeria", value: "Romería", label: "romeria", color: "oklch(90.5% 0.182 98.111)" },
        { id: "contraloría_ciudadana", value: "Contraloría ciudadana", label: "contraloría_ciudadana", color: "oklch(89.2% 0.058 10.001)" },
        { id: "toc_toc", value: "Toc toc", label: "toc_toc", color: "" },
        { id: "otros", value: "Otros", label: "otros", color: "oklch(50.8% 0.118 165.612)" },
        { id: "equipo_campaña", value: "Equipo campaña", label: "equipo_campaña", color: "" },
        { id: "fiesta_de_abril", value: "Fiesta de Abril", label: "fiesta_de_abril", color: "oklch(89.4% 0.057 293.283)" },
        { id: "desabasto_de_agua_en_lomas_de_centinela", value: "Desabasto de agua en Lomas de Centinela", label: "desabasto_de_agua_en_lomas_de_centinela", color: "" },
    ],

    category: [
        { id: "solicitud_de_información", value: "Solicitud de información", label: "solicitud_de_información", color: "oklch(71.4% 0.203 305.504)" },
        { id: "canalización_a_dependencia", value: "Canalización a dependencia", label: "canalización_a_dependencia", color: "oklch(52% 0.105 223.128)" },
        { id: "solicitudes_nuevas", value: "Solicitudes nuevas", label: "solicitudes_nuevas", color: "oklch(90.1% 0.058 230.902)" },
        { id: "reportes_de_servicios", value: "Reportes de servicios", label: "reportes_de_servicios", color: "oklch(84.5% 0.143 164.978)" },
        { id: "reportes_de_obras", value: "Reportes de obras", label: "reportes_de_obras", color: "oklch(97.3% 0.071 103.193)" },
        { id: "reportes_externos", value: "Reportes externos", label: "reportes_externos", color: "oklch(68.1% 0.162 75.834)" },
        { id: "solicitudes_especiales", value: "Solicitudes especiales", label: "solicitudes_especiales", color: "oklch(86.5% 0.127 207.078)" },
        { id: "reporte_de_inspección_y_vigilancia", value: "Reporte de inspección y vigilancia", label: "reporte_de_inspección_y_vigilancia", color: "oklch(86.9% 0.022 252.894)" },
        { id: "reportes_y_denuncias", value: "Reportes y denuncias", label: "reportes_y_denuncias", color: "oklch(76.8% 0.233 130.85)" },
        { id: "solicitud_de_empleo", value: "Solicitud de empleo", label: "solicitud_de_empleo", color: "oklch(39.1% 0.09 240.876)" },
        { id: "coyuntura", value: "Coyuntura", label: "coyuntura", color: "" },
        { id: "participación_curso", value: "Participación en curso", label: "participación_curso", color: "oklch(71.8% 0.202 349.761)" },
        { id: "solicitud_de_obra", value: "Solicitud de obra", label: "solicitud_de_obra", color: "oklch(70.5% 0.213 47.604)" },
        { id: "otros", value: "Otros", label: "otros", color: "oklch(89.2% 0.058 10.001)" },
    ],

    channel: [
        { id: "comentarios", value: "Comentarios", color: "oklch(87.9% 0.169 91.605)" },
        { id: "inbox", value: "Inbox", color: "oklch(68.5% 0.169 237.323)" },
    ],

    priority: [
        { id: "baja", value: "Baja", color: "oklch(78.5% 0.115 274.713)" },
        { id: "media", value: "Media", color: "oklch(90.5% 0.182 98.111)" },
        { id: "alta", value: "Alta", color: "oklch(80.8% 0.114 19.571)" },
    ],

    status: [
        { id: "pendiente", value: "Pendiente", color: "oklch(90.5% 0.182 98.111)" },
        { id: "en_proceso", value: "En Proceso", color: "oklch(57.7% 0.245 27.325)" },
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
        { id: "otras_coordinaciones", value: "Otras coordinaciones", label: "otras_coordinaciones" },
        { id: "caec", value: "CAEC (Boletos Charros)", label: "caec" },
        { id: "romeria", value: "Romería", label: "romeria" },
        { id: "toc_toc", value: "Toc toc", label: "toc_toc" },
        { id: "otros", value: "Otros", label: "otros" },
        { id: "equipo_campana", value: "Equipo campaña", label: "equipo_campana" },
        { id: "fiesta_de_abril", value: "Fiesta de Abril", label: "fiesta_de_abril" },
        { id: "desabasto_de_agua_en_lomas_de_centinela", value: "Desabasto de agua en Lomas de Centinela", label: "desabasto_de_agua_en_lomas_de_centinela" },
    ]
};
