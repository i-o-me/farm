import { ArrowUpRight } from "lucide-react";
import { getAdminCategories, getAdminPlants } from "@/lib/supabase/data";

export default async function AdminOverviewPage() {
  const [plants, categories] = await Promise.all([getAdminPlants(), getAdminCategories()]);
  const totalPlants = plants.length;
  const publishedPlants = plants.filter((plant) => plant.status === "published").length;
  const draftPlants = totalPlants - publishedPlants;
  const recentPlants = plants.slice(0, 4);

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-stone-900">Operations dashboard</h1>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-[20px] border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">Total plants</p>
          <p className="mt-3 text-3xl font-semibold text-stone-900">{totalPlants}</p>
        </div>
        <div className="rounded-[20px] border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">Published</p>
          <p className="mt-3 text-3xl font-semibold text-stone-900">{publishedPlants}</p>
        </div>
        <div className="rounded-[20px] border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">Drafts</p>
          <p className="mt-3 text-3xl font-semibold text-stone-900">{draftPlants}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[22px] border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-stone-900">Recently added</h2>
            <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-[#2F5D3A]">
              View all
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {recentPlants.map((plant) => (
              <div key={plant.id} className="flex items-center justify-between rounded-2xl border border-stone-200 p-3">
                <div>
                  <p className="font-medium text-stone-900">{plant.name}</p>
                  <p className="text-sm text-stone-500">{plant.category_name}</p>
                </div>
                <span className="rounded-full bg-[#edf3ed] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#2F5D3A]">
                  {plant.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-stone-900">Categories</h2>
          <div className="mt-5 space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between rounded-2xl border border-stone-200 p-3">
                <span className="font-medium text-stone-800">{category.name}</span>
                <span className="text-sm text-stone-500">{plants.filter((plant) => plant.category_id === category.id).length}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
