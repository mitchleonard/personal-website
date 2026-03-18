export const projects = []

export function getProject(slug) {
  return projects.find((p) => p.slug === slug)
}
