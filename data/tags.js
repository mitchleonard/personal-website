// Canonical tag list and brand-color assignments.
//
// Tags fall into two buckets: WORK (case studies) and PROJECTS (personal builds).
// Each tag is mapped to a brand-color key consumed by TagPill. If a tag isn't
// listed here, TagPill falls back to a stable hash of the tag name so the pill
// still gets a consistent color — but explicit is better.

// Work / case-study tags
export const WORK_TAGS = {
  'AI Enablement':            'cornflower',
  'Change Leadership':        'tangerine',
  'Enterprise Strategy':      'neutral',
  'Integrated Campaign':      'frozen-lake',
  'Executive Communications': 'cornflower',
  'Event Marketing':          'banana',
  'Social Media Strategy':    'frozen-lake',
  'Brand Campaign':           'tangerine',
  'Paid & Organic':           'yellow-green',
  'Content Strategy':         'banana',
  'Brand Marketing':          'tangerine',
  'Brand Launch':             'tangerine',
  'Corporate Communications': 'neutral',
}

// Personal-project tags
export const PROJECT_TAGS = {
  'Claude Skills':  'cornflower',
  'Documentation':  'neutral',
  'Hackathon':      'tangerine',
  'MCP Servers':    'cornflower',
  'Dashboard':      'yellow-green',
  'Full Stack':     'cornflower',
  'React':          'frozen-lake',
  'PWA':            'yellow-green',
  'TypeScript':     'frozen-lake',
  'Mobile-First':   'yellow-green',
  'Health Tech':    'yellow-green',
  'Firebase':       'tangerine',
  'JavaScript':     'banana',
  'Game Design':    'tangerine',
  'Canvas API':     'cornflower',
  'Leaderboard':    'neutral',
  'Microsite':      'frozen-lake',
  'Game Dev':       'tangerine',
}

const ALL_TAGS = { ...WORK_TAGS, ...PROJECT_TAGS }

const FALLBACK_KEYS = ['banana', 'frozen-lake', 'tangerine', 'yellow-green', 'cornflower', 'neutral']

export function colorKeyForTag(tag) {
  if (ALL_TAGS[tag]) return ALL_TAGS[tag]
  let h = 0
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) >>> 0
  return FALLBACK_KEYS[h % FALLBACK_KEYS.length]
}
