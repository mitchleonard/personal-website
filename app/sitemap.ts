import { MetadataRoute } from 'next'
import { caseStudies } from '@/data/caseStudies'
import { projects } from '@/data/projects'

const BASE = 'https://mitchleonard.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, priority: 1.0 },
    { url: `${BASE}/about`, priority: 0.9 },
    { url: `${BASE}/cv`, priority: 0.8 },
    { url: `${BASE}/hire`, priority: 0.8 },
    { url: `${BASE}/projects`, priority: 0.7 },
    { url: `${BASE}/contact`, priority: 0.7 },
  ].map(({ url, priority }) => ({
    url,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority,
  }))

  const caseStudyPages = caseStudies
    .filter((cs) => cs.published !== false)
    .map((cs) => ({
      url: `${BASE}/work/${cs.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  const projectPages = projects.map((p) => ({
    url: `${BASE}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...caseStudyPages, ...projectPages]
}
