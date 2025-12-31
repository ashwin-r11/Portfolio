import { NextResponse } from "next/server"

// WakaTime API integration
// You need to set up your WakaTime API key as an environment variable
// Get your API key from: https://wakatime.com/settings/api-key

export async function GET() {
  const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY
  
  // If no API key, return mock data with instructions
  if (!WAKATIME_API_KEY) {
    return NextResponse.json({
      error: "WakaTime API key not configured",
      instructions: "Add WAKATIME_API_KEY to your .env.local file",
      mockData: true,
      // Return mock data so the page still works
      data: {
        totalSeconds: 0,
        languages: [],
        editors: [],
        dailyAverage: 0,
      },
    })
  }

  try {
    // Encode API key for Basic auth
    const authHeader = `Basic ${Buffer.from(WAKATIME_API_KEY).toString("base64")}`

    // Fetch all-time stats
    const statsRes = await fetch(
      "https://wakatime.com/api/v1/users/current/all_time_since_today",
      {
        headers: { Authorization: authHeader },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )

    // Fetch language breakdown (last 7 days)
    const languagesRes = await fetch(
      "https://wakatime.com/api/v1/users/current/stats/last_7_days",
      {
        headers: { Authorization: authHeader },
        next: { revalidate: 1800 }, // Cache for 30 min
      }
    )

    // Fetch all-time language stats
    const allTimeRes = await fetch(
      "https://wakatime.com/api/v1/users/current/stats/all_time",
      {
        headers: { Authorization: authHeader },
        next: { revalidate: 3600 },
      }
    )

    const statsData = statsRes.ok ? await statsRes.json() : null
    const languagesData = languagesRes.ok ? await languagesRes.json() : null
    const allTimeData = allTimeRes.ok ? await allTimeRes.json() : null

    // Process language data
    const languages = (allTimeData?.data?.languages || languagesData?.data?.languages || []).map(
      (lang: { name: string; total_seconds: number; percent: number; text: string }) => ({
        name: lang.name,
        totalSeconds: lang.total_seconds,
        percent: lang.percent,
        text: lang.text, // Human readable time
      })
    )

    // Calculate XP based on coding time
    // XP formula: hours * 10
    const languagesWithXP = languages.map(
      (lang: { name: string; totalSeconds: number; percent: number; text: string }) => ({
        ...lang,
        hours: Math.round(lang.totalSeconds / 3600),
        xp: Math.round((lang.totalSeconds / 3600) * 10),
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        totalSeconds: statsData?.data?.total_seconds || 0,
        totalHours: Math.round((statsData?.data?.total_seconds || 0) / 3600),
        totalText: statsData?.data?.text || "0 hrs",
        dailyAverage: allTimeData?.data?.daily_average || 0,
        dailyAverageText: allTimeData?.data?.human_readable_daily_average || "0 hrs",
        languages: languagesWithXP,
        editors: allTimeData?.data?.editors || [],
        operatingSystems: allTimeData?.data?.operating_systems || [],
        range: allTimeData?.data?.range || {},
      },
    })
  } catch (error) {
    console.error("WakaTime API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch WakaTime data", mockData: true, data: { totalSeconds: 0, languages: [] } },
      { status: 500 }
    )
  }
}
