import { getPublishedPlants, getPlantBySlug, getFeaturedPlants, siteSettings as fallbackSettings } from "@/lib/data";
import type { Category, Plant, SiteSettings } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasValidSupabaseConfig } from "@/lib/supabase/client";

function isConfigured() {
  return hasValidSupabaseConfig();
}

type SupabasePlantRow = Omit<Plant, "category_name" | "images"> & {
  categories?: { name?: string } | { name?: string }[] | null;
  plant_images?: Plant["images"] | null;
};

function mapPlant(row: SupabasePlantRow): Plant {
  const category = Array.isArray(row.categories)
    ? row.categories[0]
    : row.categories;

  return {
    ...row,
    category_name: category?.name || "Other",
    images: (row.plant_images || []).sort(
      (first, second) => first.sort_order - second.sort_order,
    ),
  };
}

async function queryPlants(options?: { featured?: boolean; slug?: string }) {
  if (!isConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("plants")
    .select("*, categories(name), plant_images(*)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (options?.featured) query = query.eq("is_featured", true);
  if (options?.slug) query = query.eq("slug", options.slug).limit(1);

  const { data, error } = await query;
  if (error) {
    console.error("Supabase plant query failed:", error.message);
    return null;
  }

  return (data as SupabasePlantRow[]).map(mapPlant);
}

export async function getPublicPlants() {
  const plants = await queryPlants();
  return plants ?? getPublishedPlants();
}

export async function getPublicFeaturedPlants() {
  const plants = await queryPlants({ featured: true });
  return plants ?? getFeaturedPlants();
}

export async function getPublicPlantBySlug(slug: string) {
  const plants = await queryPlants({ slug });
  return plants ? plants[0] : getPlantBySlug(slug);
}

export async function getPublicSiteSettings(): Promise<SiteSettings> {
  if (!isConfigured()) return fallbackSettings;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("Supabase settings query failed:", error.message);
    return fallbackSettings;
  }

  return data as SiteSettings;
}

export async function getAdminPlants(): Promise<Plant[]> {
  if (!isConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("plants")
    .select("*, categories(name), plant_images(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase admin plant query failed:", error.message);
    return [];
  }

  return (data as SupabasePlantRow[]).map(mapPlant);
}

export async function getAdminPlantById(id: string): Promise<Plant | null> {
  if (!isConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("plants")
    .select("*, categories(name), plant_images(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("Supabase admin plant query failed:", error.message);
    return null;
  }

  return mapPlant(data as SupabasePlantRow);
}

export async function getAdminCategories() {
  if (!isConfigured()) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("categories").select("id, name, slug").order("name");
  if (error) {
    console.error("Supabase admin category query failed:", error.message);
    return [];
  }
  return (data || []) as Category[];
}
