export type PlantStatus = "draft" | "published";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type PlantImage = {
  id: string;
  url: string;
  storage_path?: string;
  alt_text: string;
  is_cover: boolean;
  sort_order: number;
};

export type Plant = {
  id: string;
  name: string;
  scientific_name: string;
  slug: string;
  category_id: string;
  category_name: string;
  short_description: string;
  description: string;
  growing_season: string;
  growth_duration: string;
  sunlight: string;
  watering: string;
  soil_type: string;
  care_tips: string;
  status: PlantStatus;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  images: PlantImage[];
};

export type SiteSettings = {
  id: string;
  farm_name: string;
  tagline: string;
  about_text: string;
  hero_image: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  instagram_url: string;
  facebook_url: string;
  created_at: string;
  updated_at: string;
};
