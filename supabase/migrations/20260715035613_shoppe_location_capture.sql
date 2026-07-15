-- A confirmed lookup is the only way the private Counter may create a new
-- canonical storefront. It keeps ratings from inheriting the photo GPS pin.
alter table public.shoppe_locations
  add column created_by uuid references auth.users(id) on delete set null;

create policy "Shoppe editors can add confirmed storefronts"
on public.shoppe_locations for insert to authenticated
with check (
  (select public.is_shoppe_editor())
  and created_by = auth.uid()
  and is_verified = true
  and btrim(display_name) <> ''
  and btrim(address) <> ''
  and latitude between -90 and 90
  and longitude between -180 and 180
);

grant insert on public.shoppe_locations to authenticated;
