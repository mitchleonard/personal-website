-- A public Made by Mitch entry needs the day it was made just as a rating
-- needs the day it was tasted. Backfill existing captures from their capture
-- timestamp so they remain reviewable after this migration.
alter table public.shoppe_submissions
  add column made_at date;

update public.shoppe_submissions
set made_at = created_at::date
where kind = 'pint' and made_at is null;

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
  if new.status = 'published' and (tg_op = 'INSERT' or old.status <> 'approved' or new.approved_at is null) then
    raise exception using errcode = 'check_violation', message = 'A submission can publish only after it has been approved.';
  end if;
  return new;
end;
$$;
