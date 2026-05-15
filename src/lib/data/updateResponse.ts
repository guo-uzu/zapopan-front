"use server"
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { FormData } from "@/types/respuestas";

export const updateResponse = async (formData: FormData) => {
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