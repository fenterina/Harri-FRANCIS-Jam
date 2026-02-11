import 'react-native-url-polyfill/auto';
import { createClient } from "@supabase/supabase-js";


// Resolve Supabase config from environment or Expo manifest extras.
const SUPABASE_URL =
	process.env.SUPABASE_URL;

const SUPABASE_ANON_KEY =
	process.env.SUPABASE_ANON_KEY;

export const supabase = createClient("https://ncknvmckphqlernbzfpm.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ja252bWNrcGhxbGVybmJ6ZnBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTc4NjAsImV4cCI6MjA4NTYzMzg2MH0.I4JCaYMnTQ6YWFqxpY47WEN33GeLJA28MgcFcdgdhW8");
