import { NextResponse } from 'next/server'
import { getAllProjectDocs, getAllProjectTags } from '@/lib/markdown'
import { fetchAllGitHubProjects } from '@/lib/github'
import { githubProjects } from '@/config/github-projects'

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
    try {
        // Get manual projects from markdown files
        const manualProjects = getAllProjectDocs().map(p => ({
            ...p,
            source: 'manual' as const
        }))

        // Get GitHub projects
        const githubProjectsData = await fetchAllGitHubProjects(githubProjects)

        // Combine all projects
        const allProjects = [...manualProjects, ...githubProjectsData]

        // Sort: featured first, then by title
        allProjects.sort((a, b) => {
            if (a.featured && !b.featured) return -1
            if (!a.featured && b.featured) return 1
            return a.title.localeCompare(b.title)
        })

        // Get all unique tags
        const allTags = [...new Set(allProjects.flatMap(p => p.tags))]

        return NextResponse.json({
            projects: allProjects,
            tags: allTags
        })
    } catch (error) {
        console.error('Error fetching projects:', error)
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        )
    }
}
