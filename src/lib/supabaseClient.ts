// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Hardcode your Supabase URL and anon key here.
// These are the SAME values you put in .env.local
const supabaseUrl = "https://digital-detox-d8a86.supabase.co"; // <= replace with your real URL
const supabaseAnonKey = ""
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key must be set in supabaseClient.ts");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
