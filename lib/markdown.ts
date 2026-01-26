import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Content directories
const BLOG_DIR = path.join(process.cwd(), 'content/blog')
const PROJECTS_DIR = path.join(process.cwd(), 'content/projects')

// Types
export interface BlogPost {
    slug: string
    title: string
    excerpt: string
    date: string
    image?: string
    tags: string[]
    readTime: string
    featured: boolean
    content: string
}

export interface ProjectDoc {
    slug: string
    title: string
    description: string
    image: string
    tags: string[]
    liveUrl: string
    githubUrl: string
    featured: boolean
    content: string
    source?: 'manual' | 'github'
    year?: string
}

// Blog Posts
export function getAllPosts(): Omit<BlogPost, 'content'>[] {
    // Ensure directory exists
    if (!fs.existsSync(BLOG_DIR)) {
        return []
    }

    const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'))

    const posts = files.map(filename => {
        const slug = filename.replace('.md', '')
        const filePath = path.join(BLOG_DIR, filename)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const { data } = matter(fileContent)

        return {
            slug,
            title: data.title || 'Untitled',
            excerpt: data.excerpt || '',
            date: data.date || '',
            image: data.image || '',
            tags: data.tags || [],
            readTime: data.readTime || '5 min read',
            featured: data.featured || false,
        }
    })

    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
    const filePath = path.join(BLOG_DIR, `${slug}.md`)

    if (!fs.existsSync(filePath)) {
        return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    return {
        slug,
        title: data.title || 'Untitled',
        excerpt: data.excerpt || '',
        date: data.date || '',
        image: data.image || '',
        tags: data.tags || [],
        readTime: data.readTime || '5 min read',
        featured: data.featured || false,
        content,
    }
}

export function getAllPostSlugs(): string[] {
    if (!fs.existsSync(BLOG_DIR)) {
        return []
    }
    return fs.readdirSync(BLOG_DIR)
        .filter(f => f.endsWith('.md'))
        .map(f => f.replace('.md', ''))
}

// Get all unique tags from posts
export function getAllPostTags(): string[] {
    const posts = getAllPosts()
    const tags = posts.flatMap(post => post.tags)
    return Array.from(new Set(tags))
}

// Projects
export function getAllProjectDocs(): Omit<ProjectDoc, 'content'>[] {
    if (!fs.existsSync(PROJECTS_DIR)) {
        return []
    }

    const files = fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.md'))

    const projects = files.map(filename => {
        const slug = filename.replace('.md', '')
        const filePath = path.join(PROJECTS_DIR, filename)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const { data } = matter(fileContent)

        // Extract year from year field or date field
        let year = data.year ? String(data.year) : undefined
        if (!year && data.date) {
            year = new Date(data.date).getFullYear().toString()
        }

        return {
            slug,
            title: data.title || 'Untitled',
            description: data.description || '',
            image: data.image || '/placeholder.svg?height=300&width=400',
            tags: data.tags || [],
            liveUrl: data.liveUrl || '#',
            githubUrl: data.githubUrl || '#',
            featured: data.featured || false,
            year,
        }
    })

    // Sort: featured first, then by year (newest), then title
    return projects.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        if (a.year && b.year) return b.year.localeCompare(a.year)
        return a.title.localeCompare(b.title)
    })
}

export function getProjectBySlug(slug: string): ProjectDoc | null {
    const filePath = path.join(PROJECTS_DIR, `${slug}.md`)

    if (!fs.existsSync(filePath)) {
        return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    // Extract year from year field or date field
    let year = data.year ? String(data.year) : undefined
    if (!year && data.date) {
        year = new Date(data.date).getFullYear().toString()
    }

    return {
        slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        image: data.image || '/placeholder.svg?height=300&width=400',
        tags: data.tags || [],
        liveUrl: data.liveUrl || '#',
        githubUrl: data.githubUrl || '#',
        featured: data.featured || false,
        content,
        year,
    }
}

export function getAllProjectSlugs(): string[] {
    if (!fs.existsSync(PROJECTS_DIR)) {
        return []
    }
    return fs.readdirSync(PROJECTS_DIR)
        .filter(f => f.endsWith('.md'))
        .map(f => f.replace('.md', ''))
}

// Get all unique tags from projects
export function getAllProjectTags(): string[] {
    const projects = getAllProjectDocs()
    const tags = projects.flatMap(project => project.tags)
    return Array.from(new Set(tags))
}
