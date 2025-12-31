import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowUpRight, Clock } from "lucide-react"
import { getAllPosts, getAllPostTags } from "@/lib/markdown"
import { BlogFilters } from "@/components/blog-filters"

export default async function BlogPage() {
  const posts = getAllPosts()
  const allTags = getAllPostTags()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          {/* Header */}
          <div>
            <span className="text-xs font-medium tracking-wider text-coral">WRITING</span>
            <h1 className="mt-2 text-4xl font-bold text-foreground lg:text-5xl">BLOG</h1>
            <p className="mt-3 max-w-lg text-muted-foreground">
              Thoughts on software development, design, and building products.
            </p>
          </div>

          {/* Client-side filters */}
          <BlogFilters posts={posts} allTags={allTags} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
