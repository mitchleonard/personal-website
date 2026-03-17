# mitchleonard.com

Personal portfolio site for Mitch Leonard — built with Next.js 14 (App Router) and deployed on Vercel.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

## Vercel Deployment

1. Push this repo to GitHub
2. Import the repo at vercel.com/new
3. Framework preset will auto-detect as Next.js
4. Add environment variables from `.env.local` in the Vercel dashboard
5. Deploy

## DNS Configuration (Squarespace → Vercel)

After deploying on Vercel, add your custom domain in the Vercel dashboard under **Settings → Domains**. Then update these DNS records in Squarespace Domains:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | Auto |
| CNAME | www | cname.vercel-dns.com | Auto |

**Note:** DNS propagation can take up to 48 hours. Vercel will show a green checkmark when the domain is verified.
