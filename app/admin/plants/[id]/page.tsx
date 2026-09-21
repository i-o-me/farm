import { notFound } from "next/navigation";
import PlantForm from "@/app/admin/plants/PlantForm";
import { getAdminPlantById } from "@/lib/supabase/data";

export default async function EditPlantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plant = await getAdminPlantById(id);

  if (!plant) notFound();

  return (
    <main className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">Edit plant</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-stone-900">{plant.name}</h1>
      </div>
      <PlantForm initialPlant={plant} />
    </main>
  );
}
