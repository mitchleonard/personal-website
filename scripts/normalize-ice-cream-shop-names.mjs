/** Normalize established shop names across the published archive. */
import { readFile, writeFile } from 'node:fs/promises'

const archiveUrl = new URL('../data/iceCream.imported.json', import.meta.url)
const archive = JSON.parse(await readFile(archiveUrl, 'utf8'))

const canonicalNames = {
  'Honey & Mackies': "Honey & Mackie's",
  'Honey & Mackey’s': "Honey & Mackie's",
  'Honey & Mackie’s': "Honey & Mackie's",
  'Honey and Mackie’s': "Honey & Mackie's",
  '4 Queens Dairy Treat': '4 Queens Dairy Cream',
  'Jeni’s Spendid Ice Creams': "Jeni's Splendid Ice Creams",
  'Jeni’s Splendid Ice Creams': "Jeni's Splendid Ice Creams",
}

let changes = 0
for (const rating of archive.ratings) {
  const canonicalName = canonicalNames[rating.shop]
  if (!canonicalName) continue
  rating.shop = canonicalName
  rating.location.label = canonicalName
  if (rating.image) rating.image.alt = `${rating.flavor} from ${canonicalName}`
  changes += 1
}

await writeFile(archiveUrl, `${JSON.stringify(archive, null, 2)}\n`)
console.log(`Normalized ${changes} published rating shop names.`)
