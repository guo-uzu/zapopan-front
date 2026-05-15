interface Area {
    id: string
    color: string
    label: string
    value: string
}

interface User {
    avatar_url?: string
    email?: string
    full_name: string
}

interface UpdatedUser {
    full_name: string
}

interface ResponseFromAPI {
    id: string
    created_at: string
    description_gob: string
    description_jjf: string
    labels_areas: Area[]
    latest_updated_user_id: UpdatedUser[] | UpdatedUser | null
    title: string
    updated_at: string
    user_id: User[] | User
}

interface DefaultForm {
    id?: string
    title: string
    jjfDescription: string
    gobDescription: string
    selectedAreas: Area[]
}

interface FormData {
    id?: string
    title?: string;
    jjfDescription?: string;
    gobDescription?: string;
    selectedAreas?: Area[];
}

export type { ResponseFromAPI, DefaultForm, FormData, Area, User }