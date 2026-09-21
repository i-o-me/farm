import type { Category, Plant, SiteSettings } from "@/lib/types";

export const categories: Category[] = [
  { id: "veg", name: "Vegetable", slug: "vegetable" },
  { id: "fruit", name: "Fruit", slug: "fruit" },
  { id: "herb", name: "Herb", slug: "herb" },
  { id: "flower", name: "Flower", slug: "flower" },
  { id: "tree", name: "Tree", slug: "tree" },
  { id: "other", name: "Other", slug: "other" },
];

export const siteSettings: SiteSettings = {
  id: "site-settings",
  farm_name: "Clover & Root Farm",
  tagline: "Seasonal abundance from soil to table.",
  about_text:
    "Clover & Root Farm grows healthy, vibrant plants with regenerative practices and careful stewardship. Our greenhouse and fields are designed around soil health, pollinator-friendly growing, and produce that tastes as good as it looks.",
  hero_image:
    "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1600&q=80",
  contact_email: "hello@cloverandrootfarm.com",
  contact_phone: "+1 (415) 555-0147",
  contact_address: "214 Orchard Lane, Sonoma Valley, CA",
  instagram_url: "https://instagram.com",
  facebook_url: "https://facebook.com", 
  created_at: "2024-03-01T00:00:00.000Z",
  updated_at: "2024-08-28T00:00:00.000Z",
};

export const samplePlants: Plant[] = [
  {
    id: "plant-1",
    name: "Heirloom Tomato",
    scientific_name: "Solanum lycopersicum",
    slug: "heirloom-tomato",
    category_id: "veg",
    category_name: "Vegetable",
    short_description: "Juicy, richly flavored tomatoes for salads, roasting, and fresh slicing.",
    description:
      "This beloved tomato variety produces deep red fruit with a sweet-tart balance that shines in the kitchen. It thrives in warm conditions and rewards regular feeding with a long, generous harvest season.",
    growing_season: "Late spring to early fall",
    growth_duration: "70-80 days",
    sunlight: "Full sun",
    watering: "Moderate, consistent moisture",
    soil_type: "Loamy, well-drained soil",
    care_tips:
      "Stake early and water at the base to reduce foliar disease. Mulch around the roots to keep soil evenly moist and support steady fruiting.",
    status: "published",
    is_featured: true,
    created_at: "2024-01-10T00:00:00.000Z",
    updated_at: "2024-02-02T00:00:00.000Z",
    images: [
      { id: "img-1", url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80", alt_text: "Fresh heirloom tomatoes on a vine", is_cover: true, sort_order: 1 },
      { id: "img-2", url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80", alt_text: "Tomato plants in a greenhouse", is_cover: false, sort_order: 2 },
    ],
  },
  {
    id: "plant-2",
    name: "Sweet Basil",
    scientific_name: "Ocimum basilicum",
    slug: "sweet-basil",
    category_id: "herb",
    category_name: "Herb",
    short_description: "A fragrant kitchen staple with bright, peppery leaves.",
    description:
      "Sweet basil brings unmistakable aroma to pastas, pesto, and fresh salads. The plant grows quickly under warm conditions and makes an excellent companion near tomatoes and peppers.",
    growing_season: "Spring through fall",
    growth_duration: "40-60 days",
    sunlight: "Full sun to partial shade",
    watering: "Regular, even moisture",
    soil_type: "Rich, well-draining soil",
    care_tips:
      "Pinch the growing tips regularly to encourage bushier growth and prevent flowering too early. Harvest frequently to keep the plant productive.",
    status: "published",
    is_featured: true,
    created_at: "2024-02-02T00:00:00.000Z",
    updated_at: "2024-02-11T00:00:00.000Z",
    images: [
      { id: "img-3", url: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=80", alt_text: "Fresh sweet basil leaves", is_cover: true, sort_order: 1 },
      { id: "img-4", url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80", alt_text: "Basil plants in the field", is_cover: false, sort_order: 2 },
    ],
  },
  {
    id: "plant-3",
    name: "Strawberry Bliss",
    scientific_name: "Fragaria × ananassa",
    slug: "strawberry-bliss",
    category_id: "fruit",
    category_name: "Fruit",
    short_description: "Sweet, sun-ripened berries with a vibrant, floral finish.",
    description:
      "This productive strawberry cultivar produces fragrant fruit with a balanced sweetness and bright acidity. It is well suited to raised beds and containers with careful watering.",
    growing_season: "Spring and early summer",
    growth_duration: "90-120 days",
    sunlight: "Full sun",
    watering: "Consistent moisture during fruiting",
    soil_type: "Sandy loam with compost",
    care_tips:
      "Mulch around the crowns to keep fruit clean and roots cool. Remove runners if you want stronger fruit production in a compact bed.",
    status: "published",
    is_featured: false,
    created_at: "2024-02-14T00:00:00.000Z",
    updated_at: "2024-03-01T00:00:00.000Z",
    images: [
      { id: "img-5", url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=80", alt_text: "Ripe strawberries on a plant", is_cover: true, sort_order: 1 },
      { id: "img-6", url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80", alt_text: "Strawberry farm rows", is_cover: false, sort_order: 2 },
    ],
  },
  {
    id: "plant-4",
    name: "Sunflower Gold",
    scientific_name: "Helianthus annuus",
    slug: "sunflower-gold",
    category_id: "flower",
    category_name: "Flower",
    short_description: "Tall, cheerful blooms that brighten beds and attract pollinators.",
    description:
      "Sunflower Gold brings bold color and a strong pollinator-friendly presence to the farm. With sturdy stems and large golden flowers, it helps support bees and adds long-lasting interest.",
    growing_season: "Late spring to early fall",
    growth_duration: "60-75 days",
    sunlight: "Full sun",
    watering: "Moderate, avoid overwatering",
    soil_type: "Well-drained, fertile soil",
    care_tips:
      "Sow after the last frost and provide strong support for taller stems in windy spots. Deadhead spent blooms to extend flowering and encourage a second flush.",
    status: "published",
    is_featured: true,
    created_at: "2024-02-19T00:00:00.000Z",
    updated_at: "2024-03-20T00:00:00.000Z",
    images: [
      { id: "img-7", url: "https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&w=900&q=80", alt_text: "Sunflowers blooming in the field", is_cover: true, sort_order: 1 },
      { id: "img-8", url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80", alt_text: "Golden flower bed", is_cover: false, sort_order: 2 },
    ],
  },
  {
    id: "plant-5",
    name: "Apple Tree",
    scientific_name: "Malus domestica",
    slug: "apple-tree",
    category_id: "tree",
    category_name: "Tree",
    short_description: "A classic orchard tree yielding crisp, aromatic fruit year after year.",
    description:
      "Our apple tree selection is bred for flavor, vigor, and easy harvest. The compact form fits small orchard plots while still maintaining a generous yield in a healthy season.",
    growing_season: "Spring through fall",
    growth_duration: "2-4 years to first fruit",
    sunlight: "Full sun",
    watering: "Deep watering during dry spells",
    soil_type: "Well-drained loam with organic matter",
    care_tips:
      "Prune lightly during dormancy to maintain airflow and structure. Thin fruit clusters when young to encourage larger, sweeter apples.",
    status: "draft",
    is_featured: false,
    created_at: "2024-03-08T00:00:00.000Z",
    updated_at: "2024-03-08T00:00:00.000Z",
    images: [
      { id: "img-9", url: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=900&q=80", alt_text: "Apple tree in bloom", is_cover: true, sort_order: 1 },
    ],
  },
  {
    id: "plant-6",
    name: "Baby Kale",
    scientific_name: "Brassica oleracea var. acephala",
    slug: "baby-kale",
    category_id: "veg",
    category_name: "Vegetable",
    short_description: "Tender greens with sturdy leaves and a rich earthy flavor.",
    description:
      "Baby kale is a quick, versatile leafy green suited for salads, sautés, and smoothies. It grows well in cool months and has a sweet, robust flavor that holds up well to cooking.",
    growing_season: "Cool season",
    growth_duration: "30-45 days",
    sunlight: "Partial sun to full sun",
    watering: "Moderate and regular",
    soil_type: "Rich, moisture-retentive soil",
    care_tips:
      "Succession sow every 2-3 weeks for continued harvest and keep the soil evenly moist to avoid bitterness. Harvest young leaves for tender texture.",
    status: "published",
    is_featured: false,
    created_at: "2024-04-02T00:00:00.000Z",
    updated_at: "2024-04-12T00:00:00.000Z",
    images: [
      { id: "img-10", url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80", alt_text: "Fresh kale leaves", is_cover: true, sort_order: 1 },
    ],
  },
  {
    id: "plant-7",
    name: "Lemon Thyme",
    scientific_name: "Thymus citriodorus",
    slug: "lemon-thyme",
    category_id: "herb",
    category_name: "Herb",
    short_description: "A fragrant herb with citrus-laced notes for savory cooking.",
    description:
      "Lemon thyme is a hardy aromatic herb with a bright, citrusy scent and compact growth habit. It is ideal for herb gardens, edging, and kitchen windowsills.",
    growing_season: "Late spring to early fall",
    growth_duration: "45-60 days",
    sunlight: "Full sun",
    watering: "Low to moderate, drought tolerant",
    soil_type: "Well-drained, lean soil",
    care_tips:
      "Trim lightly after flowering to maintain a fresh, compact mound. Avoid keeping the soil too wet, as thyme prefers leaner ground and excellent drainage.",
    status: "published",
    is_featured: false,
    created_at: "2024-03-25T00:00:00.000Z",
    updated_at: "2024-04-18T00:00:00.000Z",
    images: [
      { id: "img-11", url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80", alt_text: "Lemon thyme herb plants", is_cover: true, sort_order: 1 },
    ],
  },
];

export function getPublishedPlants(): Plant[] {
  return samplePlants.filter((plant) => plant.status === "published");
}

export function getFeaturedPlants(): Plant[] {
  return getPublishedPlants().filter((plant) => plant.is_featured);
}

export function getPlantBySlug(slug: string): Plant | undefined {
  return samplePlants.find((plant) => plant.slug === slug);
}

export function getPlantById(id: string): Plant | undefined {
  return samplePlants.find((plant) => plant.id === id);
}

export function getPlantsByCategory(categorySlug: string): Plant[] {
  return getPublishedPlants().filter(
    (plant) => plant.category_name.toLowerCase() === categorySlug.toLowerCase(),
  );
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getRelatedPlants(currentPlant: Plant): Plant[] {
  return getPublishedPlants()
    .filter((plant) => plant.category_id === currentPlant.category_id && plant.id !== currentPlant.id)
    .slice(0, 3);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
