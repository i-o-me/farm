create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile" on public.profiles
for select using (auth.uid() = id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  scientific_name text,
  slug text not null unique,
  category_id uuid not null references public.categories(id) on delete restrict,
  short_description text not null,
  description text not null,
  growing_season text,
  growth_duration text,
  sunlight text,
  watering text,
  soil_type text,
  care_tips text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plant_images (
  id uuid primary key default uuid_generate_v4(),
  plant_id uuid not null references public.plants(id) on delete cascade,
  url text not null,
  storage_path text,
  alt_text text,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default '4d0a4a7f-f7d6-4127-b7a2-6beef0a9c55c'::uuid,
  farm_name text not null default 'Clover & Root Farm',
  tagline text not null default 'Seasonal abundance from soil to table.',
  about_text text not null default 'We grow vibrant plants with care and regenerative soil practices.',
  hero_image text,
  contact_email text,
  contact_phone text,
  contact_address text,
  instagram_url text,
  facebook_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.plants enable row level security;
alter table public.plant_images enable row level security;
alter table public.categories enable row level security;
alter table public.site_settings enable row level security;

create policy "Public can read published plants" on public.plants
for select using (status = 'published');

create policy "Public can read published published images" on public.plant_images
for select using (
  exists (
    select 1 from public.plants p
    where p.id = plant_id and p.status = 'published'
  )
);

create policy "Public can read categories" on public.categories
for select using (true);

create policy "Public can read site settings" on public.site_settings
for select using (true);

create policy "Admins can modify plants" on public.plants
for all using (public.is_admin())
with check (public.is_admin());

create policy "Admins can modify plant images" on public.plant_images
for all using (public.is_admin())
with check (public.is_admin());

create policy "Admins can modify categories" on public.categories
for all using (public.is_admin())
with check (public.is_admin());

create policy "Admins can modify site settings" on public.site_settings
for all using (public.is_admin())
with check (public.is_admin());

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_before_update
before update on public.plants
for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_before_update_categories
before update on public.categories
for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_before_update_site_settings
before update on public.site_settings
for each row execute procedure public.handle_updated_at();
