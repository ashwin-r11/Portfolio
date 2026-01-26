import { GitHubProjectConfig } from '@/config/github-projects'

export interface GitHubRepoData {
    slug: string
    title: string
    description: string
    image: string
    tags: string[]
    liveUrl: string
    githubUrl: string
    featured: boolean
    content: string
    isHtml: boolean  // Content is pre-rendered HTML from GitHub
    source: 'github'
    year?: string // Year of creation
}

interface GitHubApiRepo {
    name: string
    full_name: string
    description: string | null
    html_url: string
    homepage: string | null
    topics: string[]
    language: string | null
    default_branch: string
    created_at: string
}

/**
 * Parse GitHub URL to extract owner and repo
 */
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/i)
    if (!match) return null
    return { owner: match[1], repo: match[2].replace(/\.git$/, '') }
}

/**
 * Fetch repository metadata from GitHub API
 */
async function fetchRepoMetadata(owner: string, repo: string): Promise<GitHubApiRepo | null> {
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Portfolio-App',
                // Add token if available for higher rate limits
                ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        })

        if (!response.ok) {
            console.error(`Failed to fetch repo ${owner}/${repo}:`, response.status)
            return null
        }

        return response.json()
    } catch (error) {
        console.error(`Error fetching repo ${owner}/${repo}:`, error)
        return null
    }
}

/**
 * Fetch README HTML content from GitHub API (pre-rendered like on GitHub)
 */
/**
 * Fetch README HTML content from GitHub API (pre-rendered like on GitHub)
 */
/**
 * Fetch README Markdown content from GitHub API
 */
async function fetchReadmeMarkdown(owner: string, repo: string, branch: string = 'HEAD'): Promise<string> {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/readme`,
            {
                headers: {
                    // Request RAW content (markdown)
                    'Accept': 'application/vnd.github.v3.raw',
                    'User-Agent': 'Portfolio-App',
                    ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
                },
                next: { revalidate: 3600 }
            }
        )

        if (response.ok) {
            let markdown = await response.text()
            // Fix relative URLs in Markdown
            markdown = fixGitHubMarkdownUrls(markdown, owner, repo, branch)
            // Sanitize
            return sanitizeForMDX(markdown)
        }

        return `# ${repo}\n\nNo README available.`
    } catch (error) {
        console.error(`Error fetching README for ${owner}/${repo}:`, error)
        return `# ${repo}\n\nFailed to fetch README.`
    }
}

/**
 * Fix relative URLs in GitHub Markdown to point to the actual repo
 */
function fixGitHubMarkdownUrls(markdown: string, owner: string, repo: string, branch: string): string {
    const baseRawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}`
    const baseGithubUrl = `https://github.com/${owner}/${repo}/blob/${branch}`

    return markdown
        // Fix relative images: ![alt](path) or <img src="path">
        .replace(/!\[([^\]]*)\]\((?!https?:\/\/)(?!\/\/)([^)]+)\)/g, `![$1](${baseRawUrl}/$2)`)
        .replace(/src="(?!https?:\/\/)(?!\/\/)([^"]+)"/g, `src="${baseRawUrl}/$1"`)
        // Fix relative links: [text](path)
        .replace(/\[([^\]]+)\]\((?!https?:\/\/)(?!\/\/)([^)]+)\)/g, (match, text, url) => {
            const isMedia = /\.(mp4|webm|ogg|mov|mp3|wav|jpg|jpeg|png|gif|svg|pdf)$/i.test(url)
            const baseUrl = isMedia ? baseRawUrl : baseGithubUrl
            return `[${text}](${baseUrl}/${url})`
        })
}

/**
 * Sanitize README content to be MDX-compatible
 * MDX requires self-closing tags and has issues with some HTML elements
 */
function sanitizeForMDX(content: string): string {
    let result = content

    // Remove HTML comments first
    result = result.replace(/<!--[\s\S]*?-->/g, '')

    // Convert <details>/<summary> to regular markdown (MDX has issues with these)
    result = result.replace(/<details[^>]*>[\s\S]*?<\/details>/gi, (match) => {
        // Extract summary content
        const summaryMatch = match.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)
        const summary = summaryMatch ? summaryMatch[1].trim() : 'Details'
        // Extract body content (everything after </summary> and before </details>)
        const bodyMatch = match.match(/<\/summary>([\s\S]*?)<\/details>/i)
        const body = bodyMatch ? bodyMatch[1].trim() : ''
        return `\n\n**${summary}**\n\n${body}\n\n`
    })

    // Handle self-closing void elements - be careful not to double-add slashes
    // First normalize: remove any existing self-closing slashes, then add them back properly
    result = result.replace(/<br\s*\/?>/gi, '<br />')
    result = result.replace(/<hr\s*\/?>/gi, '<hr />')

    // Handle img tags - normalize first
    result = result.replace(/<img([^>]*)\s*\/?>/gi, (match, attrs) => {
        // Clean up the attributes and ensure proper self-closing
        const cleanAttrs = attrs.trim().replace(/\/$/, '').trim()
        return `<img ${cleanAttrs} />`
    })

    // Handle other void elements
    result = result.replace(/<input([^>]*)\s*\/?>/gi, (match, attrs) => {
        const cleanAttrs = attrs.trim().replace(/\/$/, '').trim()
        return `<input ${cleanAttrs} />`
    })

    // Remove problematic HTML attributes that MDX doesn't handle well
    result = result.replace(/\s+align="[^"]*"/gi, '')
    result = result.replace(/\s+valign="[^"]*"/gi, '')
    result = result.replace(/\s+width="[^"]*"/gi, '')
    result = result.replace(/\s+height="[^"]*"/gi, '')
    result = result.replace(/\s+border="[^"]*"/gi, '')
    result = result.replace(/\s+cellspacing="[^"]*"/gi, '')
    result = result.replace(/\s+cellpadding="[^"]*"/gi, '')
    result = result.replace(/\s+style="[^"]*"/gi, '') // Fix: MDX/React doesn't accept string style prop

    return result
}

/**
 * Convert repo name to URL-safe slug
 */
function repoToSlug(repoName: string): string {
    return repoName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/**
 * Fetch a single GitHub project
 */
export async function fetchGitHubProject(config: GitHubProjectConfig): Promise<GitHubRepoData | null> {
    const parsed = parseGitHubUrl(config.url)
    if (!parsed) {
        console.error(`Invalid GitHub URL: ${config.url}`)
        return null
    }

    const { owner, repo } = parsed
    const metadata = await fetchRepoMetadata(owner, repo)

    if (!metadata) return null

    const readme = await fetchReadmeMarkdown(owner, repo, metadata.default_branch)

    // Generate tags from topics + language + extra tags
    const autoTags: string[] = [
        ...metadata.topics.map(t => t.charAt(0).toUpperCase() + t.slice(1).replace(/-/g, ' ')),
        ...(metadata.language ? [metadata.language] : []),
    ]
    const allTags = [...new Set([...autoTags, ...(config.extraTags || [])])]

    return {
        slug: `github-${repoToSlug(repo)}`,
        title: config.title || metadata.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        description: config.description || metadata.description || 'No description available.',
        image: config.image || `https://opengraph.githubassets.com/1/${owner}/${repo}`,
        tags: allTags,
        liveUrl: config.liveUrl !== undefined ? (config.liveUrl || '#') : (metadata.homepage || '#'),
        githubUrl: metadata.html_url,
        featured: config.featured || false,
        content: readme,
        isHtml: false, // MDX compatible
        source: 'github',
        year: metadata.created_at ? new Date(metadata.created_at).getFullYear().toString() : undefined
    }
}

/**
 * Fetch all GitHub projects from config
 */
export async function fetchAllGitHubProjects(configs: GitHubProjectConfig[]): Promise<GitHubRepoData[]> {
    const results = await Promise.all(configs.map(fetchGitHubProject))
    return results.filter((p): p is GitHubRepoData => p !== null)
}
