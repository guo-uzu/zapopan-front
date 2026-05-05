"use server";
import { createClient } from "@/utils/supabase/server";
import { Inputs } from "@/hooks/types";
import { cookies } from "next/headers";
import { Option } from "@/app/respuestas/[[...respuestas]]/multi-select";
import { mustMap, accountMap, areaMap, categoryMap, channelMap, priorityMap, statusMap, socialNetworkMap } from "@/lib/bitacora/maps";

export const sendDataSupabase = async (formData: Inputs) => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not founded");
    const payload = {
        user_id: user.id,
        account_id: mustMap(accountMap, formData.account, "account"),
        area_id: mustMap(
            areaMap,
            formData.area_responsable,
            "area_responsable",
        ),
        category_id: mustMap(categoryMap, formData.category, "category"),
        channel_id: mustMap(channelMap, formData.channel, "channel"),
        priority_id: mustMap(priorityMap, formData.priority, "priority"),
        status_id: mustMap(statusMap, formData.status, "status"),
        colonia: formData.colonia || null,
        description: formData.description,
        link: formData.link || null,
        observations: formData.observations || null,
        created_at: new Date().toISOString(),
        username: formData.username,
        folio: formData.folio || null,
        social_network_id: mustMap(
            socialNetworkMap,
            formData.social_network,
            "social_network",
        ),
    };
    const { error } = await supabase.from("bitacora").insert(payload);
    if (error) {
        console.log("error bitacora insert", error);
        throw new Error("DB insert failed");
    }
    return { ok: true };
};



export const sendResponse = async (formData: {
    title?: string;
    jjfDescription?: string;
    gobDescription?: string;
    selectedAreas?: Option[];
    selectedCategories?: Option[];
}) => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not founded");
    const payload = {
        title: formData.title,
        description_jjf: formData.jjfDescription,
        description_gob: formData.gobDescription,
        labels_areas: formData.selectedAreas,
        labels_categories: formData.selectedCategories,
        user_id: user.id,
    };
    const { error } = await supabase.from("respuestas").insert(payload);
    if (error) {
        console.log(payload);
        console.log("error respuestas insert", error);
        throw new Error("DB insert failed");
    }
    return { ok: true };
};

export const updateResponse = async (formData: {
    id?: string | undefined;
    title: string | undefined;
    jjfDescription: string | undefined;
    gobDescription: string | undefined;
    selectedAreas: Option[] | undefined;
}) => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not founded");
    const payload = {
        title: formData.title,
        description_jjf: formData.jjfDescription,
        description_gob: formData.gobDescription,
        labels_areas: formData.selectedAreas,
        updated_at: new Date(),
        latest_updated_user_id: user.id,
    };
    const { error } = await supabase
        .from("respuestas")
        .update(payload)
        .eq("id", formData.id);
    if (error) {
        console.log("error respuestas update", error);
        throw new Error("DB insert failed");
    }
    return { ok: true };
};
