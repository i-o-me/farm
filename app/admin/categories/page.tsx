"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";
import { slugify } from "@/lib/data";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    createSupabaseClient()?.from("categories").select("id, name, slug").order("name").then(({ data }) => {
      if (data) setCategories(data as Category[]);
    });
  }, []);

  async function addCategory(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const supabase = createSupabaseClient();
    if (!supabase) return;
    const { data, error: insertError } = await supabase.from("categories").insert({ name: trimmed, slug: slugify(trimmed) }).select("id, name, slug").single();
    if (insertError) setError(insertError.message);
    else if (data) { setCategories((current) => [...current, data as Category].sort((a, b) => a.name.localeCompare(b.name))); setName(""); }
  }

  async function renameCategory(category: Category) {
    const nextName = window.prompt("New category name", category.name)?.trim();
    if (!nextName || nextName === category.name) return;
    const supabase = createSupabaseClient();
    if (!supabase) return;
    const { error: updateError } = await supabase.from("categories").update({ name: nextName, slug: slugify(nextName) }).eq("id", category.id);
    if (updateError) setError(updateError.message);
    else setCategories((current) => current.map((item) => item.id === category.id ? { ...item, name: nextName, slug: slugify(nextName) } : item));
  }

  async function deleteCategory(category: Category) {
    if (!window.confirm(`Delete ${category.name}? It must not contain plants.`)) return;
    const supabase = createSupabaseClient();
    if (!supabase) return;
    const { error: deleteError } = await supabase.from("categories").delete().eq("id", category.id);
    if (deleteError) setError(deleteError.message);
    else setCategories((current) => current.filter((item) => item.id !== category.id));
  }

  return (
    <main className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">Categories</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-stone-900">Manage categories</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <form className="rounded-[22px] border border-stone-200 bg-white p-5 shadow-sm">
          <label className="mb-2 block text-sm font-medium text-stone-700">Category name</label>
          <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-stone-200 bg-[#fafaf7] px-3 py-2.5 outline-none focus:border-[#2F5D3A]" placeholder="e.g. Medicinal" />
          <button type="submit" className="mt-4 inline-flex rounded-full bg-[#2F5D3A] px-4 py-2.5 text-sm font-medium text-white">Add category</button>
        </form>

        <div className="rounded-[22px] border border-stone-200 bg-white p-5 shadow-sm">
          {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="space-y-3">
            {categories.map((category, index) => (
              <div key={`${category.slug}-${index}`} className="flex items-center justify-between rounded-2xl border border-stone-200 p-3">
                <span className="font-medium text-stone-800">{category.name}</span>
                <div className="flex gap-2 text-sm">
                  <button type="button" onClick={() => renameCategory(category)} className="rounded-lg border border-stone-200 px-2 py-1.5 text-stone-700">Rename</button>
                  <button type="button" onClick={() => deleteCategory(category)} className="rounded-lg border border-red-200 px-2 py-1.5 text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
