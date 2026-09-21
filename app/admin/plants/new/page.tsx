import PlantForm from "@/app/admin/plants/PlantForm";

export default function NewPlantPage() {
  return (
    <main className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">New plant</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-stone-900">Add a plant</h1>
      </div>

      <PlantForm />
    </main>
  );
}
