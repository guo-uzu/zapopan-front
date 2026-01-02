// src/hooks/types.ts

type NestedName = {
  name: string
}

type NestedUser = {
  full_name: string
}

export type Inputs = {
  id?: string
  created_at?: string | Date
  updated_at?: string | Date

  // --- 1. NESTED OBJECTS (For the Table View) ---
  user_id?: NestedUser | null
  latest_updated_user_id?: NestedUser | null
  account_bitacora?: NestedName | null
  area_responsable_bitacora?: NestedName | null
  category_bitacora?: NestedName | null
  channel_bitacora?: NestedName | null
  priority_bitacora?: NestedName | null
  status_bitacora?: NestedName | null
  social_network_bitacora?: NestedName | null

  // --- 2. FLAT FIELDS (For the Edit Form) ---
  // We need to add these back so setDefaultData works!
  account?: string
  area_responsable?: string
  category?: string
  channel?: string
  priority?: string
  status?: string
  social_network?: string
  responsable_area_bitacora?: {
    name: string
  }

  // --- 3. SHARED FIELDS ---
  colonia: string
  description: string
  link: string
  observations: string
  username: string
  folio: string
  shared?: boolean
}