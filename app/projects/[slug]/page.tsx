import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ArrowLeft, ExternalLink, Github } from 'lucide-react'
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/markdown'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/mdx-components'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'

// Generate static paths for all projects
export async function generateStaticParams() {
    const slugs = getAllProjectSlugs()
    return slugs.map((slug) => ({ slug }))
}

// Generate metadata for each project
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const project = getProjectBySlug(slug)
    if (!project) return { title: 'Project Not Found' }
    return {
        title: `${project.title} | Projects`,
        description: project.description,
    }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const project = getProjectBySlug(slug)

    if (!project) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-20">
                <article className="mx-auto max-w-4xl px-6 py-16 lg:py-24">
                    {/* Back Link */}
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-coral"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Projects
                    </Link>

                    {/* Hero Image */}
                    <div className="mt-8 relative aspect-video w-full overflow-hidden rounded-2xl">
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        {project.featured && (
                            <div className="absolute left-4 top-4 rounded-full bg-coral px-4 py-1.5 text-sm font-medium text-background">
                                FEATURED
                            </div>
                        )}
                    </div>

                    {/* Header */}
                    <header className="mt-8">
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-coral px-3 py-1 text-sm font-medium text-coral"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="mt-4 text-3xl font-bold text-foreground lg:text-4xl xl:text-5xl">
                            {project.title}
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">{project.description}</p>

                        {/* Action Links */}
                        <div className="mt-6 flex flex-wrap gap-4">
                            {project.liveUrl && project.liveUrl !== '#' && (
                                <Link
                                    href={project.liveUrl}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 rounded-xl bg-coral px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-coral/90"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Live Demo
                                </Link>
                            )}
                            {project.githubUrl && project.githubUrl !== '#' && (
                                <Link
                                    href={project.githubUrl}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 rounded-xl bg-muted px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
                                >
                                    <Github className="h-4 w-4" />
                                    View Source
                                </Link>
                            )}
                        </div>
                    </header>

                    {/* Divider */}
                    <div className="my-10 h-px bg-border" />

                    {/* Content with enhanced MDX */}
                    <div className="prose prose-invert prose-coral max-w-none">
                        <MDXRemote
                            source={project.content}
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
                            href="/projects"
                            className="inline-flex items-center gap-2 text-coral transition-colors hover:underline"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to all projects
                        </Link>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    )
}
