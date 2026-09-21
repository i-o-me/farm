import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseUrl() {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/$/, "");
}

export function getSupabaseAnonKey() {
  return (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
}

export function hasValidSupabaseConfig() {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!url || !anonKey || /[\r\n]/.test(url) || /[\r\n]/.test(anonKey) || anonKey.includes("SUPABASE_SERVICE_ROLE_KEY=")) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" || parsedUrl.hostname === "localhost";
  } catch {
    return false;
  }
}

export function createSupabaseClient() {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!hasValidSupabaseConfig()) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "https:" && parsedUrl.hostname !== "localhost") {
      return null;
    }
  } catch {
    return null;
  }

  return createBrowserClient(url, anonKey);
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}
