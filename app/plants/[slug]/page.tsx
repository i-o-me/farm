import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, Droplets, SunMedium, Trees } from "lucide-react";
import { getPublicPlantBySlug } from "@/lib/supabase/data";
import { getRelatedPlants, getCategoryBySlug } from "@/lib/data";

export default async function PlantDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plant = await getPublicPlantBySlug(slug);

  if (!plant) {
    notFound();
  }

  const relatedPlants = getRelatedPlants(plant);
  const category = getCategoryBySlug(plant.category_id) || { name: plant.category_name, slug: plant.category_id };

  return (
    <main className="container-shell py-16">
      <Link href="/plants" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900">
        <ArrowLeft className="h-4 w-4" />
        Back to all plants
      </Link>

      <article>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="relative h-[540px] overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-sm">
              <Image
                src={plant.images[0]?.url || "/placeholder.svg"}
                alt={plant.images[0]?.alt_text || plant.name}
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {plant.images.slice(1).map((image) => (
                <div key={image.id} className="relative h-36 overflow-hidden rounded-[18px] border border-stone-200 bg-white">
                  <Image src={image.url} alt={image.alt_text} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#2F5D3A]">{category.name}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-stone-900">{plant.name}</h1>
            <p className="mt-2 text-lg italic text-stone-500">{plant.scientific_name}</p>

            <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-base leading-7 text-stone-700">{plant.short_description}</p>
            </div>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500"><SunMedium className="h-4 w-4 text-[#2F5D3A]" /> Sunlight</dt>
                <dd className="mt-2 text-base font-medium text-stone-900">{plant.sunlight}</dd>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500"><Droplets className="h-4 w-4 text-[#2F5D3A]" /> Watering</dt>
                <dd className="mt-2 text-base font-medium text-stone-900">{plant.watering}</dd>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500"><Clock3 className="h-4 w-4 text-[#2F5D3A]" /> Growth</dt>
                <dd className="mt-2 text-base font-medium text-stone-900">{plant.growth_duration}</dd>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500"><Trees className="h-4 w-4 text-[#2F5D3A]" /> Soil</dt>
                <dd className="mt-2 text-base font-medium text-stone-900">{plant.soil_type}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900">Description</h2>
            <p className="mt-4 text-base leading-8 text-stone-700">{plant.description}</p>

            <h2 className="mt-10 text-2xl font-semibold tracking-tight text-stone-900">Growing tips</h2>
            <p className="mt-4 text-base leading-8 text-stone-700">{plant.care_tips}</p>
          </div>

          <div className="rounded-[24px] border border-stone-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-stone-900">Plant details</h3>
            <ul className="mt-5 space-y-4 text-sm text-stone-700">
              <li className="flex justify-between gap-4 border-b border-stone-200 pb-3"><span>Growing season</span><span className="font-medium text-stone-900">{plant.growing_season}</span></li>
              <li className="flex justify-between gap-4 border-b border-stone-200 pb-3"><span>Category</span><span className="font-medium text-stone-900">{category.name}</span></li>
              <li className="flex justify-between gap-4 border-b border-stone-200 pb-3"><span>Sunlight</span><span className="font-medium text-stone-900">{plant.sunlight}</span></li>
              <li className="flex justify-between gap-4"><span>Watering</span><span className="font-medium text-stone-900">{plant.watering}</span></li>
            </ul>
          </div>
        </div>

        {relatedPlants.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-stone-900">Related plants</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {relatedPlants.map((related) => (
                <Link key={related.id} href={`/plants/${related.slug}`} className="overflow-hidden rounded-[20px] border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="relative h-60">
                    <Image src={related.images[0]?.url || "/placeholder.svg"} alt={related.images[0]?.alt_text || related.name} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#2F5D3A]">{related.category_name}</p>
                    <h3 className="mt-2 text-xl font-semibold text-stone-900">{related.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
