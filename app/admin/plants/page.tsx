import Link from "next/link";
import { getAdminPlants } from "@/lib/supabase/data";
import PlantManager from "@/app/admin/plants/PlantManager";

export default async function AdminPlantsPage() {
  const plants = await getAdminPlants();

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">Plants</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-stone-900">Plant management</h1>
        </div>
        <Link href="/admin/plants/new" className="inline-flex items-center justify-center rounded-full bg-[#2F5D3A] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#24462f]">
          Add plant
        </Link>
      </div>

      <div className="rounded-[22px] border border-stone-200 bg-white p-4 shadow-sm">
        <PlantManager initialPlants={plants} />
      </div>
    </main>
  );
}
