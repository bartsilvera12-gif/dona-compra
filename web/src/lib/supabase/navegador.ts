"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SCHEMA, supabaseAnonKey, supabaseUrl } from "./config";

/** Cliente de Supabase para el navegador. */
export function clienteNavegador() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    db: { schema: SCHEMA },
  });
}
