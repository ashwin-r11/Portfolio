"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { siteConfig, getGitHubStatsUrls } from "@/config/site"
import { 
  Zap, Star, Trophy, Flame, Code, GitCommit, X, Loader2,
  // Language icons
  FileCode, Coffee, Cog, Cpu, BarChart3, 
  FileJson, FileText, FileType, Settings, Braces,
  // Diamond for TypeScript
  Diamond
} from "lucide-react"

// GitHub stats URLs from config
const githubUrls = getGitHubStatsUrls(siteConfig.social.github.username, siteConfig.colors)

// Types for API responses
interface WakaTimeLanguage {
  name: string
  totalSeconds: number
  percent: number
  text: string
  hours: number
  xp: number
}

interface WakaTimeStats {
  success?: boolean
  mockData?: boolean
  data: {
    totalSeconds: number
    totalHours: number
    totalText: string
    dailyAverage: number
    dailyAverageText: string
    languages: WakaTimeLanguage[]
  }
}

interface GitHubStats {
  stats: {
    totalRepos: number
    totalStars: number
    recentCommits: number
  }
  languageStats: Record<string, { repos: number; size: number }>
}

// Language icon mapping - expanded for dynamic languages
const languageIcons: Record<string, React.ReactNode> = {
  "Python": <FileCode className="h-6 w-6 text-coral" />,
  "Java": <Coffee className="h-6 w-6 text-coral" />,
  "Rust": <Cog className="h-6 w-6 text-coral" />,
  "C": <Cpu className="h-6 w-6 text-coral" />,
  "C++": <Cpu className="h-6 w-6 text-coral" />,
  "C/C++": <Cpu className="h-6 w-6 text-coral" />,
  "R": <BarChart3 className="h-6 w-6 text-coral" />,
  "JavaScript": <FileJson className="h-6 w-6 text-yellow-500" />,
  "TypeScript": <Diamond className="h-6 w-6 text-blue-500" />,
  "TSX": <Diamond className="h-6 w-6 text-blue-500" />,
  "JSX": <FileJson className="h-6 w-6 text-yellow-500" />,
  "SQL": <Braces className="h-6 w-6 text-coral" />,
  "Markdown": <FileText className="h-6 w-6 text-muted-foreground" />,
  "LaTeX": <FileType className="h-6 w-6 text-muted-foreground" />,
  "TeX": <FileType className="h-6 w-6 text-muted-foreground" />,
  "YAML": <Settings className="h-6 w-6 text-muted-foreground" />,
  "JSON": <Braces className="h-6 w-6 text-muted-foreground" />,
  "HTML": <FileCode className="h-6 w-6 text-orange-500" />,
  "CSS": <FileCode className="h-6 w-6 text-blue-400" />,
  "SCSS": <FileCode className="h-6 w-6 text-pink-400" />,
  "Shell": <Settings className="h-6 w-6 text-green-500" />,
  "Bash": <Settings className="h-6 w-6 text-green-500" />,
  "Go": <Code className="h-6 w-6 text-cyan-500" />,
  "Kotlin": <Coffee className="h-6 w-6 text-purple-500" />,
  "Swift": <Code className="h-6 w-6 text-orange-400" />,
  "Dart": <Code className="h-6 w-6 text-cyan-400" />,
  "Vue.js": <FileCode className="h-6 w-6 text-green-500" />,
  "PHP": <FileCode className="h-6 w-6 text-purple-400" />,
  "Ruby": <Diamond className="h-6 w-6 text-red-500" />,
  "Scala": <Coffee className="h-6 w-6 text-red-400" />,
  "Haskell": <Code className="h-6 w-6 text-purple-500" />,
  "Lua": <Code className="h-6 w-6 text-blue-600" />,
  "Perl": <Code className="h-6 w-6 text-blue-400" />,
  "TOML": <Settings className="h-6 w-6 text-muted-foreground" />,
  "XML": <FileCode className="h-6 w-6 text-orange-400" />,
  "GraphQL": <Braces className="h-6 w-6 text-pink-500" />,
  "Dockerfile": <Settings className="h-6 w-6 text-blue-500" />,
  "Docker": <Settings className="h-6 w-6 text-blue-500" />,
}

// Gamified skill system - XP based on WakaTime hours (hours * 10)
// Levels: 1-10 (Novice) | 11-25 (Apprentice) | 26-50 (Journeyman) | 51-75 (Expert) | 76-99 (Master) | 100 (Grandmaster)
const getLevelInfo = (xp: number) => {
  if (xp >= 10000) return { level: 100, title: "GRANDMASTER", color: "bg-gradient-to-r from-coral to-sage", nextXp: 10000 }
  if (xp >= 7500) return { level: Math.floor(76 + (xp - 7500) / 104), title: "MASTER", color: "bg-coral", nextXp: 10000 }
  if (xp >= 5000) return { level: Math.floor(51 + (xp - 5000) / 100), title: "EXPERT", color: "bg-sage", nextXp: 7500 }
  if (xp >= 2500) return { level: Math.floor(26 + (xp - 2500) / 100), title: "JOURNEYMAN", color: "bg-cream", nextXp: 5000 }
  if (xp >= 1000) return { level: Math.floor(11 + (xp - 1000) / 100), title: "APPRENTICE", color: "bg-muted-foreground", nextXp: 2500 }
  return { level: Math.max(1, Math.floor(1 + xp / 100)), title: "NOVICE", color: "bg-muted", nextXp: 1000 }
}

// Format time from WakaTime
const formatTime = (text: string) => {
  // WakaTime returns like "10 hrs 30 mins" - simplify to "10h 30m"
  return text
    .replace(' hrs', 'h')
    .replace(' hr', 'h')
    .replace(' mins', 'm')
    .replace(' min', 'm')
    .replace(' secs', 's')
    .replace(' sec', 's')
}

// Tools & Frameworks (static)
const tools = [
  { name: "Git", xp: 6000 },
  { name: "Docker", xp: 3500 },
  { name: "Linux", xp: 5500 },
  { name: "VSCode", xp: 7000 },
  { name: "Vim", xp: 4000 },
  { name: "React", xp: 4200 },
  { name: "Next.js", xp: 3800 },
  { name: "Node.js", xp: 4500 },
  { name: "PostgreSQL", xp: 3200 },
  { name: "MongoDB", xp: 2500 },
  { name: "AWS", xp: 2800 },
  { name: "Vercel", xp: 2200 },
]

const toolsXP = tools.reduce((sum, t) => sum + t.xp, 0)

// Rank data for modal
const rankData = [
  { title: "NOVICE", levels: "1-10", xp: "0 - 1,000", color: "bg-muted", description: "Just getting started" },
  { title: "APPRENTICE", levels: "11-25", xp: "1,000 - 2,500", color: "bg-muted-foreground", description: "Learning the basics" },
  { title: "JOURNEYMAN", levels: "26-50", xp: "2,500 - 5,000", color: "bg-cream", description: "Building experience" },
  { title: "EXPERT", levels: "51-75", xp: "5,000 - 7,500", color: "bg-sage", description: "Highly proficient" },
  { title: "MASTER", levels: "76-99", xp: "7,500 - 10,000", color: "bg-coral", description: "Top-tier skills" },
  { title: "GRANDMASTER", levels: "100", xp: "10,000+", color: "bg-gradient-to-r from-coral to-sage", description: "Legendary mastery" },
]

export default function SkillsPage() {
  const [showRankModal, setShowRankModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [wakatimeStats, setWakatimeStats] = useState<WakaTimeStats | null>(null)
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null)

  // Fetch data on mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const [wakatimeRes, githubRes] = await Promise.all([
          fetch("/api/wakatime-stats"),
          fetch("/api/github-stats"),
        ])

        if (wakatimeRes.ok) {
          const data = await wakatimeRes.json()
          setWakatimeStats(data)
        }

        if (githubRes.ok) {
          const data = await githubRes.json()
          setGithubStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Calculate dynamic values - sort by XP descending
  const languages = [...(wakatimeStats?.data?.languages || [])].sort((a, b) => b.xp - a.xp)
  const languageXP = languages.reduce((sum, lang) => sum + lang.xp, 0)
  const totalXP = languageXP + toolsXP
  const totalCommits = githubStats?.stats?.recentCommits || 227
  const overallLevel = getLevelInfo(totalXP / Math.max(languages.length + tools.length, 1))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Rank Modal */}
      {showRankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowRankModal(false)}
          />
          
          {/* Modal */}
          <div className="relative z-10 w-full max-w-lg rounded-3xl bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-coral" />
                <h2 className="text-xl font-bold text-foreground">RANK SYSTEM</h2>
              </div>
              <button 
                onClick={() => setShowRankModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-coral hover:text-background transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <p className="mt-2 text-sm text-muted-foreground">
              Level up by gaining XP through coding hours and lines written
            </p>

            <div className="mt-6 space-y-3">
              {rankData.map((rank, index) => (
                <div 
                  key={rank.title}
                  className={`flex items-center gap-4 rounded-2xl p-4 transition-all ${
                    overallLevel.title === rank.title ? "bg-muted ring-2 ring-coral" : "bg-muted/50"
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${rank.color} text-lg font-bold text-background`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground">{rank.title}</h3>
                      {overallLevel.title === rank.title && (
                        <span className="rounded-full bg-coral px-2 py-0.5 text-[10px] font-bold text-background">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{rank.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">LVL {rank.levels}</p>
                    <p className="text-xs text-muted-foreground">{rank.xp} XP</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-muted p-4">
              <p className="text-xs text-muted-foreground">
                <span className="font-bold text-coral">XP FORMULA:</span> Coding Hours × 10 (tracked via WakaTime)
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="pt-14">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {/* Header Widget */}
            <div className="widget rounded-3xl bg-coral p-6 md:col-span-2">
              <span className="text-xs font-medium tracking-wider text-background/70">PAGE</span>
              <h1 className="mt-2 text-4xl font-bold text-background">SKILL TREE</h1>
              <p className="mt-2 text-sm text-background/70">Level up your abilities</p>
            </div>

            {/* Overall Level Widget - Clickable */}
            <button 
              onClick={() => setShowRankModal(true)}
              className="widget flex flex-col items-center justify-center rounded-3xl bg-card p-6 transition-all hover:bg-muted hover:scale-[1.02] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-coral" />
                <span className="text-xs font-medium tracking-wider text-muted-foreground">OVERALL</span>
              </div>
              <span className="mt-2 text-4xl font-bold text-foreground">LVL {overallLevel.level}</span>
              <span className="text-xs text-coral">{overallLevel.title}</span>
              <span className="mt-2 text-[10px] text-muted-foreground">CLICK FOR RANKS</span>
            </button>

            {/* Total XP Widget */}
            <div className="widget rounded-3xl bg-sage p-6">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-sage-foreground" />
                <span className="text-xs font-medium tracking-wider text-sage-foreground/70">TOTAL XP</span>
              </div>
              {loading ? (
                <Loader2 className="mt-2 h-6 w-6 animate-spin text-sage-foreground" />
              ) : (
                <>
                  <p className="mt-2 text-3xl font-bold text-sage-foreground">{(totalXP / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-sage-foreground/70">{totalCommits}+ COMMITS</p>
                </>
              )}
            </div>

            {/* Gamified Skills - Main Section */}
            <div className="widget rounded-3xl bg-card p-6 md:col-span-3 lg:col-span-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium tracking-wider text-muted-foreground">PROGRAMMING LANGUAGES</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3" /> XP</span>
                  <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> TIME</span>
                </div>
              </div>
              
              {loading ? (
                <div className="mt-6 flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-coral" />
                </div>
              ) : languages.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {languages.map((lang) => {
                    const levelInfo = getLevelInfo(lang.xp)
                    const repoCount = githubStats?.languageStats?.[lang.name]?.repos || 0
                    
                    return (
                      <div 
                        key={lang.name}
                        className="group relative rounded-2xl bg-muted p-4 transition-all hover:bg-muted/80"
                      >
                        {/* Level Badge - Positioned inside the card */}
                        <div className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full ${levelInfo.color} text-xs font-bold text-background shadow-lg`}>
                          {levelInfo.level}
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/50">
                            {languageIcons[lang.name] || <Code className="h-6 w-6 text-muted-foreground" />}
                          </div>
                          <div className="flex-1 pr-8">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-foreground">{lang.name}</h3>
                            </div>
                            <p className="text-xs text-coral">{levelInfo.title}</p>
                            
                            {/* XP Bar */}
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{lang.xp.toLocaleString()} XP</span>
                              </div>
                              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-background">
                                <div 
                                  className={`h-full rounded-full ${levelInfo.color} transition-all duration-500`}
                                  style={{ width: `${Math.min((lang.xp / levelInfo.nextXp) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                            
                            {/* Stats */}
                            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Flame className="h-3 w-3" /> {formatTime(lang.text)}
                              </span>
                              {repoCount > 0 && <span>{repoCount} repos</span>}
                              <span className="text-coral">{lang.percent.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="mt-6 text-center text-muted-foreground py-8">
                  <p>No WakaTime data available yet. Start coding!</p>
                </div>
              )}
            </div>

            {/* Top Languages from GitHub - Real Data */}
            <div className="widget rounded-3xl bg-card p-6 md:col-span-2">
              <span className="text-xs font-medium tracking-wider text-muted-foreground">TOP LANGUAGES (GITHUB)</span>
              <div className="mt-4 overflow-hidden rounded-xl">
                <img 
                  src={githubUrls.topLangs}
                  alt="Top Languages"
                  className="w-full"
                />
              </div>
            </div>

            {/* Tools & Frameworks */}
            <div className="widget rounded-3xl bg-muted p-6 md:col-span-2">
              <span className="text-xs font-medium tracking-wider text-muted-foreground">TOOLS & FRAMEWORKS</span>
              <div className="mt-4 flex flex-wrap gap-2">
                {tools.map((tool) => {
                  const levelInfo = getLevelInfo(tool.xp)
                  return (
                    <div
                      key={tool.name}
                      className="group relative flex items-center gap-2 rounded-xl bg-card px-3 py-2 transition-all hover:bg-coral hover:text-background"
                    >
                      <span className="text-sm font-medium">{tool.name}</span>
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full ${levelInfo.color} text-[10px] font-bold text-background`}>
                        {levelInfo.level}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
