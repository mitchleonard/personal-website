import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const inputPath = path.join(root, 'data', 'ice-cream-inbox.csv')
const outputPath = path.join(root, 'data', 'iceCream.imported.json')
const shouldWrite = process.argv.includes('--write')

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    const next = text[index + 1]
    if (character === '"' && quoted && next === '"') {
      field += '"'
      index += 1
    } else if (character === '"') {
      quoted = !quoted
    } else if (character === ',' && !quoted) {
      row.push(field.trim())
      field = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1
      row.push(field.trim())
      if (row.some(Boolean)) rows.push(row)
      row = []
      field = ''
    } else {
      field += character
    }
  }
  if (field || row.length) {
    row.push(field.trim())
    if (row.some(Boolean)) rows.push(row)
  }
  return rows
}

function slugify(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function validateDate(value, rowNumber, errors) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    errors.push(`Row ${rowNumber}: date must use YYYY-MM-DD.`)
  }
}

if (!fs.existsSync(inputPath)) throw new Error(`Missing inbox: ${inputPath}`)

const [headers, ...values] = parseCsv(fs.readFileSync(inputPath, 'utf8'))
const requiredHeaders = ['type', 'shop_or_name', 'flavor_or_base', 'score', 'date', 'city', 'region', 'notes', 'mix_ins', 'image_src', 'latitude', 'longitude']
if (!headers || requiredHeaders.some((header) => !headers.includes(header))) {
  throw new Error(`Inbox headers must be: ${requiredHeaders.join(', ')}`)
}

const records = values.map((fields, offset) => Object.fromEntries(headers.map((header, index) => [header, fields[index] ?? ''])))
  .filter((record) => record.shop_or_name || record.flavor_or_base || record.score || record.date)
const errors = []
const ratings = []
const homemade = []
const ids = new Set()

for (const [index, record] of records.entries()) {
  const rowNumber = index + 2
  if (!['rating', 'homemade'].includes(record.type)) {
    errors.push(`Row ${rowNumber}: type must be rating or homemade.`)
    continue
  }
  if (!record.shop_or_name || !record.flavor_or_base || !record.date) {
    errors.push(`Row ${rowNumber}: shop_or_name, flavor_or_base, and date are required.`)
    continue
  }
  validateDate(record.date, rowNumber, errors)
  const slug = slugify(`${record.shop_or_name}-${record.flavor_or_base}-${record.date}`)
  if (ids.has(slug)) errors.push(`Row ${rowNumber}: duplicate record ${slug}.`)
  ids.add(slug)

  if (record.type === 'rating') {
    const score = Number(record.score)
    if (!Number.isFinite(score) || score < 0 || score > 10) errors.push(`Row ${rowNumber}: score must be between 0 and 10.`)
    if (!record.city || !record.region) errors.push(`Row ${rowNumber}: ratings require city and region.`)
    ratings.push({
      id: slug, slug, shop: record.shop_or_name, flavor: record.flavor_or_base,
      score, scoreScale: 10, triedAt: record.date, notes: record.notes || undefined,
      image: record.image_src ? { src: record.image_src, alt: `${record.flavor_or_base} ice cream from ${record.shop_or_name}` } : undefined,
      location: {
        label: `${record.shop_or_name}, ${record.city}`, city: record.city, region: record.region,
        latitude: record.latitude ? Number(record.latitude) : undefined,
        longitude: record.longitude ? Number(record.longitude) : undefined,
      },
      status: 'published',
    })
  } else {
    homemade.push({
      id: slug, slug, name: record.shop_or_name, madeAt: record.date,
      base: record.flavor_or_base, mixIns: record.mix_ins ? record.mix_ins.split('|').map((item) => item.trim()).filter(Boolean) : [],
      description: record.notes || '', wouldMakeAgain: true,
      image: record.image_src ? { src: record.image_src, alt: `${record.shop_or_name} homemade ice cream pint` } : undefined,
    })
  }
}

if (errors.length) {
  console.error(`Ice cream import found ${errors.length} issue${errors.length === 1 ? '' : 's'}:\n- ${errors.join('\n- ')}`)
  process.exitCode = 1
} else if (shouldWrite) {
  const existing = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, 'utf8')) : { ratings: [], homemade: [] }
  const merge = (current, incoming) => {
    const incomingIds = new Set(incoming.map((record) => record.id))
    return [...current.filter((record) => !incomingIds.has(record.id)), ...incoming]
  }
  const mergedRatings = merge(existing.ratings ?? [], ratings)
  const mergedHomemade = merge(existing.homemade ?? [], homemade)
  fs.writeFileSync(outputPath, `${JSON.stringify({ ratings: mergedRatings, homemade: mergedHomemade }, null, 2)}\n`)
  console.log(`Added ${ratings.length} rating${ratings.length === 1 ? '' : 's'} and ${homemade.length} homemade pint${homemade.length === 1 ? '' : 's'}; archive now contains ${mergedRatings.length} ratings and ${mergedHomemade.length} homemade pints.`)
} else {
  console.log(`Valid inbox: ${ratings.length} rating${ratings.length === 1 ? '' : 's'}, ${homemade.length} homemade pint${homemade.length === 1 ? '' : 's'}. Run npm run ice-cream:import to publish.`)
}
