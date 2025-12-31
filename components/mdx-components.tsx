import Image from 'next/image'
import Link from 'next/link'
import type { MDXComponents } from 'mdx/types'

// Custom Video component for embedding videos
function Video({ src, title }: { src: string; title?: string }) {
    // YouTube embed
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
        const videoId = src.includes('youtu.be')
            ? src.split('/').pop()
            : new URL(src).searchParams.get('v')
        return (
            <div className="my-6 aspect-video w-full overflow-hidden rounded-xl">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={title || 'YouTube video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                />
            </div>
        )
    }

    // Local or direct video file
    return (
        <video
            src={src}
            controls
            className="my-6 w-full rounded-xl"
            title={title}
        >
            Your browser does not support the video tag.
        </video>
    )
}

// Custom components for MDX
export const mdxComponents: MDXComponents = {
    // Enhanced image with Next.js optimization
    img: ({ src, alt, ...props }) => {
        if (!src) return null

        // Handle SVG
        if (src.endsWith('.svg')) {
            return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    alt={alt || ''}
                    className="my-6 max-w-full rounded-lg"
                    {...props}
                />
            )
        }

        return (
            <span className="block my-6">
                <Image
                    src={src}
                    alt={alt || ''}
                    width={800}
                    height={450}
                    className="rounded-xl"
                    {...props}
                />
            </span>
        )
    },

    // Enhanced links
    a: ({ href, children, ...props }) => {
        const isExternal = href?.startsWith('http')
        return (
            <Link
                href={href || '#'}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="text-coral underline underline-offset-2 hover:text-foreground transition-colors"
                {...props}
            >
                {children}
            </Link>
        )
    },

    // Video component
    Video,

    // Code blocks are handled by rehype-highlight
    pre: ({ children, ...props }) => (
        <pre
            className="my-6 overflow-x-auto rounded-xl bg-card p-5 border border-border"
            {...props}
        >
            {children}
        </pre>
    ),

    code: ({ className, children, ...props }) => {
        // Inline code (no language class)
        if (!className) {
            return (
                <code
                    className="rounded bg-muted px-1.5 py-0.5 text-sm text-coral font-mono"
                    {...props}
                >
                    {children}
                </code>
            )
        }
        // Code block (has language class from highlight)
        return (
            <code className={`${className} text-sm`} {...props}>
                {children}
            </code>
        )
    },

    // Tables - with improved styling
    table: ({ children, ...props }) => (
        <div className="my-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full border-collapse text-sm" {...props}>{children}</table>
        </div>
    ),

    thead: ({ children, ...props }) => (
        <thead className="bg-muted/50" {...props}>{children}</thead>
    ),

    tbody: ({ children, ...props }) => (
        <tbody className="divide-y divide-border" {...props}>{children}</tbody>
    ),

    th: ({ children, ...props }) => (
        <th className="px-4 py-3 text-left font-semibold text-foreground border-b-2 border-border" {...props}>{children}</th>
    ),

    td: ({ children, ...props }) => (
        <td className="px-4 py-3 text-foreground" {...props}>{children}</td>
    ),

    tr: ({ children, ...props }) => (
        <tr className="hover:bg-muted/30 transition-colors" {...props}>{children}</tr>
    ),

    // Blockquotes
    blockquote: ({ children }) => (
        <blockquote className="my-6 border-l-4 border-coral pl-5 italic text-muted-foreground">
            {children}
        </blockquote>
    ),

    // Horizontal rule
    hr: () => <hr className="my-8 border-border" />,
}
