"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Category, Plant } from "@/lib/types";

type PlantsBrowserProps = {
  plants: Plant[];
  categories: Category[];
};

export default function PlantsBrowser({ plants, categories }: PlantsBrowserProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredPlants = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return plants.filter((plant) => {
      const selectedCategory = categories.find((category) => category.id === activeCategory);
      const matchesCategory = !selectedCategory || plant.category_id === selectedCategory.id || plant.category_name.toLowerCase() === selectedCategory.name.toLowerCase();
      const matchesSearch = !normalizedSearch || [plant.name, plant.scientific_name, plant.short_description]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, plants, search]);

  return (
    <>
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">Gallery</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-stone-900">Plants for every season</h1>
        </div>

        <label className="flex w-full max-w-md items-center gap-3 rounded-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-500 shadow-sm md:w-auto">
          <Search className="h-4 w-4 shrink-0 text-stone-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search plants"
            className="w-full bg-transparent text-stone-900 outline-none placeholder:text-stone-400"
            placeholder="Search by plant name"
          />
          {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="text-stone-400 hover:text-stone-700"><X className="h-4 w-4" /></button>}
        </label>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <button type="button" onClick={() => setActiveCategory(null)} className={`rounded-full border px-3 py-2 text-sm font-medium transition ${!activeCategory ? "border-[#2F5D3A] bg-[#edf3ed] text-[#2F5D3A]" : "border-stone-200 bg-white text-stone-700 hover:border-[#2F5D3A] hover:text-[#2F5D3A]"}`}>All plants</button>
        {categories.map((category, index) => (
          <button key={`${category.slug}-${index}`} type="button" onClick={() => setActiveCategory(category.id)} className={`rounded-full border px-3 py-2 text-sm font-medium transition ${activeCategory === category.id ? "border-[#2F5D3A] bg-[#edf3ed] text-[#2F5D3A]" : "border-stone-200 bg-white text-stone-700 hover:border-[#2F5D3A] hover:text-[#2F5D3A]"}`}>
            {category.name}
          </button>
        ))}
      </div>

      {filteredPlants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-600">
          No plants match your search.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPlants.map((plant) => {
            const cover = plant.images.find((image) => image.is_cover) ?? plant.images[0];
            return (
              <article key={plant.id} className="overflow-hidden rounded-[20px] border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <Link href={`/plants/${plant.slug}`} className="block">
                  <div className="relative h-80 overflow-hidden">
                    <Image src={cover?.url || "/placeholder.svg"} alt={cover?.alt_text || plant.name} fill className="object-cover transition duration-300 hover:scale-105" />
                  </div>
                  <div className="space-y-3 p-5">
                    <span className="rounded-full bg-[#edf3ed] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#2F5D3A]">{plant.category_name}</span>
                    <h2 className="text-2xl font-semibold tracking-tight text-stone-900">{plant.name}</h2>
                    <p className="text-sm leading-6 text-stone-600">{plant.short_description}</p>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
