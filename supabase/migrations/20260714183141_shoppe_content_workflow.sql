-- Ice Cream Shoppe is intentionally split into two concerns:
--   1. Vercel Blob owns the image files.
--   2. Supabase owns only private submission metadata, authentication, and review state.
--
-- No Supabase Storage bucket is created here. `image_urls` contains the Vercel
-- Blob URLs after an authenticated direct upload has completed.

create type public.shoppe_submission_kind as enum ('rating', 'pint');
create type public.shoppe_submission_status as enum (
  'draft',
  'blocked',
  'ready_for_review',
  'approved',
  'published'
);

create table public.shoppe_editors (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.shoppe_locations (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  normalized_name text not null unique,
  address text not null,
  city text,
  region text,
  country_code text not null default 'US' check (char_length(country_code) = 2),
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (latitude is null and longitude is null)
    or (latitude between -90 and 90 and longitude between -180 and 180)
  )
);

create table public.shoppe_submissions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  kind public.shoppe_submission_kind not null,
  status public.shoppe_submission_status not null default 'draft',

  -- Rating fields
  shop_display_name text,
  canonical_location_id uuid references public.shoppe_locations(id),
  flavor_or_item text,
  score numeric(3, 1) check (score between 0 and 10),
  tasted_at date,
  price_amount numeric(8, 2) check (price_amount >= 0),
  price_currency text check (price_currency is null or price_currency ~ '^[A-Z]{3}$'),

  -- Made by Mitch pint fields
  pint_name text,
  base_or_description text,
  mix_ins text[] not null default '{}',

  notes text,
  image_urls jsonb not null default '[]'::jsonb,
  validation_errors text[] not null default '{}',
  content_contract_version text not null default '1.0',
  reviewed_at timestamptz,
  approved_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  check (jsonb_typeof(image_urls) = 'array'),
  check (jsonb_array_length(image_urls) <= 4),
  check (
    (kind = 'rating' and pint_name is null and base_or_description is null)
    or (kind = 'pint' and shop_display_name is null and canonical_location_id is null and score is null and tasted_at is null)
  )
);

create index shoppe_submissions_owner_status_idx
  on public.shoppe_submissions (owner_id, status, created_at desc);

create index shoppe_submissions_location_idx
  on public.shoppe_submissions (canonical_location_id)
  where canonical_location_id is not null;

-- This function isolates the one-editor allowlist from browser-accessible tables.
create function public.is_shoppe_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.shoppe_editors
    where user_id = auth.uid()
  );
$$;

-- Compute validation errors for every write. The client can display these on a
-- draft, while a status transition to review/publish is rejected at the DB.
create function public.validate_shoppe_submission()
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
    if coalesce(btrim(new.shop_display_name), '') = '' then
      errors := array_append(errors, 'Choose the ice cream shop.');
    end if;
    if coalesce(btrim(new.flavor_or_item), '') = '' then
      errors := array_append(errors, 'Add what you ordered.');
    end if;
    if new.score is null then
      errors := array_append(errors, 'Add a score from 0 to 10.');
    end if;
    if new.tasted_at is null then
      errors := array_append(errors, 'Add the tasting date.');
    end if;

    if new.canonical_location_id is null then
      errors := array_append(errors, 'Choose a verified shop address before review.');
    else
      select is_verified into location_is_verified
      from public.shoppe_locations
      where id = new.canonical_location_id;

      if not coalesce(location_is_verified, false) then
        errors := array_append(errors, 'The shop address is waiting for verification.');
      end if;
    end if;
  else
    if coalesce(btrim(new.pint_name), '') = '' then
      errors := array_append(errors, 'Name the pint.');
    end if;
    if coalesce(btrim(new.base_or_description), '') = '' then
      errors := array_append(errors, 'Add the ice cream base or a short description.');
    end if;
  end if;

  new.validation_errors := errors;
  new.updated_at := now();

  if new.status in ('ready_for_review', 'approved', 'published') and cardinality(errors) > 0 then
    raise exception using
      errcode = 'check_violation',
      message = 'Shoppe submission is blocked: ' || array_to_string(errors, ' ');
  end if;

  if new.status = 'published' and (tg_op = 'INSERT' or old.status <> 'approved' or new.approved_at is null) then
    raise exception using
      errcode = 'check_violation',
      message = 'A submission can publish only after it has been approved.';
  end if;

  return new;
end;
$$;

create trigger validate_shoppe_submission_before_write
before insert or update on public.shoppe_submissions
for each row execute function public.validate_shoppe_submission();

alter table public.shoppe_editors enable row level security;
alter table public.shoppe_locations enable row level security;
alter table public.shoppe_submissions enable row level security;

-- Editors can only see their own private queue. The owner allowlist must be
-- populated once from the Supabase dashboard after the first magic-link login.
create policy "Shoppe editors can view their own editor record"
on public.shoppe_editors for select to authenticated
using (user_id = auth.uid());

create policy "Shoppe editors can read verified locations"
on public.shoppe_locations for select to authenticated
using ((select public.is_shoppe_editor()) and is_verified);

create policy "Shoppe editors can read their submissions"
on public.shoppe_submissions for select to authenticated
using ((select public.is_shoppe_editor()) and owner_id = auth.uid());

create policy "Shoppe editors can create their submissions"
on public.shoppe_submissions for insert to authenticated
with check ((select public.is_shoppe_editor()) and owner_id = auth.uid());

create policy "Shoppe editors can update their submissions"
on public.shoppe_submissions for update to authenticated
using ((select public.is_shoppe_editor()) and owner_id = auth.uid())
with check ((select public.is_shoppe_editor()) and owner_id = auth.uid());
