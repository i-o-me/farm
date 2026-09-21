"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ImagePlus, LoaderCircle, Star, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/data";
import type { Category, Plant, PlantImage, PlantStatus } from "@/lib/types";

type PlantFormProps = { initialPlant?: Plant };
type FormState = Omit<Plant, "id" | "category_name" | "created_at" | "updated_at" | "images">;

const emptyForm: FormState = {
  name: "", scientific_name: "", slug: "", category_id: "", short_description: "", description: "",
  growing_season: "", growth_duration: "", sunlight: "", watering: "", soil_type: "", care_tips: "",
  status: "draft", is_featured: false,
};

export default function PlantForm({ initialPlant }: PlantFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialPlant ? {
    name: initialPlant.name,
    scientific_name: initialPlant.scientific_name,
    slug: initialPlant.slug,
    category_id: initialPlant.category_id,
    short_description: initialPlant.short_description,
    description: initialPlant.description,
    growing_season: initialPlant.growing_season,
    growth_duration: initialPlant.growth_duration,
    sunlight: initialPlant.sunlight,
    watering: initialPlant.watering,
    soil_type: initialPlant.soil_type,
    care_tips: initialPlant.care_tips,
    status: initialPlant.status,
    is_featured: initialPlant.is_featured,
  } : emptyForm);
  const [images, setImages] = useState<PlantImage[]>(initialPlant?.images || []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = createSupabaseClient();
    if (!supabase) return;
    supabase.from("categories").select("id, name, slug").order("name").then(({ data }) => {
      if (data) setCategories(data as Category[]);
    });
  }, []);

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleNameChange(value: string) {
    setForm((current) => ({ ...current, name: value, slug: initialPlant ? current.slug : slugify(value) }));
  }

  function addFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    const valid = selected.filter((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= 5 * 1024 * 1024);
    if (valid.length !== selected.length) setError("Images must be JPG, PNG, or WebP files no larger than 5 MB.");
    setFiles((current) => [...current, ...valid]);
    event.target.value = "";
  }

  async function savePlant(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!form.name.trim() || !form.slug.trim() || !form.category_id || !form.short_description.trim() || !form.description.trim()) {
      setError("Name, slug, category, short description, and full description are required.");
      return;
    }

    const supabase = createSupabaseClient();
    if (!supabase) {
      setError("Supabase is not configured. Add credentials to .env.local.");
      return;
    }

    setIsSaving(true);
    const payload = { ...form, name: form.name.trim(), slug: form.slug.trim(), short_description: form.short_description.trim(), description: form.description.trim() };
    let plantId = initialPlant?.id;

    if (plantId) {
      const { error: updateError } = await supabase.from("plants").update(payload).eq("id", plantId);
      if (updateError) { setError(updateError.message); setIsSaving(false); return; }
    } else {
      const { data, error: insertError } = await supabase.from("plants").insert(payload).select("id").single();
      if (insertError || !data) { setError(insertError?.message || "Could not create plant."); setIsSaving(false); return; }
      plantId = data.id;
    }

    const uploaded: PlantImage[] = [];
    for (const file of files) {
      const storagePath = `${plantId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const { error: uploadError } = await supabase.storage.from("plant-images").upload(storagePath, file, { cacheControl: "3600", upsert: false, contentType: file.type });
      if (uploadError) { setError(`Plant saved, but image upload failed: ${uploadError.message}`); setIsSaving(false); return; }
      const { data } = supabase.storage.from("plant-images").getPublicUrl(storagePath);
      uploaded.push({ id: crypto.randomUUID(), url: data.publicUrl, storage_path: storagePath, alt_text: form.name, is_cover: images.length === 0 && uploaded.length === 0, sort_order: images.length + uploaded.length + 1 });
    }

    if (uploaded.length) {
      const { error: imageError } = await supabase.from("plant_images").insert(uploaded.map(({ id, ...image }) => ({ id, plant_id: plantId, ...image })));
      if (imageError) { setError(`Plant saved, but image records failed: ${imageError.message}`); setIsSaving(false); return; }
    }

    setMessage(initialPlant ? "Plant updated." : "Plant created.");
    setIsSaving(false);
    setFiles([]);
    router.push("/admin/plants");
    router.refresh();
  }

  async function removeImage(image: PlantImage) {
    if (!initialPlant) return;
    const supabase = createSupabaseClient();
    if (!supabase) return;
    if (image.storage_path) await supabase.storage.from("plant-images").remove([image.storage_path]);
    const { error: deleteError } = await supabase.from("plant_images").delete().eq("id", image.id);
    if (deleteError) setError(deleteError.message);
    else setImages((current) => current.filter((item) => item.id !== image.id));
  }

  async function makeCover(image: PlantImage) {
    if (!initialPlant) return;
    const supabase = createSupabaseClient();
    if (!supabase) return;
    const { error: resetError } = await supabase.from("plant_images").update({ is_cover: false }).eq("plant_id", initialPlant.id);
    if (resetError) { setError(resetError.message); return; }
    const { error: coverError } = await supabase.from("plant_images").update({ is_cover: true }).eq("id", image.id);
    if (coverError) setError(coverError.message);
    else setImages((current) => current.map((item) => ({ ...item, is_cover: item.id === image.id })));
  }

  return (
    <form onSubmit={savePlant} className="grid gap-6 rounded-[22px] border border-stone-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Common name" required value={form.name} onChange={handleNameChange} />
        <Field label="Scientific name" value={form.scientific_name} onChange={(value) => updateField("scientific_name", value)} />
        <Field label="Slug" required value={form.slug} onChange={(value) => updateField("slug", slugify(value))} />
        <label className="block text-sm font-medium text-stone-700">Category <span className="text-red-600">*</span>
          <select required value={form.category_id} onChange={(event) => updateField("category_id", event.target.value)} className="mt-2 w-full rounded-xl border border-stone-200 bg-[#fafaf7] px-3 py-2.5 font-normal outline-none focus:border-[#2F5D3A]"><option value="">Select category</option>{categories.map((category, index) => <option key={`${category.slug}-${index}`} value={category.id}>{category.name}</option>)}</select>
        </label>
      </div>

      <TextArea label="Short description" required rows={3} value={form.short_description} onChange={(value) => updateField("short_description", value)} />
      <TextArea label="Full description" required rows={6} value={form.description} onChange={(value) => updateField("description", value)} />
      <TextArea label="Care and growing tips" rows={4} value={form.care_tips} onChange={(value) => updateField("care_tips", value)} />

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Growing season" value={form.growing_season} onChange={(value) => updateField("growing_season", value)} />
        <Field label="Growth duration" value={form.growth_duration} onChange={(value) => updateField("growth_duration", value)} />
        <Field label="Sunlight" value={form.sunlight} onChange={(value) => updateField("sunlight", value)} />
        <Field label="Watering" value={form.watering} onChange={(value) => updateField("watering", value)} />
        <Field label="Soil type" value={form.soil_type} onChange={(value) => updateField("soil_type", value)} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">Images</label>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-[#fafaf7] px-6 py-8 text-center transition hover:border-[#2F5D3A]"><ImagePlus className="mb-2 h-6 w-6 text-[#2F5D3A]" /><span className="text-sm font-medium text-stone-800">Choose photos</span><span className="mt-1 text-xs text-stone-500">JPG, PNG, or WebP, max 5 MB each</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addFiles} className="sr-only" /></label>
        {(images.length > 0 || files.length > 0) && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((image) => <div key={image.id} className="relative overflow-hidden rounded-xl border border-stone-200"><div className="relative h-32"><Image src={image.url} alt={image.alt_text || form.name} fill className="object-cover" /></div><div className="flex items-center justify-between bg-white p-2"><button type="button" onClick={() => makeCover(image)} className={`text-xs ${image.is_cover ? "font-semibold text-[#2F5D3A]" : "text-stone-500"}`}><Star className={`mr-1 inline h-3 w-3 ${image.is_cover ? "fill-[#2F5D3A]" : ""}`} />{image.is_cover ? "Cover" : "Make cover"}</button><button type="button" onClick={() => removeImage(image)} aria-label="Remove image" className="text-red-600"><Trash2 className="h-4 w-4" /></button></div></div>)}
          {files.map((file) => <div key={`${file.name}-${file.lastModified}`} className="relative overflow-hidden rounded-xl border border-dashed border-stone-300 bg-stone-50 p-3 text-xs text-stone-600"><p className="truncate">{file.name}</p><p className="mt-1">Ready to upload</p><button type="button" onClick={() => setFiles((current) => current.filter((item) => item !== file))} className="absolute right-2 top-2 text-stone-500"><X className="h-4 w-4" /></button></div>)}
        </div>}
      </div>

      <div className="flex flex-wrap items-center gap-5 border-t border-stone-200 pt-5">
        <label className="text-sm font-medium text-stone-700">Status <select value={form.status} onChange={(event) => updateField("status", event.target.value as PlantStatus)} className="ml-2 rounded-lg border border-stone-200 bg-white px-2 py-1.5 outline-none"><option value="draft">Draft</option><option value="published">Published</option></select></label>
        <label className="inline-flex items-center gap-2 text-sm font-medium text-stone-700"><input type="checkbox" checked={form.is_featured} onChange={(event) => updateField("is_featured", event.target.checked)} className="h-4 w-4 accent-[#2F5D3A]" /> Featured plant</label>
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="rounded-xl bg-[#edf3ed] px-3 py-2 text-sm text-[#2F5D3A]">{message}</p>}
      <div className="flex gap-3"><button type="button" onClick={() => router.back()} className="rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700">Cancel</button><button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-full bg-[#2F5D3A] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60">{isSaving && <LoaderCircle className="h-4 w-4 animate-spin" />}{isSaving ? "Saving..." : initialPlant ? "Save changes" : "Create plant"}</button></div>
    </form>
  );
}

function Field({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="block text-sm font-medium text-stone-700">{label} {required && <span className="text-red-600">*</span>}<input required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-stone-200 bg-[#fafaf7] px-3 py-2.5 font-normal outline-none focus:border-[#2F5D3A]" /></label>;
}

function TextArea({ label, value, onChange, rows, required = false }: { label: string; value: string; onChange: (value: string) => void; rows: number; required?: boolean }) {
  return <label className="block text-sm font-medium text-stone-700">{label} {required && <span className="text-red-600">*</span>}<textarea required={required} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-stone-200 bg-[#fafaf7] px-3 py-2.5 font-normal outline-none focus:border-[#2F5D3A]" /></label>;
}
