import { createClient } from "@supabase/supabase-js";

let supabaseUrl;
let supabaseAnonKey;

if (process.env.NODE_ENV === "test") {
  supabaseUrl = "http://localhost/test";
  supabaseAnonKey = "__SUPABASE_ANON_KEY_TEST_KEY__";
} else {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
