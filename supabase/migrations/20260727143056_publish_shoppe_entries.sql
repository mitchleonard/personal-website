-- A publication is intentionally a narrow, read-only copy of an approved
-- private submission. The public site never queries the editor queue itself.
create table public.shoppe_publications (
  submission_id uuid primary key references public.shoppe_submissions(id) on delete cascade,
  kind public.shoppe_submission_kind not null,
  shop_display_name text,
  flavor_or_item text,
  score numeric(3, 1),
  tasted_at date,
  price_amount numeric(8, 2),
  price_currency text,
  pint_name text,
  made_at date,
  description text,
  notes text,
  image_urls jsonb not null default '[]'::jsonb,
  location_label text,
  location_address text,
  location_city text,
  location_region text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  published_at timestamptz not null,
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(image_urls) = 'array')
);

create index shoppe_publications_published_at_idx
  on public.shoppe_publications (published_at desc);

alter table public.shoppe_publications enable row level security;

create policy "Anyone can read published Shoppe entries"
on public.shoppe_publications for select to anon, authenticated
using (true);

grant usage on schema public to anon, authenticated;
grant select on public.shoppe_publications to anon, authenticated;

-- Publishing is an explicit editor action from the review screen. A complete
-- draft may move straight to published in that one action, but it must carry
-- both the approval and publication timestamps. This preserves the audit trail
-- without requiring a phone user to perform a CSV handoff.
create or replace function public.validate_shoppe_submission()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  errors text[] := '{}';
  location_is_verified boolean := false;
begin
  if jsonb_array_length(new.image_urls) < 1 then
    errors := array_append(errors, 'Add at least one uploaded Vercel Blob image.');
  end if;

  if new.kind = 'rating' then
    if coalesce(btrim(new.shop_display_name), '') = '' then errors := array_append(errors, 'Choose the ice cream shop.'); end if;
    if coalesce(btrim(new.flavor_or_item), '') = '' then errors := array_append(errors, 'Add what you ordered.'); end if;
    if new.score is null then errors := array_append(errors, 'Add a score from 0 to 10.'); end if;
    if new.tasted_at is null then errors := array_append(errors, 'Add the tasting date.'); end if;
    if new.canonical_location_id is null then
      errors := array_append(errors, 'Choose a verified shop address before review.');
    else
      select is_verified into location_is_verified from public.shoppe_locations where id = new.canonical_location_id;
      if not coalesce(location_is_verified, false) then errors := array_append(errors, 'The shop address is waiting for verification.'); end if;
    end if;
  else
    if coalesce(btrim(new.pint_name), '') = '' then errors := array_append(errors, 'Name the pint.'); end if;
    if new.made_at is null then errors := array_append(errors, 'Add the date the pint was made.'); end if;
    if coalesce(btrim(new.base_or_description), '') = '' then errors := array_append(errors, 'Add the ice cream base or a short description.'); end if;
  end if;

  new.validation_errors := errors;
  new.updated_at := now();

  if new.status in ('ready_for_review', 'approved', 'published') and cardinality(errors) > 0 then
    raise exception using errcode = 'check_violation', message = 'Shoppe submission is blocked: ' || array_to_string(errors, ' ');
  end if;

  if new.status = 'published' and (
    tg_op = 'INSERT'
    or new.reviewed_at is null
    or new.approved_at is null
    or new.published_at is null
  ) then
    raise exception using errcode = 'check_violation', message = 'A submission can publish only from an explicit approved review.';
  end if;
  return new;
end;
$$;

create or replace function public.sync_shoppe_publication()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  storefront public.shoppe_locations%rowtype;
begin
  if new.status <> 'published' then
    return new;
  end if;

  if new.canonical_location_id is not null then
    select * into storefront
    from public.shoppe_locations
    where id = new.canonical_location_id;
  end if;

  insert into public.shoppe_publications (
    submission_id, kind, shop_display_name, flavor_or_item, score, tasted_at,
    price_amount, price_currency, pint_name, made_at, description, notes,
    image_urls, location_label, location_address, location_city, location_region,
    latitude, longitude, published_at, updated_at
  ) values (
    new.id, new.kind, new.shop_display_name, new.flavor_or_item, new.score, new.tasted_at,
    new.price_amount, new.price_currency, new.pint_name, new.made_at, new.base_or_description, new.notes,
    new.image_urls, storefront.display_name, storefront.address, storefront.city, storefront.region,
    storefront.latitude, storefront.longitude, new.published_at, now()
  ) on conflict (submission_id) do update set
    kind = excluded.kind,
    shop_display_name = excluded.shop_display_name,
    flavor_or_item = excluded.flavor_or_item,
    score = excluded.score,
    tasted_at = excluded.tasted_at,
    price_amount = excluded.price_amount,
    price_currency = excluded.price_currency,
    pint_name = excluded.pint_name,
    made_at = excluded.made_at,
    description = excluded.description,
    notes = excluded.notes,
    image_urls = excluded.image_urls,
    location_label = excluded.location_label,
    location_address = excluded.location_address,
    location_city = excluded.location_city,
    location_region = excluded.location_region,
    latitude = excluded.latitude,
    longitude = excluded.longitude,
    published_at = excluded.published_at,
    updated_at = now();

  return new;
end;
$$;

revoke all on function public.sync_shoppe_publication() from public, anon, authenticated;

create trigger sync_shoppe_publication_after_write
after insert or update on public.shoppe_submissions
for each row execute function public.sync_shoppe_publication();

-- Keep any already-published submissions visible when this migration is added.
insert into public.shoppe_publications (
  submission_id, kind, shop_display_name, flavor_or_item, score, tasted_at,
  price_amount, price_currency, pint_name, made_at, description, notes,
  image_urls, location_label, location_address, location_city, location_region,
  latitude, longitude, published_at
)
select
  submission.id, submission.kind, submission.shop_display_name, submission.flavor_or_item, submission.score, submission.tasted_at,
  submission.price_amount, submission.price_currency, submission.pint_name, submission.made_at, submission.base_or_description, submission.notes,
  submission.image_urls, storefront.display_name, storefront.address, storefront.city, storefront.region,
  storefront.latitude, storefront.longitude, coalesce(submission.published_at, submission.updated_at)
from public.shoppe_submissions as submission
left join public.shoppe_locations as storefront on storefront.id = submission.canonical_location_id
where submission.status = 'published'
on conflict (submission_id) do nothing;
