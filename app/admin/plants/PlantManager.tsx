"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, PencilLine, Search, Star, Trash2 } from "lucide-react";
import { createSupabaseClient } from "@/lib/supabase/client";
import type { Plant } from "@/lib/types";

type PlantManagerProps = {
  initialPlants: Plant[];
};

export default function PlantManager({ initialPlants }: PlantManagerProps) {
  const [plants, setPlants] = useState(initialPlants);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const visiblePlants = plants.filter((plant) => {
    const matchesSearch = plant.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || plant.status === status;
    return matchesSearch && matchesStatus;
  });

  async function updatePlant(id: string, changes: Partial<Plant>) {
    const supabase = createSupabaseClient();
    if (!supabase) return;
    setBusyId(id);
    setError("");

    const { error: updateError } = await supabase
      .from("plants")
      .update(changes)
      .eq("id", id);

    if (updateError) setError(updateError.message);
    else setPlants((current) => current.map((plant) => plant.id === id ? { ...plant, ...changes } : plant));
    setBusyId("");
  }

  async function deletePlant(plant: Plant) {
    if (!window.confirm(`Delete ${plant.name}? This cannot be undone.`)) return;
    const supabase = createSupabaseClient();
    if (!supabase) return;
    setBusyId(plant.id);
    setError("");

    const storagePaths = plant.images
      .map((image) => image.storage_path)
      .filter((path): path is string => Boolean(path));

    if (storagePaths.length) await supabase.storage.from("plant-images").remove(storagePaths);
    const { error: deleteError } = await supabase.from("plants").delete().eq("id", plant.id);

    if (deleteError) setError(deleteError.message);
    else setPlants((current) => current.filter((item) => item.id !== plant.id));
    setBusyId("");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="flex flex-1 items-center gap-3 rounded-full border border-stone-200 bg-[#fafaf7] px-3 py-2 text-sm text-stone-500">
          <Search className="h-4 w-4" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search admin plants" placeholder="Search plants" className="w-full bg-transparent outline-none placeholder:text-stone-400" />
        </label>
        <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700 outline-none">
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-stone-500">
              <th className="pb-3 pr-4">Plant</th>
              <th className="pb-3 pr-4">Category</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Featured</th>
              <th className="pb-3 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visiblePlants.map((plant) => {
              const cover = plant.images.find((image) => image.is_cover) || plant.images[0];
              return (
                <tr key={plant.id} className="border-b border-stone-100 align-middle">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                        {cover?.url && <Image src={cover.url} alt={cover.alt_text || plant.name} fill className="object-cover" />}
                      </div>
                      <div><p className="font-medium text-stone-900">{plant.name}</p><p className="text-xs text-stone-500">{plant.slug}</p></div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-stone-700">{plant.category_name}</td>
                  <td className="py-3 pr-4">
                    <button type="button" disabled={busyId === plant.id} onClick={() => updatePlant(plant.id, { status: plant.status === "published" ? "draft" : "published" })} className="rounded-full bg-[#edf3ed] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#2F5D3A] disabled:opacity-50">
                      {plant.status}
                    </button>
                  </td>
                  <td className="py-3 pr-4">
                    <button type="button" disabled={busyId === plant.id} aria-label={`Toggle featured for ${plant.name}`} onClick={() => updatePlant(plant.id, { is_featured: !plant.is_featured })}>
                      <Star className={`h-4 w-4 ${plant.is_featured ? "fill-[#2F5D3A] text-[#2F5D3A]" : "text-stone-400"}`} />
                    </button>
                  </td>
                  <td className="py-3 pr-4"><div className="flex justify-end gap-2">
                    <Link href={`/plants/${plant.slug}`} target="_blank" aria-label={`View ${plant.name}`} className="rounded-lg border border-stone-200 p-2 text-stone-700 hover:border-stone-300"><Eye className="h-4 w-4" /></Link>
                    <Link href={`/admin/plants/${plant.id}`} aria-label={`Edit ${plant.name}`} className="rounded-lg border border-stone-200 p-2 text-stone-700 hover:border-stone-300"><PencilLine className="h-4 w-4" /></Link>
                    <button type="button" disabled={busyId === plant.id} onClick={() => deletePlant(plant)} aria-label={`Delete ${plant.name}`} className="rounded-lg border border-stone-200 p-2 text-red-600 hover:border-red-200 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
                  </div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!visiblePlants.length && <p className="py-10 text-center text-sm text-stone-500">No plants match your filters.</p>}
      </div>
    </div>
  );
}
