import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, MapPin, Sprout } from "lucide-react";
import {
  getPublicFeaturedPlants,
  getPublicSiteSettings,
} from "@/lib/supabase/data";

export default async function HomePage() {
  const [featuredPlants, siteSettings] = await Promise.all([
    getPublicFeaturedPlants(),
    getPublicSiteSettings(),
  ]);

  return (
    <main className="min-h-screen">
      <header className="border-b border-stone-200/80 bg-[#FAFAF7]">
        <div className="container-shell flex items-center justify-between py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2F5D3A] text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-stone-900">{siteSettings.farm_name}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Field-grown living things</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-stone-700 md:flex">
            <Link href="/plants" className="transition hover:text-stone-900">Plants</Link>
            <Link href="/#about" className="transition hover:text-stone-900">About</Link>
            <Link href="/#contact" className="transition hover:text-stone-900">Contact</Link>
          </nav>

          <Link
            href="/plants"
            className="inline-flex items-center gap-2 rounded-full bg-[#2F5D3A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#24462f]"
          >
            Explore Plants
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(47,93,58,0.12),_transparent_50%)]" />
        <div className="container-shell grid items-center gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#2F5D3A]/20 bg-[#edf3ed] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[#2F5D3A]">
              <Sprout className="h-3.5 w-3.5" />
              Seasonal harvest
            </div>
            <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.06em] text-stone-900 sm:text-5xl lg:text-6xl">
              {siteSettings.tagline}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-stone-600">
              Thoughtfully grown plants for gardens, tables, and everyday rituals—crafted with care, resilience, and a deep respect for the soil.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/plants"
                className="inline-flex items-center gap-2 rounded-full bg-[#2F5D3A] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#24462f]"
              >
                Explore Plants
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/#about" className="inline-flex items-center rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-900 transition hover:border-stone-400">
                Learn about the farm
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-white p-3 shadow-[0_30px_80px_rgba(30,52,36,0.08)]">
              <div className="relative h-[500px] overflow-hidden rounded-[22px]">
                <Image
                  src={siteSettings.hero_image}
                  alt="Farm field with healthy plants"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">Featured</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-stone-900">Farm favorites</h2>
          </div>
          <Link href="/plants" className="hidden text-sm font-medium text-[#2F5D3A] hover:underline sm:inline-flex">
            View all plants
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredPlants.map((plant) => {
            const cover = plant.images.find((image) => image.is_cover) ?? plant.images[0];

            return (
              <article key={plant.id} className="group overflow-hidden rounded-[20px] border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <Link href={`/plants/${plant.slug}`} className="block">
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={cover?.url || "/placeholder.svg"}
                      alt={cover?.alt_text || plant.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[#edf3ed] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#2F5D3A]">
                        {plant.category_name}
                      </span>
                      <span className="text-xs text-stone-500">{plant.growing_season}</span>
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight text-stone-900">{plant.name}</h3>
                    <p className="line-clamp-3 text-sm leading-6 text-stone-600">{plant.short_description}</p>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section id="about" className="border-y border-stone-200 bg-[#f2f4ee]">
        <div className="container-shell grid gap-10 py-20 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="relative h-[420px] overflow-hidden rounded-[24px]">
            <Image
              src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80"
              alt="Fresh farm field"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">About the farm</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-stone-900">Growing for flavor, health, and seasonality.</h2>
            <p className="mt-5 text-base leading-8 text-stone-700">{siteSettings.about_text}</p>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-stone-700">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#2F5D3A]" /> {siteSettings.contact_address}</span>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="container-shell py-12">
        <div className="flex flex-col gap-8 border-t border-stone-200 pt-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xl font-semibold tracking-tight text-stone-900">{siteSettings.farm_name}</p>
            <p className="mt-2 text-sm text-stone-600">{siteSettings.tagline}</p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-stone-600 md:items-end">
            <a href={`mailto:${siteSettings.contact_email}`} className="hover:text-stone-900">{siteSettings.contact_email}</a>
            <a href={`tel:${siteSettings.contact_phone}`} className="hover:text-stone-900">{siteSettings.contact_phone}</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
