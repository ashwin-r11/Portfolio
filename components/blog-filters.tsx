"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowUpRight, Clock, Search, LayoutGrid, List, X } from "lucide-react"

interface PostMeta {
    slug: string
    title: string
    excerpt: string
    date: string
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
                    <span className="text-xs text-muted-foreground">Tags:</span>
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
                Showing {filteredPosts.length} of {posts.length} posts
            </p>

            {/* Posts Grid/List */}
            {viewMode === "grid" ? (
                <div className="mt-6 columns-1 gap-4 md:columns-2 lg:columns-3">
                    {filteredPosts.map((post, index) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group mb-4 block break-inside-avoid rounded-2xl bg-card p-6 transition-all hover:bg-muted hover:scale-[1.02]"
                            style={{
                                // Varying heights for masonry effect
                                minHeight: post.featured ? "280px" : index % 3 === 0 ? "220px" : index % 2 === 0 ? "180px" : "200px"
                            }}
                        >
                            {post.featured && (
                                <span className="mb-3 inline-block rounded-full bg-coral px-3 py-1 text-xs font-medium text-background">
                                    FEATURED
                                </span>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <span key={tag} className="text-xs font-medium text-coral">{tag}</span>
                                ))}
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
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="mt-6 space-y-4">
                    {filteredPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group flex flex-col gap-4 rounded-2xl bg-card p-6 transition-colors hover:bg-muted md:flex-row md:items-center md:justify-between"
                        >
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    {post.featured && (
                                        <span className="rounded-full bg-coral px-3 py-1 text-xs font-medium text-background">
                                            FEATURED
                                        </span>
                                    )}
                                    {post.tags.map(tag => (
                                        <span key={tag} className="text-xs font-medium text-coral">{tag}</span>
                                    ))}
                                    <span className="text-xs text-muted-foreground">{post.date}</span>
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
