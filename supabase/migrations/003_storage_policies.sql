insert into storage.buckets (id, name, public)
values ('plant-images', 'plant-images', true)
on conflict (id) do update set public = true;

create policy "Public can view plant images"
on storage.objects for select
using (bucket_id = 'plant-images');

create policy "Admins can upload plant images"
on storage.objects for insert
with check (bucket_id = 'plant-images' and public.is_admin());

create policy "Admins can update plant images"
on storage.objects for update
using (bucket_id = 'plant-images' and public.is_admin())
with check (bucket_id = 'plant-images' and public.is_admin());

create policy "Admins can delete plant images"
on storage.objects for delete
using (bucket_id = 'plant-images' and public.is_admin());
