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
  -- Reuse the canonical storefront identifier from the validated map dataset.
  -- It is readable in review tools and can distinguish branches of one brand.
  id text primary key,
  display_name text not null,
  normalized_name text not null,
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
  canonical_location_id text references public.shoppe_locations(id),
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
-- It intentionally runs as the requesting user; the editor-table RLS policy is
-- enough to answer whether that user owns a matching row.
create function public.is_shoppe_editor()
returns boolean
language sql
stable
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

-- Explicit grants are required when the Data API does not auto-expose newly
-- created tables. RLS above still determines every accessible row.
grant usage on schema public to authenticated;
grant select on public.shoppe_editors to authenticated;
grant select on public.shoppe_locations to authenticated;
grant select, insert, update on public.shoppe_submissions to authenticated;
revoke execute on function public.is_shoppe_editor() from public;
grant execute on function public.is_shoppe_editor() to authenticated;


-- Seed the verified storefronts used by the live map. These are address-based
-- research records, not image GPS coordinates.
insert into public.shoppe_locations (
  id, display_name, normalized_name, address, latitude, longitude, country_code, is_verified
) values
  ('‘Nita Mae’s Scoop|101 Judd St, Marine on St. Croix, MN 55047', '‘Nita Mae’s Scoop', 'nita-mae-s-scoop', '101 Judd St, Marine on St. Croix, MN 55047', 45.19860013368, -92.769613505608, 'US', true),
  ('4 Queens Dairy Cream|1310 W 1st St, Cedar Falls, IA 50613', '4 Queens Dairy Cream', '4-queens-dairy-cream', '1310 W 1st St, Cedar Falls, IA 50613', 42.537788405112, -92.460892846993, 'US', true),
  ('A to Z Creamery — Hopkins|703 Mainstreet, Hopkins, MN 55343', 'A to Z Creamery — Hopkins', 'a-to-z-creamery-hopkins', '703 Mainstreet, Hopkins, MN 55343', 44.924466602149, -93.408919429464, 'US', true),
  ('A to Z Creamery — Minnesota State Fair|1297 Underwood St, Falcon Heights, MN 55108', 'A to Z Creamery — Minnesota State Fair', 'a-to-z-creamery-minnesota-state-fair', '1297 Underwood St, Falcon Heights, MN 55108', 44.9828877, -93.1704962, 'US', true),
  ('Adele’s Frozen Custard|800 Excelsior Blvd, Excelsior, MN 55331', 'Adele’s Frozen Custard', 'adele-s-frozen-custard', '800 Excelsior Blvd, Excelsior, MN 55331', 44.9027302, -93.5535009, 'US', true),
  ('Aldo’s Gelato — La Isla I|Blvd. Kukulcan km 12.5, Zona Hotelera, Cancún, Quintana Roo, Mexico', 'Aldo’s Gelato — La Isla I', 'aldo-s-gelato-la-isla-i', 'Blvd. Kukulcan km 12.5, Zona Hotelera, Cancún, Quintana Roo, Mexico', 21.1134, -86.764, 'MX', true),
  ('American Old-Fashioned Ice Cream Parlor|102 N Main St, Galena, IL 61036', 'American Old-Fashioned Ice Cream Parlor', 'american-old-fashioned-ice-cream-parlor', '102 N Main St, Galena, IL 61036', 42.416312057576, -90.428382159715, 'US', true),
  ('Amy’s Ice Creams — South Congress|1301 S Congress Ave, Austin, TX 78704', 'Amy’s Ice Creams — South Congress', 'amy-s-ice-creams-south-congress', '1301 S Congress Ave, Austin, TX 78704', 30.251046944395, -97.749061494884, 'US', true),
  ('Andy’s Frozen Custard|4844 S Yale Ave, Tulsa, OK 74135', 'Andy’s Frozen Custard', 'andy-s-frozen-custard', '4844 S Yale Ave, Tulsa, OK 74135', 36.093751226219, -95.922328813635, 'US', true),
  ('Armadillo’s Ice Cream Shoppe|130 Main St, Rapid City, SD 57701', 'Armadillo’s Ice Cream Shoppe', 'armadillo-s-ice-cream-shoppe', '130 Main St, Rapid City, SD 57701', 44.079718652316, -103.218260399805, 'US', true),
  ('Barney’s Drive-In|1300 E Elm Ave, Waseca, MN 56093', 'Barney’s Drive-In', 'barney-s-drive-in', '1300 E Elm Ave, Waseca, MN 56093', 44.07865956822, -93.523212990394, 'US', true),
  ('Baskin-Robbins|3944 S Garnett Rd, Tulsa, OK 74146', 'Baskin-Robbins', 'baskin-robbins', '3944 S Garnett Rd, Tulsa, OK 74146', 36.106245988414, -95.851141651058, 'US', true),
  ('Bavette’s Bar & Boeuf|218 W Kinzie St, Chicago, IL 60654', 'Bavette’s Bar & Boeuf', 'bavette-s-bar-boeuf', '218 W Kinzie St, Chicago, IL 60654', 41.889216408748, -87.634411932852, 'US', true),
  ('Bebe Zito — Malcolm Yards|501 30th Ave SE, Minneapolis, MN 55414', 'Bebe Zito — Malcolm Yards', 'bebe-zito-malcolm-yards', '501 30th Ave SE, Minneapolis, MN 55414', 44.9728625, -93.2136058, 'US', true),
  ('Bebe Zito — Uptown|704 W 22nd St, Minneapolis, MN 55405', 'Bebe Zito — Uptown', 'bebe-zito-uptown', '704 W 22nd St, Minneapolis, MN 55405', 44.96097130639, -93.288137719997, 'US', true),
  ('Blast Soft Serve|Owatonna, Minnesota', 'Blast Soft Serve', 'blast-soft-serve', 'Owatonna, Minnesota', 44.088083, -93.2282628, 'US', true),
  ('Blue Moon Dine-In Theater|1777 Carnes Ave, Falcon Heights, MN 55108', 'Blue Moon Dine-In Theater', 'blue-moon-dine-in-theater', '1777 Carnes Ave, Falcon Heights, MN 55108', 44.9798822, -93.1729608, 'US', true),
  ('Bridgeman’s|2202 Mountain Shadow Dr, Duluth, MN 55811', 'Bridgeman’s', 'bridgeman-s', '2202 Mountain Shadow Dr, Duluth, MN 55811', 46.805814879365, -92.1651755824, 'US', true),
  ('Cold Front|490 Hamline Ave S, St. Paul, MN 55116', 'Cold Front', 'cold-front', '490 Hamline Ave S, St. Paul, MN 55116', 44.926507006598, -93.156755861664, 'US', true),
  ('Conny’s Creamy Cone|1197 Dale St N, St. Paul, MN 55117', 'Conny’s Creamy Cone', 'conny-s-creamy-cone', '1197 Dale St N, St. Paul, MN 55117', 44.977248977645, -93.126434783734, 'US', true),
  ('Cossetta Alimentari|211 7th St W, St. Paul, MN 55102', 'Cossetta Alimentari', 'cossetta-alimentari', '211 7th St W, St. Paul, MN 55102', 44.943490003244, -93.104090667586, 'US', true),
  ('Deadwood Ice Cream Company|673 Main St, Deadwood, SD 57732', 'Deadwood Ice Cream Company', 'deadwood-ice-cream-company', '673 Main St, Deadwood, SD 57732', 44.376741965391, -103.73032983397, 'US', true),
  ('Detroit Mountain Daytripper Sips & Scoops|29409 170th St, Detroit Lakes, MN 56501', 'Detroit Mountain Daytripper Sips & Scoops', 'detroit-mountain-daytripper-sips-scoops', '29409 170th St, Detroit Lakes, MN 56501', 46.818041410736, -95.784983087151, 'US', true),
  ('Dream Creamery NE|816 NE Lowry Ave, Minneapolis, MN 55418', 'Dream Creamery NE', 'dream-creamery-ne', '816 NE Lowry Ave, Minneapolis, MN 55418', 45.013101704786, -93.250569053277, 'US', true),
  ('Dux|216 S Washington St, Lake City, MN 55041', 'Dux', 'dux', '216 S Washington St, Lake City, MN 55041', 44.449043273831, -92.264883624756, 'US', true),
  ('Edina Creamery|4940 France Ave S, Edina, MN 55410', 'Edina Creamery', 'edina-creamery', '4940 France Ave S, Edina, MN 55410', 44.913216419938, -93.329124744286, 'US', true),
  ('Fitz’s Delmar|6605 Delmar Blvd, St. Louis, MO 63130', 'Fitz’s Delmar', 'fitz-s-delmar', '6605 Delmar Blvd, St. Louis, MO 63130', 38.656116400974, -90.305910288416, 'US', true),
  ('Fletcher’s Ice Cream & Cafe|306 E Hennepin Ave, Minneapolis, MN 55414', 'Fletcher’s Ice Cream & Cafe', 'fletcher-s-ice-cream-cafe', '306 E Hennepin Ave, Minneapolis, MN 55414', 44.988003961415, -93.256154207351, 'US', true),
  ('Frozen Flamingo|1208 Williams Dr, Georgetown, TX 78628', 'Frozen Flamingo', 'frozen-flamingo', '1208 Williams Dr, Georgetown, TX 78628', 30.651247308474, -97.681463812494, 'US', true),
  ('Gelato Di Riso|5204 Wilson Ave, St. Louis, MO 63110', 'Gelato Di Riso', 'gelato-di-riso', '5204 Wilson Ave, St. Louis, MO 63110', 38.615666941318, -90.273004599134, 'US', true),
  ('Gelato Isla Mujeres|Av. Rueda Medina 1255, Bahía, Isla Mujeres, Quintana Roo, Mexico', 'Gelato Isla Mujeres', 'gelato-isla-mujeres', 'Av. Rueda Medina 1255, Bahía, Isla Mujeres, Quintana Roo, Mexico', 21.24158, -86.73881, 'MX', true),
  ('Graeter’s — CVG Airport|2939 Terminal Dr, Hebron, KY 41048', 'Graeter’s — CVG Airport', 'graeter-s-cvg-airport', '2939 Terminal Dr, Hebron, KY 41048', 39.055343247434, -84.662068029947, 'US', true),
  ('Graeter’s — Mason|5076 Natorp Blvd, Mason, OH 45040', 'Graeter’s — Mason', 'graeter-s-mason', '5076 Natorp Blvd, Mason, OH 45040', 39.300556295282, -84.316040558196, 'US', true),
  ('Grand Ole Creamery|750 Grand Ave, St. Paul, MN 55105', 'Grand Ole Creamery', 'grand-ole-creamery', '750 Grand Ave, St. Paul, MN 55105', 44.939861399627, -93.131789410124, 'US', true),
  ('Grandpa’s Ice Cream|1258 E Moore Lake Dr, Fridley, MN 55432', 'Grandpa’s Ice Cream', 'grandpa-s-ice-cream', '1258 E Moore Lake Dr, Fridley, MN 55432', 45.0809618, -93.2432205, 'US', true),
  ('Handel’s Homemade Ice Cream|13539 NW Cornell Rd, Portland, OR 97229', 'Handel’s Homemade Ice Cream', 'handel-s-homemade-ice-cream', '13539 NW Cornell Rd, Portland, OR 97229', 45.528328970836, -122.817768093737, 'US', true),
  ('Heritage Creamery — 8th Street|1125 S 8th St, Waco, TX 76706', 'Heritage Creamery — 8th Street', 'heritage-creamery-8th-street', '1125 S 8th St, Waco, TX 76706', 31.546405778874, -97.124858854921, 'US', true),
  ('Historic Moorhead Dairy Queen|24 8th St S, Moorhead, MN 56560', 'Historic Moorhead Dairy Queen', 'historic-moorhead-dairy-queen', '24 8th St S, Moorhead, MN 56560', 46.874885450215, -96.76777327172, 'US', true),
  ('Honey & Mackie''s|16725 County Road 24, Suite 106, Plymouth, MN 55447', 'Honey & Mackie''s', 'honey-mackie-s', '16725 County Road 24, Suite 106, Plymouth, MN 55447', 45.021148307682, -93.493972613457, 'US', true),
  ('Jackie’s Ice Cream|202 Main St, Preston, IA 52069', 'Jackie’s Ice Cream', 'jackie-s-ice-cream', '202 Main St, Preston, IA 52069', 42.052640319977, -90.39387683819, 'US', true),
  ('Jeni''s Splendid Ice Creams — Brentwood|211 Franklin Rd, Suite 100, Brentwood, TN 37027', 'Jeni''s Splendid Ice Creams — Brentwood', 'jeni-s-splendid-ice-creams-brentwood', '211 Franklin Rd, Suite 100, Brentwood, TN 37027', 36.032651997509, -86.789193805875, 'US', true),
  ('Jeni''s Splendid Ice Creams — The Triangle|4616 Triangle Ave, Suite 200, Austin, TX 78751', 'Jeni''s Splendid Ice Creams — The Triangle', 'jeni-s-splendid-ice-creams-the-triangle', '4616 Triangle Ave, Suite 200, Austin, TX 78751', 30.314302715623, -97.734081112101, 'US', true),
  ('La Michoacana Minnesota|1830 S Cedar Ave, Owatonna, MN 55060', 'La Michoacana Minnesota', 'la-michoacana-minnesota', '1830 S Cedar Ave, Owatonna, MN 55060', 44.065799230688, -93.22616102937, 'US', true),
  ('Lappert’s Hawaii — Koloa|2829 Ala Kalanikaumaka, Unit K-160, Koloa, HI 96756', 'Lappert’s Hawaii — Koloa', 'lappert-s-hawaii-koloa', '2829 Ala Kalanikaumaka, Unit K-160, Koloa, HI 96756', 21.888076388855, -159.469679206479, 'US', true),
  ('Lappert’s Hawaii — Wailea|3750 Wailea Alanui Dr, Kihei, HI 96753', 'Lappert’s Hawaii — Wailea', 'lappert-s-hawaii-wailea', '3750 Wailea Alanui Dr, Kihei, HI 96753', 20.688114024077, -156.439642990808, 'US', true),
  ('Leo’s Grill & Malt Shop|131 S Main St, Stillwater, MN 55082', 'Leo’s Grill & Malt Shop', 'leo-s-grill-malt-shop', '131 S Main St, Stillwater, MN 55082', 45.056355320411, -92.805965627637, 'US', true),
  ('Lick Honest Ice Creams — Burnet Road|6555 Burnet Rd, Suite 200, Austin, TX 78757', 'Lick Honest Ice Creams — Burnet Road', 'lick-honest-ice-creams-burnet-road', '6555 Burnet Rd, Suite 200, Austin, TX 78757', 30.34041251431, -97.738847492201, 'US', true),
  ('Licks Unlimited|31 Water St, Excelsior, MN 55331', 'Licks Unlimited', 'licks-unlimited', '31 Water St, Excelsior, MN 55331', 44.904081288974, -93.565284114295, 'US', true),
  ('Love Creamery — Lincoln Park|1908 W Superior St, Duluth, MN 55806', 'Love Creamery — Lincoln Park', 'love-creamery-lincoln-park', '1908 W Superior St, Duluth, MN 55806', 46.768682923333, -92.121846197448, 'US', true),
  ('M&M’s Cafe at Tin City|1200 5th Ave S, Naples, FL 34102', 'M&M’s Cafe at Tin City', 'm-m-s-cafe-at-tin-city', '1200 5th Ave S, Naples, FL 34102', 26.142030463865, -81.790730743074, 'US', true),
  ('Margie’s Candies|1960 N Western Ave, Chicago, IL 60647', 'Margie’s Candies', 'margie-s-candies', '1960 N Western Ave, Chicago, IL 60647', 41.916864171279, -87.687468894059, 'US', true),
  ('Mary Gibbs Cafe — Itasca State Park|36750 Main Park Dr, Park Rapids, MN 56470', 'Mary Gibbs Cafe — Itasca State Park', 'mary-gibbs-cafe-itasca-state-park', '36750 Main Park Dr, Park Rapids, MN 56470', 47.1881825, -95.2196055, 'US', true),
  ('MN Nice Cream — Northeast|807 Broadway St NE, Minneapolis, MN 55413', 'MN Nice Cream — Northeast', 'mn-nice-cream-northeast', '807 Broadway St NE, Minneapolis, MN 55413', 44.998771298301, -93.251025951228, 'US', true),
  ('Museum of Ice Cream — The Domain|11506 Century Oaks Terrace, Suite 128, Austin, TX 78758', 'Museum of Ice Cream — The Domain', 'museum-of-ice-cream-the-domain', '11506 Century Oaks Terrace, Suite 128, Austin, TX 78758', 30.401874152299, -97.726212983687, 'US', true),
  ('Nellie’s Ice Cream|2034 Marshall Ave, St. Paul, MN 55104', 'Nellie’s Ice Cream', 'nellie-s-ice-cream', '2034 Marshall Ave, St. Paul, MN 55104', 44.948330845439, -93.186357840786, 'US', true),
  ('Nelson’s Ice Cream — St. Paul|454 Snelling Ave S, St. Paul, MN 55105', 'Nelson’s Ice Cream — St. Paul', 'nelson-s-ice-cream-st-paul', '454 Snelling Ave S, St. Paul, MN 55105', 44.927826711413, -93.166943857265, 'US', true),
  ('North End Dairy Treat|1108 N 2nd St, Clinton, IA 52732', 'North End Dairy Treat', 'north-end-dairy-treat', '1108 N 2nd St, Clinton, IA 52732', 41.856219093905, -90.185745305486, 'US', true),
  ('Papalani Gelato|2360 Kiahuna Plantation Dr, Koloa, HI 96756', 'Papalani Gelato', 'papalani-gelato', '2360 Kiahuna Plantation Dr, Koloa, HI 96756', 21.881002766882, -159.457726341723, 'US', true),
  ('Picolé|2656 Main St, Suite 110, Dallas, TX 75226', 'Picolé', 'picole', '2656 Main St, Suite 110, Dallas, TX 75226', 32.783575926956, -96.785098715262, 'US', true),
  ('Pitango Gelato & Coffee — Penn Quarter|413 7th St NW, Washington, DC 20004', 'Pitango Gelato & Coffee — Penn Quarter', 'pitango-gelato-coffee-penn-quarter', '413 7th St NW, Washington, DC 20004', 38.895005343234, -77.021842726833, 'US', true),
  ('Pop’s Old Fashioned Ice Cream Co.|109 King St, Alexandria, VA 22314', 'Pop’s Old Fashioned Ice Cream Co.', 'pop-s-old-fashioned-ice-cream-co', '109 King St, Alexandria, VA 22314', 38.804305841336, -77.040416658556, 'US', true),
  ('Portland Malt Shoppe|706 E Superior St, Duluth, MN 55802', 'Portland Malt Shoppe', 'portland-malt-shoppe', '706 E Superior St, Duluth, MN 55802', 46.793831933097, -92.089171460695, 'US', true),
  ('Red Barn Farm|10063 110th St E, Northfield, MN 55057', 'Red Barn Farm', 'red-barn-farm', '10063 110th St E, Northfield, MN 55057', 44.428223490336, -93.097336403172, 'US', true),
  ('Red Cabin Custard|1114 E Sheridan St, Ely, MN 55731', 'Red Cabin Custard', 'red-cabin-custard', '1114 E Sheridan St, Ely, MN 55731', 47.90310919927, -91.849910747949, 'US', true),
  ('Regina’s Ice Cream|8990 Fontana Del Sol Way, Suite 100, Naples, FL 34109', 'Regina’s Ice Cream', 'regina-s-ice-cream', '8990 Fontana Del Sol Way, Suite 100, Naples, FL 34109', 26.244845490711, -81.77311857762, 'US', true),
  ('Roselani Scoop Shop|115D Hana Hwy, Paia, HI 96779', 'Roselani Scoop Shop', 'roselani-scoop-shop', '115D Hana Hwy, Paia, HI 96779', 20.91600892112, -156.381531223624, 'US', true),
  ('Salt & Straw — Beaverton|2735 SW Cedar Hills Blvd, Unit 100, Beaverton, OR 97005', 'Salt & Straw — Beaverton', 'salt-straw-beaverton', '2735 SW Cedar Hills Blvd, Unit 100, Beaverton, OR 97005', 45.49928105024, -122.807219248267, 'US', true),
  ('Salt & Straw — NW 23rd|838 NW 23rd Ave, Portland, OR 97210', 'Salt & Straw — NW 23rd', 'salt-straw-nw-23rd', '838 NW 23rd Ave, Portland, OR 97210', 45.528656612203, -122.698485213398, 'US', true),
  ('Schoolhouse Scoop|919 Vermillion St, Suite 120, Hastings, MN 55033', 'Schoolhouse Scoop', 'schoolhouse-scoop', '919 Vermillion St, Suite 120, Hastings, MN 55033', 44.737098505226, -92.852385433178, 'US', true),
  ('Schoony’s Malt Shop & Pizzeria|384 Bench St, Taylors Falls, MN 55084', 'Schoony’s Malt Shop & Pizzeria', 'schoony-s-malt-shop-pizzeria', '384 Bench St, Taylors Falls, MN 55084', 45.402494864133, -92.652537206316, 'US', true),
  ('Sebastian Joe’s — Linden Hills|4321 Upton Ave S, Minneapolis, MN 55410', 'Sebastian Joe’s — Linden Hills', 'sebastian-joe-s-linden-hills', '4321 Upton Ave S, Minneapolis, MN 55410', 44.924310928673, -93.314660747978, 'US', true),
  ('Sheridan’s Frozen Custard|2450 Grand Blvd, Unit 119, Kansas City, MO 64108', 'Sheridan’s Frozen Custard', 'sheridan-s-frozen-custard', '2450 Grand Blvd, Unit 119, Kansas City, MO 64108', 39.083289683825, -94.581854594192, 'US', true),
  ('Skinny Mike’s Ice Cream & Shave Ice|3501 Rice St, Unit 1006, Lihue, HI 96766', 'Skinny Mike’s Ice Cream & Shave Ice', 'skinny-mike-s-ice-cream-shave-ice', '3501 Rice St, Unit 1006, Lihue, HI 96766', 21.9722488, -159.3500201, 'US', true),
  ('Sweet Saint|710 Saint Louis St, New Orleans, LA 70130', 'Sweet Saint', 'sweet-saint', '710 Saint Louis St, New Orleans, LA 70130', 29.956449267219, -90.066302516005, 'US', true),
  ('Sweets on Third|119 3rd Ave, Baraboo, WI 53913', 'Sweets on Third', 'sweets-on-third', '119 3rd Ave, Baraboo, WI 53913', 43.469877140803, -89.742865864627, 'US', true),
  ('The Baked Bear — Seaholm|211 Walter Seaholm Dr, Suite LR150, Austin, TX 78701', 'The Baked Bear — Seaholm', 'the-baked-bear-seaholm', '211 Walter Seaholm Dr, Suite LR150, Austin, TX 78701', 30.2679551, -97.7530453, 'US', true),
  ('The Cereal Killerz Kitchen — Miracle Mile Shops|3663 S Las Vegas Blvd, Suite 810, Las Vegas, NV 89109', 'The Cereal Killerz Kitchen — Miracle Mile Shops', 'the-cereal-killerz-kitchen-miracle-mile-shops', '3663 S Las Vegas Blvd, Suite 810, Las Vegas, NV 89109', 36.110960389144, -115.172914345721, 'US', true),
  ('The Creamery|110 King St, Alexandria, VA 22314', 'The Creamery', 'the-creamery', '110 King St, Alexandria, VA 22314', 38.804195139688, -77.040460596862, 'US', true),
  ('The S''Cream|Owatonna, Minnesota', 'The S''Cream', 'the-s-cream', 'Owatonna, Minnesota', 44.082517, -93.2282716, 'US', true),
  ('The Yard Milkshake Bar — Austin|3400 Esperanza Crossing, Austin, TX 78758', 'The Yard Milkshake Bar — Austin', 'the-yard-milkshake-bar-austin', '3400 Esperanza Crossing, Austin, TX 78758', 30.400613232304, -97.726752921978, 'US', true),
  ('Thomas Sweet — Washington, D.C.|3214 P St NW, Washington, DC 20007', 'Thomas Sweet — Washington, D.C.', 'thomas-sweet-washington-d-c', '3214 P St NW, Washington, DC 20007', 38.909190249588, -77.063860883675, 'US', true),
  ('Tommy’s Tonka Trolley|Excelsior, Minnesota', 'Tommy’s Tonka Trolley', 'tommy-s-tonka-trolley', 'Excelsior, Minnesota', 44.9047737, -93.5654459, 'US', true),
  ('Treats Cereal Bar & Boba — Minneapolis|314 N 2nd St, Minneapolis, MN 55401', 'Treats Cereal Bar & Boba — Minneapolis', 'treats-cereal-bar-boba-minneapolis', '314 N 2nd St, Minneapolis, MN 55401', 44.985521304277, -93.271459707956, 'US', true),
  ('Treats Cereal Bar & Boba — St. Paul|770 Grand Ave, St. Paul, MN 55105', 'Treats Cereal Bar & Boba — St. Paul', 'treats-cereal-bar-boba-st-paul', '770 Grand Ave, St. Paul, MN 55105', 44.939864207988, -93.132579948221, 'US', true),
  ('Two Scoops — Osseo|215 Central Ave, Osseo, MN 55369', 'Two Scoops — Osseo', 'two-scoops-osseo', '215 Central Ave, Osseo, MN 55369', 45.118368323631, -93.402253817829, 'US', true),
  ('Ululani’s Hawaiian Shave Ice|61 S Kihei Rd, Kihei, HI 96753', 'Ululani’s Hawaiian Shave Ice', 'ululani-s-hawaiian-shave-ice', '61 S Kihei Rd, Kihei, HI 96753', 20.780512845539, -156.462001241164, 'US', true),
  ('Uncle’s Shave Ice|4454 Nuhou St, Unit 419, Lihue, HI 96766', 'Uncle’s Shave Ice', 'uncle-s-shave-ice', '4454 Nuhou St, Unit 419, Lihue, HI 96766', 21.966801536517, -159.385609486547, 'US', true),
  ('Wells Roadside|3712 Quebec Ave S, St. Louis Park, MN 55426', 'Wells Roadside', 'wells-roadside', '3712 Quebec Ave S, St. Louis Park, MN 55426', 44.936359777906, -93.37701645442, 'US', true),
  ('Wilky Wilty|712 1st Center Ave, Brodhead, WI 53520', 'Wilky Wilty', 'wilky-wilty', '712 1st Center Ave, Brodhead, WI 53520', 42.623406627564, -89.376742943698, 'US', true)
on conflict (id) do update set
  display_name = excluded.display_name,
  normalized_name = excluded.normalized_name,
  address = excluded.address,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  country_code = excluded.country_code,
  is_verified = excluded.is_verified,
  updated_at = now();
