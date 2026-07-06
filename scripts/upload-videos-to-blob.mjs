// One-time migration: upload every video in public/ to Vercel Blob, preserving
// the folder structure so each Blob path mirrors its existing `src` path.
//
// Prereqs (run from the repo root):
//   1. npm install @vercel/blob
//   2. Create a Blob store in the Vercel dashboard (Storage -> Create -> Blob),
//      then copy its read/write token.
//   3. export BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxx"
//   4. node scripts/upload-videos-to-blob.mjs
//
// It prints the base URL to set as NEXT_PUBLIC_VIDEO_BASE_URL in Vercel.
// Safe to re-run (allowOverwrite: true). Reads nothing but public/**.

import { readdir, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { join, relative, extname, sep, posix } from 'node:path';
import { put } from '@vercel/blob';

const PUBLIC_DIR = new URL('../public/', import.meta.url).pathname;
const VIDEO_EXT = new Set(['.mp4', '.mov', '.webm']);

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('Missing BLOB_READ_WRITE_TOKEN. See the header of this file.');
  process.exit(1);
}

async function* walk(dir) {
  for (const name of await readdir(dir)) {
    const full = join(dir, name);
    if ((await stat(full)).isDirectory()) yield* walk(full);
    else yield full;
  }
}

const files = [];
for await (const f of walk(PUBLIC_DIR)) {
  if (VIDEO_EXT.has(extname(f).toLowerCase())) files.push(f);
}
files.sort();

console.log(`Found ${files.length} video files. Uploading to Vercel Blob...\n`);

let done = 0;
let baseUrl = '';
for (const abs of files) {
  // pathname mirrors the existing src (e.g. "farnborough/foo.mp4")
  const pathname = relative(PUBLIC_DIR, abs).split(sep).join(posix.sep);
  const { url } = await put(pathname, createReadStream(abs), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: extname(abs).toLowerCase() === '.webm' ? 'video/webm' : 'video/mp4',
  });
  if (!baseUrl) baseUrl = url.slice(0, url.indexOf('/' + pathname));
  done++;
  console.log(`  [${String(done).padStart(2)}/${files.length}] ${pathname}`);
}

console.log(`\nDone. Uploaded ${done} files.`);
console.log('\nSet this in Vercel (Project -> Settings -> Environment Variables):');
console.log(`  NEXT_PUBLIC_VIDEO_BASE_URL = ${baseUrl}`);
console.log('\nThen redeploy and confirm every reel plays before rewriting git history.');
