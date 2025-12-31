import { NextResponse } from "next/server"
import { siteConfig } from "@/config/site"

const GITHUB_USERNAME = siteConfig.social.github.username

interface GitHubRepo {
  name: string
  language: string | null
  stargazers_count: number
  forks_count: number
  size: number
}

interface GitHubEvent {
  type: string
  created_at: string
  repo: { name: string }
  payload: {
    commits?: { message: string }[]
  }
}

export async function GET() {
  try {
    const headers: HeadersInit = {
      "Accept": "application/vnd.github.v3+json",
    }
    
    // Add token if available for higher rate limits
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`
    }

    // Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    
    if (!userRes.ok) {
      throw new Error("Failed to fetch GitHub user")
    }
    
    const userData = await userRes.json()

    // Fetch all repos
    const reposRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      {
        headers,
        next: { revalidate: 3600 },
      }
    )
    
    const repos: GitHubRepo[] = reposRes.ok ? await reposRes.json() : []

    // Fetch recent events (commits, PRs, etc.)
    const eventsRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100`,
      {
        headers,
        next: { revalidate: 1800 }, // Cache for 30 min
      }
    )
    
    const events: GitHubEvent[] = eventsRes.ok ? await eventsRes.json() : []

    // Fetch PRs and Issues using GitHub Search API
    const [prsRes, issuesRes] = await Promise.all([
      fetch(
        `https://api.github.com/search/issues?q=author:${GITHUB_USERNAME}+type:pr`,
        { headers, next: { revalidate: 3600 } }
      ),
      fetch(
        `https://api.github.com/search/issues?q=author:${GITHUB_USERNAME}+type:issue`,
        { headers, next: { revalidate: 3600 } }
      ),
    ])

    const prsData = prsRes.ok ? await prsRes.json() : { total_count: 0 }
    const issuesData = issuesRes.ok ? await issuesRes.json() : { total_count: 0 }

    // Count unique repos contributed to (from events)
    const contributedRepos = new Set<string>()
    events.forEach((event) => {
      if (event.type === "PushEvent" || event.type === "PullRequestEvent") {
        contributedRepos.add(event.repo.name.split("/")[0])
      }
    })

    // Calculate language stats from repos
    const languageStats: Record<string, { repos: number; size: number; commits: number }> = {}
    
    repos.forEach((repo) => {
      if (repo.language) {
        if (!languageStats[repo.language]) {
          languageStats[repo.language] = { repos: 0, size: 0, commits: 0 }
        }
        languageStats[repo.language].repos += 1
        languageStats[repo.language].size += repo.size
      }
    })

    // Count commits from recent events per repo
    const commitsByRepo: Record<string, number> = {}
    events.forEach((event) => {
      if (event.type === "PushEvent" && event.payload.commits) {
        const repoName = event.repo.name
        commitsByRepo[repoName] = (commitsByRepo[repoName] || 0) + event.payload.commits.length
      }
    })

    // Estimate total commits (events only show recent 90 days)
    const recentCommits = events
      .filter((e) => e.type === "PushEvent")
      .reduce((sum, e) => sum + (e.payload.commits?.length || 0), 0)

    // Calculate total stars and forks
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0)

    return NextResponse.json({
      username: GITHUB_USERNAME,
      profile: {
        name: userData.name,
        avatar: userData.avatar_url,
        bio: userData.bio,
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
      },
      stats: {
        totalRepos: repos.length,
        totalStars,
        totalForks,
        recentCommits,
        totalPRs: prsData.total_count || 0,
        totalIssues: issuesData.total_count || 0,
        contributedTo: contributedRepos.size,
        // Estimated total commits (from profile contributions or fallback)
        estimatedTotalCommits: userData.public_repos * 25, // rough estimate
      },
      languageStats,
      recentActivity: events.slice(0, 10).map((e) => ({
        type: e.type,
        repo: e.repo.name,
        date: e.created_at,
      })),
    })
  } catch (error) {
    console.error("GitHub API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    )
  }
}
