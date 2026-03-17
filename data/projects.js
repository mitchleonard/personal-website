export const projects = [
  {
    slug: 'baking-day',
    name: '2025 Baking Day',
    url: 'https://2025bakingday.mitchleonard.com',
    description: 'Custom family event site built for our annual Christmas baking day. Includes a fully playable Asteroids-style game with real difficulty scaling — it gets harder the longer you survive.',
    tags: ['JavaScript', 'Game Dev', 'Custom Web', 'UI/UX'],
  },
  {
    slug: 'moon-runner',
    name: 'Moon Runner',
    url: 'https://mitchleonard.github.io/moonrunner/',
    description: 'An endless runner game with a live leaderboard and genuine game theory built in. Not a template — designed and built from scratch.',
    tags: ['JavaScript', 'Game Design', 'Leaderboard', 'Animation'],
  },
  {
    slug: 'daily',
    name: 'Daily',
    url: 'https://daily.mitchleonard.com',
    description: 'A habit tracking app with a fully functional database backend and user authentication. Built because the existing apps were either too complex or too shallow.',
    tags: ['Full Stack', 'Auth', 'Database', 'Product Design'],
  },
  {
    slug: 'pebble-path',
    name: 'Pebble Path',
    url: 'https://pebble-path-app.web.app',
    description: 'A lightweight health tracker that removes the burden of calorie counting while giving users a simple, customizable interface they\'ll actually use.',
    tags: ['Mobile-First', 'Health Tech', 'UX', 'Firebase'],
  },
]

export function getProject(slug) {
  return projects.find((p) => p.slug === slug)
}
