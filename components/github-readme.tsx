'use client'

interface GitHubReadmeProps {
    html: string
}

/**
 * Component to render GitHub README HTML with proper styling
 * Uses dangerouslySetInnerHTML since the HTML comes from GitHub's trusted API
 */
export function GitHubReadme({ html }: GitHubReadmeProps) {
    return (
        <div
            className="github-readme prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}
