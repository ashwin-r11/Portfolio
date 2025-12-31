"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github, ArrowUpRight, Search, LayoutGrid, List, X } from "lucide-react"

interface ProjectMeta {
    slug: string
    title: string
    description: string
    image: string
    tags: string[]
    liveUrl: string
    githubUrl: string
    featured: boolean
}

interface ProjectFiltersProps {
    projects: ProjectMeta[]
    allTags: string[]
}

export function ProjectFilters({ projects, allTags }: ProjectFiltersProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = searchQuery === "" ||
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesTags = selectedTags.length === 0 ||
                selectedTags.some(tag => project.tags.includes(tag))

            return matchesSearch && matchesTags
        })
    }, [projects, searchQuery, selectedTags])

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        )
    }

    const clearFilters = () => {
        setSearchQuery("")
        setSelectedTags([])
    }

    return (
        <>
            {/* Search & Filters */}
            <div className="mt-8 space-y-4">
                {/* Search Bar */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search projects by title, description, or tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-coral"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* View Toggle */}
                    <div className="flex rounded-xl bg-card p-1">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`rounded-lg p-2 transition-colors ${viewMode === "grid" ? "bg-coral text-background" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`rounded-lg p-2 transition-colors ${viewMode === "list" ? "bg-coral text-background" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">Technologies:</span>
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${selectedTags.includes(tag)
                                    ? "bg-coral text-background"
                                    : "bg-card text-foreground hover:bg-muted"
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                    {(selectedTags.length > 0 || searchQuery) && (
                        <button
                            onClick={clearFilters}
                            className="ml-2 text-xs text-coral hover:underline"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            {/* Results Count */}
            <p className="mt-6 text-sm text-muted-foreground">
                Showing {filteredProjects.length} of {projects.length} projects
            </p>

            {/* Projects Grid/List */}
            {viewMode === "grid" ? (
                <div className="mt-6 columns-1 gap-4 md:columns-2 lg:columns-3">
                    {filteredProjects.map((project, index) => (
                        <Link
                            key={project.slug}
                            href={`/projects/${project.slug}`}
                            className="group mb-4 block break-inside-avoid overflow-hidden rounded-2xl bg-card transition-all hover:scale-[1.02]"
                            style={{
                                minHeight: project.featured ? "380px" : index % 4 === 0 ? "320px" : index % 3 === 0 ? "280px" : index % 2 === 0 ? "300px" : "260px"
                            }}
                        >
                            {/* Project Image */}
                            <div className="relative aspect-video w-full overflow-hidden">
                                <Image
                                    src={project.image || "/placeholder.svg"}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {project.featured && (
                                    <div className="absolute left-3 top-3 rounded-full bg-coral px-3 py-1 text-xs font-medium text-background">
                                        FEATURED
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                            </div>

                            {/* Project Info */}
                            <div className="p-5">
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span key={tag} className="rounded-full border border-coral px-2.5 py-1 text-xs font-medium text-coral">{tag}</span>
                                    ))}
                                </div>
                                <h3 className="mt-3 text-lg font-bold text-foreground group-hover:text-coral">{project.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{project.description}</p>

                                {/* View More Arrow */}
                                <div className="mt-4 flex items-center gap-2 text-sm text-coral">
                                    <span>View Details</span>
                                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="mt-6 space-y-4">
                    {filteredProjects.map((project) => (
                        <Link
                            key={project.slug}
                            href={`/projects/${project.slug}`}
                            className="group flex flex-col gap-6 rounded-2xl bg-card p-6 transition-colors hover:bg-muted md:flex-row"
                        >
                            {/* Image */}
                            <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl md:w-64">
                                <Image
                                    src={project.image || "/placeholder.svg"}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                />
                                {project.featured && (
                                    <div className="absolute left-2 top-2 rounded-full bg-coral px-2 py-0.5 text-xs font-medium text-background">
                                        FEATURED
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex flex-1 flex-col justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {project.tags.map((tag) => (
                                            <span key={tag} className="rounded-full border border-coral px-2.5 py-1 text-xs font-medium text-coral">{tag}</span>
                                        ))}
                                    </div>
                                    <h3 className="mt-2 text-xl font-bold text-foreground group-hover:text-coral">{project.title}</h3>
                                    <p className="mt-2 text-muted-foreground">{project.description}</p>
                                </div>

                                {/* View More */}
                                <div className="mt-4 flex items-center gap-2 text-coral">
                                    <span>View Details</span>
                                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {filteredProjects.length === 0 && (
                <div className="mt-12 text-center">
                    <p className="text-lg text-muted-foreground">No projects found matching your criteria.</p>
                    <button
                        onClick={clearFilters}
                        className="mt-4 text-coral hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </>
    )
}
