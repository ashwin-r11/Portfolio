"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Clock, Search, LayoutGrid, List, X } from "lucide-react"

interface PostMeta {
    slug: string
    title: string
    excerpt: string
    date: string
    image: string
    tags: string[]
    readTime: string
    featured: boolean
}

interface BlogFiltersProps {
    posts: PostMeta[]
    allTags: string[]
}

export function BlogFilters({ posts, allTags }: BlogFiltersProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [showFilters, setShowFilters] = useState(false)

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesSearch = searchQuery === "" ||
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesTags = selectedTags.length === 0 ||
                selectedTags.some(tag => post.tags.includes(tag))

            return matchesSearch && matchesTags
        })
    }, [posts, searchQuery, selectedTags])

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
                            placeholder="Search posts by title, content, or tags..."
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

                    {/* Filter Toggle Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors ${showFilters ? 'bg-coral text-background border-coral' : 'bg-card text-foreground hover:bg-muted'
                            }`}
                    >
                        <List className="h-4 w-4" />
                        Filters
                        {selectedTags.length > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background text-[10px] font-bold text-coral">
                                {selectedTags.length}
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
                        <div>
                            <h4 className="mb-3 text-sm font-semibold text-foreground">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {allTags.map((tag) => (
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
                            </div>
                        </div>

                        {/* Reset Button */}
                        {(selectedTags.length > 0) && (
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
                Showing {filteredPosts.length} of {posts.length} posts
            </p>

            {/* Posts Grid/List */}
            {viewMode === "grid" ? (
                <div className="mt-6 columns-1 gap-4 md:columns-2 lg:columns-3">
                    {filteredPosts.map((post, index) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group mb-4 block break-inside-avoid overflow-hidden rounded-2xl bg-card transition-all hover:scale-[1.02]"
                        >
                            {/* Blog Cover Image */}
                            {post.image && (
                                <div className="relative aspect-video w-full overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            )}

                            <div className="p-6">
                                {post.featured && (
                                    <span className="mb-3 inline-block rounded-full bg-coral px-3 py-1 text-xs font-medium text-background">
                                        FEATURED
                                    </span>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="rounded-full border border-coral px-2.5 py-1 text-xs font-medium text-coral">{tag}</span>
                                    ))}
                                    {post.tags.length > 3 && (
                                        <span className="text-xs text-muted-foreground">+{post.tags.length - 3}</span>
                                    )}
                                </div>
                                <h3 className="mt-3 text-lg font-bold text-foreground group-hover:text-coral">{post.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span>{post.date}</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {post.readTime}
                                        </span>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:rotate-45 group-hover:text-coral" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="mt-6 space-y-4">
                    {filteredPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group flex flex-col gap-6 rounded-2xl bg-card p-6 transition-colors hover:bg-muted md:flex-row"
                        >
                            {/* Image (List View) */}
                            {post.image && (
                                <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl md:w-64">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    {post.featured && (
                                        <span className="rounded-full bg-coral px-3 py-1 text-xs font-medium text-background">
                                            FEATURED
                                        </span>
                                    )}
                                    {post.tags.map(tag => (
                                        <span key={tag} className="rounded-full border border-coral px-2.5 py-1 text-xs font-medium text-coral">{tag}</span>
                                    ))}
                                    <span className="ml-2 text-xs text-muted-foreground">{post.date}</span>
                                </div>
                                <h3 className="mt-2 text-xl font-bold text-foreground group-hover:text-coral">{post.title}</h3>
                                <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-4">
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" /> {post.readTime}
                                </span>
                                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:rotate-45 group-hover:text-coral" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {filteredPosts.length === 0 && (
                <div className="mt-12 text-center">
                    <p className="text-lg text-muted-foreground">No posts found matching your criteria.</p>
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
