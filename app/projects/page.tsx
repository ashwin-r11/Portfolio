import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getAllProjectDocs, getAllProjectTags } from "@/lib/markdown"
import { ProjectFilters } from "@/components/project-filters"

export default async function ProjectsPage() {
  const projects = getAllProjectDocs()
  const allTags = getAllProjectTags()

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
          <ProjectFilters projects={projects} allTags={allTags} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
