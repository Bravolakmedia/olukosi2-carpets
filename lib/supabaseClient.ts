import { createClient } from "@supabase/supabase-js"
import { Database } from "./types/database"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or anon key");
}


export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

console.log("=== Supabase URL:", supabaseUrl)
console.log("=== Supabase ANON KEY:", supabaseAnonKey?.substring(0, 5) + "…")


// Server-side client with service role key
export const supabaseAdmin = createClient<Database>(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})