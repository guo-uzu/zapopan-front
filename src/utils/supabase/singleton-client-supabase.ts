import { createClient } from "@/utils/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js"

export class SingletonClientSupabase {
  static #instance: SupabaseClient | null = null
  private constructor() { }
  public static get instance(): SupabaseClient {
    if (!SingletonClientSupabase.#instance) SingletonClientSupabase.#instance = createClient();
    return SingletonClientSupabase.#instance
  }
}

