import { createClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

export const supabase = createClient(
  "https://fiiifnqafceyyciqjqof.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpaWlmbnFhZmNleXljaXFqcW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MjgyODcsImV4cCI6MjA4NTEwNDI4N30.I1Dz9DesSc08GuJwDe8NFU_gN6g71mgyrHW2CHOpwBQ",
);
