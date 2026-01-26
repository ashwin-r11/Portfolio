import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getAllProjectTags } from "@/lib/markdown"
import { fetchAllGitHubProjects } from "@/lib/github"
import { githubProjects } from "@/config/github-projects"
import { technicalKeywords } from "@/config/tech-keywords"

export default async function SkillsPage() {
  // Get tags from manual projects
  const manualTags = getAllProjectTags()

  // Get tags from GitHub projects
  const githubProjectsData = await fetchAllGitHubProjects(githubProjects)
  const githubTags = githubProjectsData.flatMap(p => p.tags)

  // Combine all raw tags from all projects
  const allProjectTags = [...manualTags, ...githubTags].map(t => t.toLowerCase())

  // Only include items from the technicalKeywords whitelist that actually appear in project tags
  const filteredSkills = technicalKeywords
    .filter(keyword =>
      allProjectTags.some(tag => tag === keyword.toLowerCase() || tag === keyword.toLowerCase().replace(/ /g, '-'))
    )

  // Deduplicate and sort
  const skills = [...new Set(filteredSkills)].sort((a, b) => a.localeCompare(b))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-14">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
          <div className="grid gap-4">
            {/* Header Widget */}
            <div className="widget rounded-3xl bg-coral p-6">
              <span className="text-xs font-medium tracking-wider text-background/70">PAGE</span>
              <h1 className="mt-2 text-4xl font-bold text-background">SKILLS</h1>
              <p className="mt-2 text-sm text-background/70">Technologies I work with</p>
            </div>

            {/* Tools & Frameworks - Dynamic from all project tags */}
            <div className="widget rounded-3xl bg-muted p-6">
              <span className="text-xs font-medium tracking-wider text-muted-foreground">TOOLS & FRAMEWORKS</span>
              <p className="mt-1 text-xs text-muted-foreground/70">Click to view related projects</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <Link
                      key={skill}
                      href={`/projects?tag=${encodeURIComponent(skill)}`}
                      className="rounded-xl bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-coral hover:text-background"
                    >
                      {skill}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills yet. Add tags to your projects!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
