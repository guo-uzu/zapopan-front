type NestedName = {
    name: string;
};

type NestedUser = {
    full_name: string;
};

export type BitacoraTable = {
    id: string;
    user_id?: NestedUser;
    social_network_id?: NestedName;
    account_id?: NestedName;
    channel_id?: NestedName;
    username?: string;
    link?: string;
    created_at: string;
    category_id?: NestedName;
    description?: string;
    area_id?: NestedName;
    colonia?: string;
    priority?: string;
    status?: string;
    folio?: string;
    observations: string;
    updated_at: string;
    latest_updated_user_id?: NestedUser;
    created_by_name?: string;

    priority_id: NestedName;
    status_id: NestedName;

    shared?: boolean;
};
