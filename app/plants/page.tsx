import { categories } from "@/lib/data";
import { getPublicPlants } from "@/lib/supabase/data";
import PlantsBrowser from "@/app/plants/PlantsBrowser";

export default async function PlantsPage() {
  const plants = await getPublicPlants();

  return (
    <main className="container-shell py-16">
      <PlantsBrowser plants={plants} categories={categories} />
    </main>
  );
}
