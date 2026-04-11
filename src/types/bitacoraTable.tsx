type NestedName = {
    name: string;
};

type NestedUser = {
    full_name: string;
};

export type BitacoraTable = {
    id: string;
    user_id?: NestedUser;
    social_network_bitacora?: NestedName;
    account_bitacora?: NestedName;
    channel_bitacora?: NestedName;
    username?: string;
    link?: string;
    created_at: string;
    category_bitacora?: NestedName;
    description?: string;
    area_bitacora?: NestedName;
    colonia?: string;
    priority?: string;
    status?: string;
    folio?: string;
    observations: string;
    updated_at: string;
    latest_updated_user_id?: NestedUser;
    created_by_name?: string;

    priority_bitacora?: NestedName;
    status_bitacora?: NestedName;

    shared?: boolean;
};
