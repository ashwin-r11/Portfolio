import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { getPostBySlug, getAllPostSlugs } from '@/lib/markdown'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/mdx-components'
import { TableOfContents } from '@/components/table-of-contents'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

// Generate static paths for all blog posts
export async function generateStaticParams() {
    const slugs = getAllPostSlugs()
    return slugs.map((slug) => ({ slug }))
}

// Generate metadata for each post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = getPostBySlug(slug)
    if (!post) return { title: 'Post Not Found' }
    return {
        title: `${post.title} | Blog`,
        description: post.excerpt,
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-20">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
                    {/* Back Link */}
                    <Link
                        href="/blog"
                        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-coral"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
                    </Link>

                    <div className="grid gap-12 lg:grid-cols-[1fr_250px] lg:gap-16">
                        {/* Main Content */}
                        <article className="min-w-0">
                            {/* Header */}
                            <header className="mb-10">
                                {/* Cover Image */}
                                {post.image && (
                                    <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-muted">
                                        <div className="relative aspect-video w-full">
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        </div>
                                    </div>
                                )}

                                {post.featured && (
                                    <span className="mb-4 inline-block rounded-full bg-coral px-3 py-1 text-xs font-medium text-background">
                                        FEATURED
                                    </span>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <Link
                                            key={tag}
                                            href={`/blog?tag=${encodeURIComponent(tag)}`}
                                            className="rounded-full border border-coral px-3 py-1 text-sm font-medium text-coral hover:bg-coral hover:text-background transition-colors"
                                        >
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                                <h1 className="mt-4 text-3xl font-bold text-foreground lg:text-4xl xl:text-5xl">
                                    {post.title}
                                </h1>
                                <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
                                <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {post.date}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        {post.readTime}
                                    </span>
                                </div>
                            </header>

                            {/* Divider */}
                            <div className="my-10 h-px bg-border" />

                            {/* Content with enhanced MDX */}
                            <div className="prose prose-invert prose-coral max-w-none">
                                <MDXRemote
                                    source={post.content}
                                    components={mdxComponents}
                                    options={{
                                        mdxOptions: {
                                            remarkPlugins: [remarkGfm, remarkMath],
                                            rehypePlugins: [
                                                rehypeKatex,
                                                rehypeHighlight,
                                                rehypeSlug,
                                                [rehypeAutolinkHeadings, { behavior: 'wrap' }]
                                            ],
                                        }
                                    }}
                                />
                            </div>

                            {/* Footer Navigation */}
                            <div className="mt-16 pt-8 border-t border-border">
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center gap-2 text-coral transition-colors hover:underline"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to all posts
                                </Link>
                            </div>
                        </article>

                        {/* Sidebar TOC */}
                        <aside className="hidden lg:block">
                            <TableOfContents content={post.content} />
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
