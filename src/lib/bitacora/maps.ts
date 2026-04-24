import { Inputs } from "@/hooks/types";


export function mustMap<T extends string>(
    map: Record<T, number>,
    key: T | undefined,
    field: string,
) {
    if (key === undefined || key === null) {
        throw new Error(`Valor requerido faltante para: ${field}`);
    }

    const id = map[key];
    if (id === undefined || id === null)
        throw new Error(`Valor inválido para ${field}: "${key}"`);
    return id;
}

export const accountMap: Record<NonNullable<Inputs["account"]>, number> = {
    zapopan: 0,
    jjf: 1,
};

export const socialNetworkMap: Record<
    NonNullable<Inputs["social_network"]>,
    number
> = {
    facebook: 1,
    x: 2,
    instagram: 3,
    tiktok: 4,
};

export const areaMap: Record<NonNullable<Inputs["area_responsable"]>, number> = {
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
    cursos_en_el_parque_de_las_niñas_y_niños: 25, // Se requieren comillas por los espacios
    romería: 26,
    contraloría_ciudadana: 27,
    toc_toc: 28,
    otros: 29,
    equipo_campaña: 30,
    fiesta_de_abril: 31,
    desabasto_de_agua_en_lomas_de_centinela: 32,
    infraestrucura_en_comercio: 33,
};

export const categoryMap: Record<NonNullable<Inputs["category"]>, number> = {
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

export const channelMap: Record<NonNullable<Inputs["channel"]>, number> = {
    comentarios: 0,
    inbox: 1,
};

export const priorityMap: Record<NonNullable<Inputs["priority"]>, number> = {
    baja: 0,
    media: 1,
    alta: 2,
};

export const statusMap: Record<NonNullable<Inputs["status"]>, number> = {
    pendiente: 0,
    en_proceso: 1,
    resuelto: 2,
    dirección: 3,
};