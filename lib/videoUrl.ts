// Resolves a video source to either a local /public path (default) or a remote
// CDN/Blob base when NEXT_PUBLIC_VIDEO_BASE_URL is set.
//
// Why: raw .mp4 files were committed into git history, bloating the repo and
// re-uploading on every push. Videos now live in Vercel Blob; setting the env
// var flips the whole site over without touching the src paths in data/.
//
//   unset  ->  "/farnborough/foo.mp4"                     (local public/)
//   set    ->  "https://<store>.public.blob.vercel-storage.com/farnborough/foo.mp4"
//
// Already-absolute URLs are passed through untouched.

const BASE = (process.env.NEXT_PUBLIC_VIDEO_BASE_URL || '').replace(/\/$/, '')

export function videoUrl(src: string): string {
  if (/^https?:\/\//i.test(src)) return src
  if (!BASE) return src
  return src.startsWith('/') ? BASE + src : `${BASE}/${src}`
}
