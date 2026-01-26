import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getAllProjectDocs, getAllProjectTags } from "@/lib/markdown"
import { fetchAllGitHubProjects } from "@/lib/github"
import { githubProjects } from "@/config/github-projects"
import { ProjectFilters } from "@/components/project-filters"

export default async function ProjectsPage() {
  // Get manual projects from markdown files
  const manualProjects = getAllProjectDocs().map(p => ({
    ...p,
    source: 'manual' as const
  }))

  // Get GitHub projects (fetched at build time / ISR)
  const githubProjectsData = await fetchAllGitHubProjects(githubProjects)

  // Combine all projects
  const allProjects = [...manualProjects, ...githubProjectsData]

  // Sort: featured first, then by title
  allProjects.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return a.title.localeCompare(b.title)
  })

  // Get all unique tags from all projects
  const allTags = [...new Set(allProjects.flatMap(p => p.tags))]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          {/* Header */}
          <div>
            <span className="text-xs font-medium tracking-wider text-coral">PORTFOLIO</span>
            <h1 className="mt-2 text-4xl font-bold text-foreground lg:text-5xl">PROJECTS</h1>
            <p className="mt-3 max-w-lg text-muted-foreground">
              A selection of projects I've worked on, from full-stack applications to design systems.
            </p>
          </div>

          {/* Client-side filters */}
          <ProjectFilters projects={allProjects} allTags={allTags} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
