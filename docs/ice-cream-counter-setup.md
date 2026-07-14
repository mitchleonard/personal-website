# Ice Cream Shoppe Counter — manual setup checklist

The private Counter code is ready in this repository. These are the only account-level steps that require Mitch because they create or configure external Supabase/Vercel resources.

## 1. Create the free Supabase project

1. Create one Supabase project (or choose an existing empty project) and keep it on the Free plan.
2. In **Connect**, copy the **Project URL** and **Publishable key**. Do not use or share a `service_role`/secret key for this feature.
3. In **Authentication → URL configuration**, add these redirect URLs:
   - `https://mitchleonard.com/auth/callback`
   - the current Vercel preview URL pattern if preview sign-in will be tested, for example `https://*.vercel.app/auth/callback`
4. Confirm Email magic links are enabled in **Authentication → Providers → Email**.

## 2. Set Vercel environment variables

Add these to the Vercel project for **Production** and **Preview**:

```text
NEXT_PUBLIC_SUPABASE_URL=<Project URL>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<Publishable key>
SHOPPE_EDITOR_EMAIL=<your exact email address>
```

`BLOB_READ_WRITE_TOKEN` already remains the server-only credential for uploaded Shoppe images. Do not add a Supabase Storage key or a Supabase service-role key.

## 3. Apply the versioned database setup

From the repository root, link the CLI to the project and apply the checked-in migration:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push
```

That migration creates the private draft/review tables, row-level security policies, and 89 verified storefronts from `data/iceCream.mapLocations.json`. It does not upload or duplicate any media.

## 4. Make the one editor account explicit

1. Deploy with the variables above.
2. Visit `https://mitchleonard.com/ice-cream/counter/login` and request a magic link with `SHOPPE_EDITOR_EMAIL`.
3. Open the magic link. The Counter will show **One last setup step** because the auth account exists but has not yet been granted editor access.
4. In **Supabase → Authentication → Users**, copy that user’s UUID.
5. In **SQL Editor**, run this once, replacing the UUID:

```sql
insert into public.shoppe_editors (user_id)
values ('YOUR-AUTH-USER-UUID')
on conflict (user_id) do nothing;
```

Reload the Counter. Only this account can now read or write Shoppe drafts. The email allowlist at the site layer and the database allowlist are intentionally both required.

## 5. Acceptance test before using it for real

1. Save a draft with only a title. It should remain private.
2. Try to submit a rating without choosing a verified address. It must be blocked with a clear reason.
3. Submit a pint with a JPEG photo, name, and description. It should become **ready for review**, never public.
4. Confirm the photo uploaded to the existing Vercel Blob store and no Supabase Storage bucket exists.
5. Follow [the release checklist](./ice-cream-content-workflow.md#release-checklist) before any review-ready entry reaches `data/ice-cream-inbox.csv` or the public map.

If any of those behaviors fails, keep the Counter private and fix the source setup before adding real content.
