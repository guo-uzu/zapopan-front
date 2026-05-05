type NestedName = {
    name: string;
};

type NestedUser = {
    full_name: string;
};

type BitacoraRecord = {
    id: string;
    user_id?: NestedUser;
    created_by_name?: string;
    account_id?: NestedName;
    area_id?: NestedName;
    channel_id?: NestedName;
    category_id?: NestedName;
    social_network_id?: NestedName;
    priority_id?: NestedName;
    status_id?: NestedName;
    username?: string;
    link?: string;
    description?: string;
    colonia?: string;
    folio?: string;
    observations: string;
    created_at: string;
    updated_at: string;
    latest_updated_user_id?: NestedUser;
};

type BitacoraFormState = {
    id: string;
    username?: string;
    account: string;
    channel: string;
    link?: string;
    category: string;
    area_responsable: string;
    description?: string;
    colonia?: string;
    social_network: string;
    priority: string;
    status: string;
    folio?: string;
    observations?: string;
}

type BitacoraTableMeta = {
    setDefaultData: (data: BitacoraFormState) => void;
    handleToEdit: () => void;
    handleOpenForm: () => void;
};

export type { BitacoraFormState, BitacoraRecord, BitacoraTableMeta }