"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
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
    source?: 'manual' | 'github'
    year?: string
}

interface ProjectFiltersProps {
    projects: ProjectMeta[]
    allTags: string[]
}

export function ProjectFilters({ projects, allTags }: ProjectFiltersProps) {
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [selectedYear, setSelectedYear] = useState<string | null>(null)
    const [selectedField, setSelectedField] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [showFilters, setShowFilters] = useState(false)

    // Extract unique years
    const years = useMemo(() => {
        const uniqueYears = new Set(projects.map(p => p.year).filter(Boolean))
        return Array.from(uniqueYears).sort().reverse() as string[]
    }, [projects])

    // Read tag from URL on mount
    useEffect(() => {
        const tagFromUrl = searchParams.get("tag")
        if (tagFromUrl && allTags.some(t => t.toLowerCase() === tagFromUrl.toLowerCase())) {
            const matchedTag = allTags.find(t => t.toLowerCase() === tagFromUrl.toLowerCase())
            if (matchedTag) setSelectedTags([matchedTag])
        }
    }, [searchParams, allTags])

    // Infer fields from project tags
    const getProjectField = (tags: string[]) => {
        const lowerTags = tags.map(t => t.toLowerCase())
        if (lowerTags.some(t => ["robotics", "ros", "ros2", "arduino", "esp32"].includes(t))) return "Robotics"
        if (lowerTags.some(t => ["ai", "ml", "machine learning", "deep learning", "pytorch", "tensorflow", "llm"].includes(t))) return "AI / ML"
        if (lowerTags.some(t => ["react", "next.js", "node.js", "web", "frontend", "backend"].includes(t))) return "Web Dev"
        return "Other"
    }

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = searchQuery === "" ||
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesTags = selectedTags.length === 0 ||
                selectedTags.every(tag => project.tags.includes(tag)) // AND logic for specific tags

            const matchesYear = !selectedYear || project.year === selectedYear

            const field = getProjectField(project.tags)
            const matchesField = !selectedField || field === selectedField

            return matchesSearch && matchesTags && matchesYear && matchesField
        })
    }, [projects, searchQuery, selectedTags, selectedYear, selectedField])

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        )
    }

    const clearFilters = () => {
        setSearchQuery("")
        setSelectedTags([])
        setSelectedYear(null)
        setSelectedField(null)
    }

    return (
        <>
            {/* Search & Toolbar */}
            <div className="mt-8 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-coral/20"
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

                    {/* Filter Toggle Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors ${showFilters ? 'bg-coral text-background border-coral' : 'bg-card text-foreground hover:bg-muted'
                            }`}
                    >
                        <List className="h-4 w-4" /> {/* Filter Icon Placeholder - List serves as Funnel here visually or replace with Funnel if available */}
                        Filters
                        {(selectedTags.length > 0 || selectedYear || selectedField) && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background text-[10px] font-bold text-coral">
                                {selectedTags.length + (selectedYear ? 1 : 0) + (selectedField ? 1 : 0)}
                            </span>
                        )}
                    </button>

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

                {/* Collapsible Filters Panel */}
                {showFilters && (
                    <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border animate-in slide-in-from-top-2 duration-200">
                        <div className="grid gap-6 md:grid-cols-3">
                            {/* Year Filter */}
                            <div>
                                <h4 className="mb-3 text-sm font-semibold text-foreground">Year</h4>
                                <div className="flex flex-wrap gap-2">
                                    {years.map(year => (
                                        <button
                                            key={year}
                                            onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${selectedYear === year
                                                ? "bg-coral text-background"
                                                : "bg-muted text-muted-foreground hover:text-foreground"
                                                }`}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Field Filter */}
                            <div>
                                <h4 className="mb-3 text-sm font-semibold text-foreground">Field</h4>
                                <div className="flex flex-wrap gap-2">
                                    {["Robotics", "AI / ML", "Web Dev"].map(field => (
                                        <button
                                            key={field}
                                            onClick={() => setSelectedField(selectedField === field ? null : field)}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${selectedField === field
                                                ? "bg-coral text-background"
                                                : "bg-muted text-muted-foreground hover:text-foreground"
                                                }`}
                                        >
                                            {field}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Active Tags */}
                            <div>
                                <h4 className="mb-3 text-sm font-semibold text-foreground">Tech Stack</h4>
                                <div className="flex flex-wrap gap-2">
                                    {allTags.slice(0, 15).map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${selectedTags.includes(tag)
                                                ? "bg-coral text-background"
                                                : "bg-muted text-muted-foreground hover:text-foreground"
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                    {allTags.length > 15 && (
                                        <span className="text-xs text-muted-foreground flex items-center px-2">
                                            + {allTags.length - 15} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reset Button */}
                        {(selectedTags.length > 0 || selectedYear || selectedField) && (
                            <div className="mt-6 flex justify-end border-t border-border pt-4">
                                <button
                                    onClick={clearFilters}
                                    className="text-sm font-medium text-coral hover:underline"
                                >
                                    Reset all filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Results Count */}
            <p className="mt-6 text-sm text-muted-foreground">
                Showing {filteredProjects.length} of {projects.length} projects
            </p>

            {/* View Mode Rendering (Grid/List) */}
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
                                    {project.tags.slice(0, 3).map((tag) => (
                                        <span key={tag} className="rounded-full border border-coral px-2.5 py-1 text-xs font-medium text-coral">{tag}</span>
                                    ))}
                                    {project.tags.length > 3 && (
                                        <span className="text-xs text-muted-foreground">+{project.tags.length - 3}</span>
                                    )}
                                </div>
                                <h3 className="mt-3 text-lg font-bold text-foreground group-hover:text-coral">{project.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="mt-4 flex items-center gap-2 text-sm text-coral">
                                        <span>View Details</span>
                                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                                    </div>
                                    {project.year && (
                                        <span className="text-xs font-mono text-muted-foreground/50 mt-4">{project.year}</span>
                                    )}
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
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {project.tags.map((tag) => (
                                                <span key={tag} className="rounded-full border border-coral px-2.5 py-1 text-xs font-medium text-coral">{tag}</span>
                                            ))}
                                        </div>
                                        {project.year && (
                                            <span className="text-xs font-mono text-muted-foreground">{project.year}</span>
                                        )}
                                    </div>
                                    <h3 className="mt-2 text-xl font-bold text-foreground group-hover:text-coral">{project.title}</h3>
                                    <p className="mt-2 text-muted-foreground">{project.description}</p>
                                </div>

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
