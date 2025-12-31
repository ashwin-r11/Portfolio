import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { getPostBySlug, getAllPostSlugs } from '@/lib/markdown'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/mdx-components'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'

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
                <article className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
                    {/* Back Link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-coral"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
                    </Link>

                    {/* Header */}
                    <header className="mt-8">
                        {post.featured && (
                            <span className="mb-4 inline-block rounded-full bg-coral px-3 py-1 text-xs font-medium text-background">
                                FEATURED
                            </span>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span key={tag} className="text-sm font-medium text-coral">
                                    {tag}
                                </span>
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
                                    rehypePlugins: [rehypeKatex, rehypeHighlight],
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
            </main>
            <Footer />
        </div>
    )
}
