"use server"
import { Inputs } from "@/hooks/types";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

import { accountMap, areaMap, categoryMap, channelMap, mustMap, priorityMap, socialNetworkMap, statusMap } from "../bitacora/maps";

export const updateDataSupabase = async (
    formData: Inputs,
    defaultData: Partial<Inputs>,
) => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not founded");
    const payload = {
        latest_updated_user_id: user.id,
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
        updated_at: new Date().toISOString(),
        folio: formData.folio || null,
        username: formData.username,
        social_network_id: mustMap(
            socialNetworkMap,
            formData.social_network,
            "social_network",
        ),
    };
    console.log("payload", payload);
    const { error } = await supabase
        .from("bitacora")
        .update(payload)
        .eq("id", formData.id);
    if (error) {
        console.log("error bitacora updated", error);
        throw new Error("DB insert failed");
    }
    return { ok: true };
};