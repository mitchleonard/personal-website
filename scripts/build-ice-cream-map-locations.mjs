/**
 * Materialize the address research into per-rating map pins.
 *
 * Usage: node scripts/build-ice-cream-map-locations.mjs
 *
 * The published archive intentionally keeps photo GPS as historical evidence.
 * This script creates a separate, public storefront-location layer so a photo
 * taken at a pickup site, table, or home never becomes the map pin.
 */
import { readFile, writeFile } from 'node:fs/promises'

const archive = JSON.parse(await readFile(new URL('../data/iceCream.imported.json', import.meta.url), 'utf8'))
const outputUrl = new URL('../data/iceCream.mapLocations.json', import.meta.url)

const locations = {
  '4 Queens Dairy Cream': ['4 Queens Dairy Treat', '1310 W 1st St, Cedar Falls, IA 50613'],
  '4 Queens Dairy Treat': ['4 Queens Dairy Treat', '1310 W 1st St, Cedar Falls, IA 50613'],
  'A to Z Creamery': ['A to Z Creamery — Hopkins', '703 Mainstreet, Hopkins, MN 55343'],
  'Adele’s Frozen Custard': ['Adele’s Frozen Custard', '800 Excelsior Blvd, Excelsior, MN 55331'],
  'Aldo’s Gelato Cancun': ['Aldo’s Gelato — La Isla I', 'Blvd. Kukulcan km 12.5, Zona Hotelera, Cancún, Quintana Roo, Mexico'],
  'American Old-Fashioned Ice Cream Parlor': ['American Old-Fashioned Ice Cream Parlor', '102 N Main St, Galena, IL 61036'],
  'Amy’s Ice Cream': ['Amy’s Ice Creams — South Congress', '1301 S Congress Ave, Austin, TX 78704'],
  'Andy’s Frozen Custard': ['Andy’s Frozen Custard', '4844 S Yale Ave, Tulsa, OK 74135'],
  'Armadillo’s Ice Cream Shoppe': ['Armadillo’s Ice Cream Shoppe', '130 Main St, Rapid City, SD 57701'],
  'Barney’s Drive In': ['Barney’s Drive-In', '1300 E Elm Ave, Waseca, MN 56093'],
  'Baskin Robbins': ['Baskin-Robbins', '3944 S Garnett Rd, Tulsa, OK 74146'],
  'Bavette’s Bar & Boeuf': ['Bavette’s Bar & Boeuf', '218 W Kinzie St, Chicago, IL 60654'],
  'Blue Moon Dine-In-Theater (MN State Fair)': ['Blue Moon Dine-In Theater', '1777 Carnes Ave, Falcon Heights, MN 55108'],
  'Bridgeman’s': ['Bridgeman’s', '2202 Mountain Shadow Dr, Duluth, MN 55811'],
  'Cereal Killerz': ['The Cereal Killerz Kitchen — Miracle Mile Shops', '3663 S Las Vegas Blvd, Suite 810, Las Vegas, NV 89109'],
  'Cold Front': ['Cold Front', '490 Hamline Ave S, St. Paul, MN 55116'],
  'Conny’s Creamy Cone': ['Conny’s Creamy Cone', '1197 Dale St N, St. Paul, MN 55117'],
  'Cossetta’s': ['Cossetta Alimentari', '211 7th St W, St. Paul, MN 55102'],
  'Daytripper Sips & Scoops': ['Detroit Mountain Daytripper Sips & Scoops', '29409 170th St, Detroit Lakes, MN 56501'],
  'Deadwood Ice Cream Company': ['Deadwood Ice Cream Company', '673 Main St, Deadwood, SD 57732'],
  'Dream Creamery': ['Dream Creamery NE', '816 NE Lowry Ave, Minneapolis, MN 55418'],
  'Dux Ice Cream': ['Dux', '216 S Washington St, Lake City, MN 55041'],
  'Edina Creamery': ['Edina Creamery', '4940 France Ave S, Edina, MN 55410'],
  'Fitz’s': ['Fitz’s Delmar', '6605 Delmar Blvd, St. Louis, MO 63130'],
  'Fletcher’s Ice Cream': ['Fletcher’s Ice Cream & Cafe', '306 E Hennepin Ave, Minneapolis, MN 55414'],
  'Fletcher’s Ice Cream & Cafe': ['Fletcher’s Ice Cream & Cafe', '306 E Hennepin Ave, Minneapolis, MN 55414'],
  'Frozen Flamingo': ['Frozen Flamingo', '1208 Williams Dr, Georgetown, TX 78628'],
  'Gelato Di Rosa': ['Gelato Di Riso', '5204 Wilson Ave, St. Louis, MO 63110'],
  'Gelato Isla Mujeres': ['Gelato Isla Mujeres', 'Av. Rueda Medina 1255, Bahía, Isla Mujeres, Quintana Roo, Mexico'],
  'Grand Ole Creamery': ['Grand Ole Creamery', '750 Grand Ave, St. Paul, MN 55105'],
  'Grandpa’s Ice Cream': ['Grandpa’s Ice Cream', '1258 E Moore Lake Dr, Fridley, MN 55432'],
  'Handel’s Ice Cream': ['Handel’s Homemade Ice Cream', '13539 NW Cornell Rd, Portland, OR 97229'],
  'Heritage Creamery': ['Heritage Creamery — 8th Street', '1125 S 8th St, Waco, TX 76706'],
  'Historic Moorhead Dairy Queen': ['Historic Moorhead Dairy Queen', '24 8th St S, Moorhead, MN 56560'],
  'Honey & Mackey’s': ['Honey & Mackie’s', '16725 County Road 24, Suite 106, Plymouth, MN 55447'],
  'Honey & Mackie’s': ['Honey & Mackie’s', '16725 County Road 24, Suite 106, Plymouth, MN 55447'],
  'Honey & Mackies': ['Honey & Mackie’s', '16725 County Road 24, Suite 106, Plymouth, MN 55447'],
  'Honey and Mackie’s': ['Honey & Mackie’s', '16725 County Road 24, Suite 106, Plymouth, MN 55447'],
  'Itasca State Park': ['Mary Gibbs Cafe — Itasca State Park', '36750 Main Park Dr, Park Rapids, MN 56470'],
  'Jackie’s Ice Cream': ['Jackie’s Ice Cream', '202 Main St, Preston, IA 52069'],
  'La Michoacana Owatonna': ['La Michoacana Minnesota', '1830 S Cedar Ave, Owatonna, MN 55060'],
  'Leo’s Grill & Malt Shop': ['Leo’s Grill & Malt Shop', '131 S Main St, Stillwater, MN 55082'],
  'Lick Honest Ice Creams': ['Lick Honest Ice Creams — Burnet Road', '6555 Burnet Rd, Suite 200, Austin, TX 78757'],
  'Licks Unlimited': ['Licks Unlimited', '31 Water St, Excelsior, MN 55331'],
  'Love Creamery': ['Love Creamery — Lincoln Park', '1908 W Superior St, Duluth, MN 55806'],
  'M&M’s Cafe': ['M&M’s Cafe at Tin City', '1200 5th Ave S, Naples, FL 34102'],
  'Margie’s Candies': ['Margie’s Candies', '1960 N Western Ave, Chicago, IL 60647'],
  'MN Ice Cream': ['MN Nice Cream — Northeast', '807 Broadway St NE, Minneapolis, MN 55413'],
  'MN Nice Cream': ['MN Nice Cream — Northeast', '807 Broadway St NE, Minneapolis, MN 55413'],
  'Museum of Ice Cream': ['Museum of Ice Cream — The Domain', '11506 Century Oaks Terrace, Suite 128, Austin, TX 78758'],
  'Nellie’s Ice Cream': ['Nellie’s Ice Cream', '2034 Marshall Ave, St. Paul, MN 55104'],
  'Nelson’s Ice Cream': ['Nelson’s Ice Cream — St. Paul', '454 Snelling Ave S, St. Paul, MN 55105'],
  'North End Dairy Treat': ['North End Dairy Treat', '1108 N 2nd St, Clinton, IA 52732'],
  'Papalani Gelato': ['Papalani Gelato', '2360 Kiahuna Plantation Dr, Koloa, HI 96756'],
  'Picolé': ['Picolé', '2656 Main St, Suite 110, Dallas, TX 75226'],
  'Pitango': ['Pitango Gelato & Coffee — Penn Quarter', '413 7th St NW, Washington, DC 20004'],
  'Pop’s Old Fashioned Ice Cream Company': ['Pop’s Old Fashioned Ice Cream Co.', '109 King St, Alexandria, VA 22314'],
  'Portland Malt Shoppe': ['The PortLand Malt Shoppe', '706 E Superior St, Duluth, MN 55802'],
  'Red Barn Farm': ['Red Barn Farm', '10063 110th St E, Northfield, MN 55057'],
  'Red Cabin Custard': ['Red Cabin Custard', '1114 E Sheridan St, Ely, MN 55731'],
  'Regina’s Ice Cream': ['Regina’s Ice Cream', '8990 Fontana Del Sol Way, Suite 100, Naples, FL 34109'],
  'Roselani': ['Roselani Scoop Shop', '115D Hana Hwy, Paia, HI 96779'],
  'Schoolhouse Scoop': ['Schoolhouse Scoop', '919 Vermillion St, Suite 120, Hastings, MN 55033'],
  'Schoony’s Malt Shop': ['Schoony’s Malt Shop & Pizzeria', '384 Bench St, Taylors Falls, MN 55084'],
  'Sebastian Joe’s': ['Sebastian Joe’s — Linden Hills', '4321 Upton Ave S, Minneapolis, MN 55410'],
  'Sheridan’s Frozen Custard': ['Sheridan’s Frozen Custard', '2450 Grand Blvd, Unit 119, Kansas City, MO 64108'],
  'Skinny Mike’s Ice Cream and Shave Ice': ['Skinny Mike’s Ice Cream & Shave Ice', '3501 Rice St, Unit 1006, Lihue, HI 96766'],
  'Sweet Saint': ['Sweet Saint', '710 Saint Louis St, New Orleans, LA 70130'],
  'Sweets on Third': ['Sweets on Third', '119 3rd Ave, Baraboo, WI 53913'],
  'Tin Roof Dairy': ['Sweets on Third', '119 3rd Ave, Baraboo, WI 53913'],
  'The Creamery': ['The Creamery', '110 King St, Alexandria, VA 22314'],
  'The Baked Bear': ['The Baked Bear — Seaholm', '211 Walter Seaholm Dr, Suite LR150, Austin, TX 78701'],
  'The Yard Milkshake Bar': ['The Yard Milkshake Bar — Austin', '3400 Esperanza Crossing, Austin, TX 78758'],
  'Thomas Sweets': ['Thomas Sweet — Washington, D.C.', '3214 P St NW, Washington, DC 20007'],
  'Treats': ['Treats Cereal Bar & Boba — St. Paul', '770 Grand Ave, St. Paul, MN 55105'],
  'Two Scoops': ['Two Scoops — Osseo', '215 Central Ave, Osseo, MN 55369'],
  'Ululani’s Hawaiian Shave Ice': ['Ululani’s Hawaiian Shave Ice', '61 S Kihei Rd, Kihei, HI 96753'],
  'Uncle’s Shaved Ice': ['Uncle’s Shave Ice', '4454 Nuhou St, Unit 419, Lihue, HI 96766'],
  'Wells Roadside': ['Wells Roadside', '3712 Quebec Ave S, St. Louis Park, MN 55426'],
  'Wilky Wilty': ['Wilky Wilty', '712 1st Center Ave, Brodhead, WI 53520'],
  '‘Nita Mae’s Scoop': ['‘Nita Mae’s Scoop', '101 Judd St, Marine on St. Croix, MN 55047'],
}

const datedLocations = {
  'A to Z Creamery (MN State Fair)|2023-09-02': ['A to Z Creamery — Minnesota State Fair', '1297 Underwood St, Falcon Heights, MN 55108'],
  'Bebe Zito|2021-02-14': ['Bebe Zito — Uptown', '704 W 22nd St, Minneapolis, MN 55405'],
  'Bebe Zito|2021-02-24': ['Bebe Zito — A to Z collaboration pickup', '703 Mainstreet, Hopkins, MN 55343'],
  'Bebe Zito|2021-10-21': ['Bebe Zito — Malcolm Yards', '501 30th Ave SE, Minneapolis, MN 55414'],
  'Graeter’s|2022-09-29': ['Graeter’s — Mason', '5076 Natorp Blvd, Mason, OH 45040'],
  'Graeter’s|2022-10-02': ['Graeter’s — CVG Airport', '2939 Terminal Dr, Hebron, KY 41048'],
  'Jeni’s Splendid Ice Creams|2022-07-23': ['Jeni’s Splendid Ice Creams — Brentwood', '211 Franklin Rd, Suite 100, Brentwood, TN 37027'],
  'Jeni’s Spendid Ice Creams|2023-11-19': ['Jeni’s Splendid Ice Creams — The Triangle', '4616 Triangle Ave, Suite 200, Austin, TX 78751'],
  'Lappert’s|2025-01-11': ['Lappert’s Hawaii — Wailea', '3750 Wailea Alanui Dr, Kihei, HI 96753'],
  'Lappert’s|2025-01-13': ['Lappert’s Hawaii — Koloa', '2829 Ala Kalanikaumaka, Unit K-160, Koloa, HI 96756'],
  'Lappert’s|2025-01-18': ['Lappert’s Hawaii — Koloa', '2829 Ala Kalanikaumaka, Unit K-160, Koloa, HI 96756'],
  'Salt & Straw|2023-09-30': ['Salt & Straw — Beaverton', '2735 SW Cedar Hills Blvd, Unit 100, Beaverton, OR 97005'],
  'Salt & Straw|2025-03-29': ['Salt & Straw — NW 23rd', '838 NW 23rd Ave, Portland, OR 97210'],
  'Treats|2024-05-18': ['Treats Cereal Bar & Boba — Minneapolis', '314 N 2nd St, Minneapolis, MN 55401'],
}

const directCoordinates = {
  'Blast Soft Serve': { latitude: 44.088083, longitude: -93.2282628 },
  "The S'Cream": { latitude: 44.082517, longitude: -93.2282716 },
  'Tommy’s Tonka Trolley': { latitude: 44.9047737, longitude: -93.5654459 },
  'Mary Gibbs Cafe — Itasca State Park': { latitude: 47.1881825, longitude: -95.2196055 },
  // These two Mexican storefronts are outside the U.S. Census data used below.
  'Aldo’s Gelato — La Isla I': { latitude: 21.1134, longitude: -86.764 },
  'Gelato Isla Mujeres': { latitude: 21.24158, longitude: -86.73881 },
}

function locationFor(rating) {
  if (rating.shop === 'The Blast') return ['Blast Soft Serve', 'Owatonna, Minnesota']
  if (rating.shop === "The S'Cream") return ["The S'Cream", 'Owatonna, Minnesota']
  if (rating.shop === 'Tommy’s Tonka Trolley / Sebastian Joe’s') return ['Tommy’s Tonka Trolley', 'Excelsior, Minnesota']
  return datedLocations[`${rating.shop}|${rating.triedAt}`] ?? locations[rating.shop]
}

const cache = new Map()
const usAddress = /, (?:AL|AK|AZ|AR|CA|CO|CT|DC|DE|FL|GA|HI|IA|ID|IL|IN|KS|KY|LA|MA|MD|ME|MI|MN|MO|MS|MT|NC|ND|NE|NH|NJ|NM|NV|NY|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|VT|WA|WI|WV),? \d{5}(?:-\d{4})?$/

async function geocodeUsAddress(address) {
  const request = await fetch(`https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?benchmark=Public_AR_Current&format=json&address=${encodeURIComponent(address)}`)
  if (!request.ok) throw new Error(`U.S. address geocoding failed for ${address}: ${request.status}`)
  const match = (await request.json()).result.addressMatches[0]
  if (!match) return null
  return { latitude: Number(match.coordinates.y), longitude: Number(match.coordinates.x) }
}

async function geocodePhoton(address) {
  const request = await fetch(`https://photon.komoot.io/api/?limit=1&q=${encodeURIComponent(address)}`)
  if (!request.ok) throw new Error(`Fallback geocoding failed for ${address}: ${request.status}`)
  const result = (await request.json()).features?.[0]
  if (!result) return null
  const [longitude, latitude] = result.geometry.coordinates
  return { latitude: Number(latitude), longitude: Number(longitude) }
}

async function geocode(address) {
  if (cache.has(address)) return cache.get(address)
  if (usAddress.test(address)) {
    const coordinates = await geocodeUsAddress(address)
    if (coordinates) {
      cache.set(address, coordinates)
      return coordinates
    }
  }
  const coordinates = await geocodePhoton(address)
  if (!coordinates) throw new Error(`No geocoding result for ${address}`)
  cache.set(address, coordinates)
  return coordinates
}

const mapLocations = {}
for (const rating of archive.ratings) {
  const location = locationFor(rating)
  if (!location) throw new Error(`No researched storefront location configured for ${rating.id}`)
  const [label, address] = location
  const coordinates = directCoordinates[label] ?? await geocode(address)
  mapLocations[rating.id] = { id: `${label}|${address}`, label, address, ...coordinates, source: 'location-research' }
}

await writeFile(outputUrl, `${JSON.stringify(mapLocations, null, 2)}\n`)
console.log(`Wrote ${Object.keys(mapLocations).length} researched storefront pins across ${new Set(Object.values(mapLocations).map((location) => location.id)).size} destinations.`)
