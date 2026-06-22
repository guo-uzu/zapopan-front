import { createClient } from "@/utils/supabase/client";

export class SingletonClientSupabase {
  static #instance: SingletonClientSupabase;
  private constructor() { }
  public static get instance(): SingletonClientSupabase {
    if (!SingletonClientSupabase.#instance) SingletonClientSupabase.#instance = createClient;
    return SingletonClientSupabase.#instance
  }
}

