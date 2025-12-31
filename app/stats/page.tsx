"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TrendingUp, Users, Code, GitBranch, GitCommit, Loader2 } from "lucide-react"
import { siteConfig, getGitHubStatsUrls } from "@/config/site"

// GitHub stats URLs from config
const githubUrls = getGitHubStatsUrls(siteConfig.social.github.username, siteConfig.colors)

interface GitHubStats {
  stats: {
    totalRepos: number
    totalStars: number
    recentCommits: number
    totalForks?: number
    contributedTo?: number
    estimatedTotalCommits?: number
    totalPRs?: number
  }
}

interface WakaTimeStats {
  data: {
    totalText: string
    dailyAverageText: string
    languages: { name: string }[]
  }
}

export default function StatsPage() {
  const [loading, setLoading] = useState(true)
  const [githubData, setGithubData] = useState<GitHubStats | null>(null)
  const [wakatimeStats, setWakatimeStats] = useState<WakaTimeStats | null>(null)
  const [contributionError, setContributionError] = useState(false)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [githubRes, wakatimeRes] = await Promise.all([
          fetch("/api/github-stats"),
          fetch("/api/wakatime-stats"),
        ])
        
        if (githubRes.ok) {
          const data = await githubRes.json()
          setGithubData(data)
        }
        if (wakatimeRes.ok) {
          const data = await wakatimeRes.json()
          setWakatimeStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const stats = [
    { label: "YEARS EXP", value: siteConfig.yearsExperience, icon: TrendingUp, color: "coral" },
    { label: "PROJECTS", value: siteConfig.projectsCount, icon: Code, color: "sage" },
    { label: "CLIENTS", value: siteConfig.clientsCount, icon: Users, color: "cream" },
    { label: "FOSS CONTRIB", value: siteConfig.fossContributions, icon: GitBranch, color: "card" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-14">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {/* Header Widget */}
            <div className="widget rounded-3xl bg-cream p-6 md:col-span-2">
              <span className="text-xs font-medium tracking-wider text-background/70">PAGE</span>
              <h1 className="mt-2 text-4xl font-bold text-background">STATS</h1>
            </div>

            {/* Main Stats Widgets */}
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className={`widget rounded-3xl p-6 ${
                    stat.color === "coral"
                      ? "bg-coral"
                      : stat.color === "sage"
                        ? "bg-sage"
                        : stat.color === "cream"
                          ? "bg-cream"
                          : "bg-card"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      stat.color === "coral" || stat.color === "sage" || stat.color === "cream"
                        ? "text-background/70"
                        : "text-muted-foreground"
                    }`}
                  />
                  <p
                    className={`mt-2 text-3xl font-bold ${
                      stat.color === "coral" || stat.color === "sage" || stat.color === "cream"
                        ? "text-background"
                        : "text-foreground"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p
                    className={`text-xs ${
                      stat.color === "coral" || stat.color === "sage" || stat.color === "cream"
                        ? "text-background/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {stat.label}
                  </p>
                </div>
              )
            })}

            {/* GitHub Contributions Graph */}
            {!contributionError && (
            <div className="widget rounded-3xl bg-card p-6 md:col-span-3 lg:col-span-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitCommit className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium tracking-wider text-muted-foreground">GITHUB CONTRIBUTIONS</span>
                </div>
                <a 
                  href={siteConfig.social.github.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-coral hover:underline"
                >
                  VIEW PROFILE →
                </a>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl">
                <img 
                  src={githubUrls.contributions} 
                  alt="GitHub Contribution Graph"
                  className="w-full"
                  onError={() => setContributionError(true)}
                />
              </div>
              <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="h-3 w-3 rounded-sm bg-muted" />
                  <div className="h-3 w-3 rounded-sm bg-coral/30" />
                  <div className="h-3 w-3 rounded-sm bg-coral/50" />
                  <div className="h-3 w-3 rounded-sm bg-coral/70" />
                  <div className="h-3 w-3 rounded-sm bg-coral" />
                </div>
                <span>More</span>
              </div>
            </div>
            )}

            {/* GitHub & WakaTime Stats */}
            <div className="widget rounded-3xl bg-card p-6 md:col-span-3 lg:col-span-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium tracking-wider text-muted-foreground">GITHUB & WAKATIME STATS</span>
                {wakatimeStats?.data?.totalText && (
                  <span className="text-xs text-coral">{wakatimeStats.data.totalText} coded</span>
                )}
              </div>
              
              {/* Quick Stats Row */}
              <div className="mt-4 grid gap-3 grid-cols-4 md:grid-cols-6">
                <div className="rounded-xl bg-muted p-3 text-center">
                  <p className="text-xl font-bold text-foreground">
                    {loading ? "—" : githubData?.stats?.totalRepos || 0}
                  </p>
                  <p className="text-[10px] text-muted-foreground">REPOS</p>
                </div>
                <div className="rounded-xl bg-muted p-3 text-center">
                  <p className="text-xl font-bold text-foreground">
                    {loading ? "—" : (githubData?.stats?.estimatedTotalCommits || githubData?.stats?.recentCommits || 0)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">COMMITS</p>
                </div>
                <div className="rounded-xl bg-muted p-3 text-center">
                  <p className="text-xl font-bold text-foreground">
                    {loading ? "—" : githubData?.stats?.totalStars || 0}
                  </p>
                  <p className="text-[10px] text-muted-foreground">STARS</p>
                </div>
                <div className="rounded-xl bg-muted p-3 text-center">
                  <p className="text-xl font-bold text-foreground">
                    {loading ? "—" : wakatimeStats?.data?.languages?.length || 0}
                  </p>
                  <p className="text-[10px] text-muted-foreground">LANGS</p>
                </div>
                {wakatimeStats?.data?.dailyAverageText && (
                  <>
                    <div className="col-span-2 md:col-span-1 rounded-xl bg-sage p-3 text-center">
                      <p className="text-xl font-bold text-sage-foreground">{wakatimeStats.data.dailyAverageText.replace(' hrs', 'h').replace(' mins', 'm')}</p>
                      <p className="text-[10px] text-sage-foreground/70">DAILY AVG</p>
                    </div>
                    <div className="col-span-2 md:col-span-1 rounded-xl bg-coral p-3 text-center">
                      <p className="text-xl font-bold text-background">{githubData?.stats?.totalPRs || 0}</p>
                      <p className="text-[10px] text-background/70">PRs</p>
                    </div>
                  </>
                )}
              </div>

              {/* Two Column Layout for Stats */}
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {/* GitHub Stats Card */}
                <div className="overflow-hidden rounded-xl">
                  <img 
                    src={githubUrls.stats}
                    alt="GitHub Stats"
                    className="w-full h-auto"
                  />
                </div>
                
                {/* GitHub Streak Stats */}
                <div className="overflow-hidden rounded-xl">
                  <img 
                    src={githubUrls.streak}
                    alt="GitHub Streak"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Activity Graph - Full Width but Compact */}
              <div className="mt-4 overflow-hidden rounded-xl">
                <img 
                  src={githubUrls.activity}
                  alt="GitHub Activity Graph"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
