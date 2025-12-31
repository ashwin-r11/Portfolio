import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, ArrowRight, ExternalLink, Github } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { siteConfig } from "@/config/site"
import { getAllPosts, getAllProjectDocs } from "@/lib/markdown"

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3)
  const recentProjects = getAllProjectDocs().slice(0, 3)
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          {/* Hero Section - Content Dominant */}
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <span className="inline-block rounded-full bg-sage/20 px-3 py-1 text-xs font-medium tracking-wider text-sage">
                {siteConfig.tagline}
              </span>
              <h1 className="mt-6 text-5xl font-bold leading-[1.1] tracking-tight text-foreground lg:text-7xl">
                {siteConfig.name.first}
                <br />
                <span className="text-coral">{siteConfig.name.last}</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                {siteConfig.bio}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-2xl bg-coral px-6 py-3 text-sm font-bold text-background transition-transform hover:scale-105"
                >
                  VIEW PROJECTS <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/skills"
                  className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                >
                  SKILL TREE <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Side Widgets - Compact */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              {/* Status Widget */}
              <div className="rounded-2xl bg-card p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium tracking-wider text-muted-foreground">STATUS</span>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-sage" />
                </div>
                <p className="mt-2 text-lg font-bold text-foreground">{siteConfig.status}</p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-sage p-5">
                  <span className="text-3xl font-bold text-sage-foreground">{siteConfig.projectsCount}</span>
                  <p className="text-xs text-sage-foreground/70">PROJECTS</p>
                </div>
                <div className="rounded-2xl bg-coral p-5">
                  <span className="text-3xl font-bold text-background">{siteConfig.yearsExperience}</span>
                  <p className="text-xs text-background/70">YEARS EXP</p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="rounded-2xl bg-card p-5">
                <span className="text-xs font-medium tracking-wider text-muted-foreground">TECH STACK</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {siteConfig.techStack.map((tech) => (
                    <span key={tech} className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Section - Full Width Profile Card */}
          <div className="mt-12">
            {/* GitHub Profile Card */}
            <a
              href={siteConfig.social.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-2xl bg-card p-6 transition-all hover:bg-muted"
            >
              <picture>
                <source
                  media="(prefers-color-scheme: dark)"
                  srcSet={siteConfig.githubReadme.darkMode}
                />
                <img
                  alt={`${siteConfig.name.full}'s GitHub Profile`}
                  src={siteConfig.githubReadme.lightMode}
                  className="w-full rounded-xl"
                />
              </picture>
              <p className="mt-3 text-right text-sm italic text-muted-foreground">
                {siteConfig.githubReadme.tagline}
              </p>
            </a>
          </div>

          {/* Recent Posts Section */}
          <div className="mt-24">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">RECENT POSTS</h2>
              <Link href="/blog" className="flex items-center gap-1 text-sm text-coral hover:underline">
                VIEW ALL <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl bg-card p-6 transition-all hover:bg-muted"
                >
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs font-medium text-coral">{tag}</span>
                    ))}
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-foreground group-hover:text-coral">{post.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{post.date}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Projects Section */}
          <div className="mt-24">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">RECENT PROJECTS</h2>
              <Link href="/projects" className="flex items-center gap-1 text-sm text-coral hover:underline">
                VIEW ALL <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {recentProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group rounded-2xl bg-card p-6 transition-all hover:bg-muted"
                >
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full border border-coral px-2.5 py-1 text-xs font-medium text-coral">{tag}</span>
                    ))}
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-foreground group-hover:text-coral">{project.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-coral">
                    <span>View Details</span>
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:rotate-45" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
