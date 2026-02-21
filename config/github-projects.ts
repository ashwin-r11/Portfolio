/**
 * GitHub Projects Configuration
 * 
 * Add GitHub repository URLs here to automatically fetch project data.
 * The system will:
 * - Fetch repository metadata (name, description, topics)
 * - Fetch README.md content
 * - Auto-generate tags from repository topics and languages
 * 
 * Manual projects (in /content/projects/*.md) will still work alongside these.
 */

export interface GitHubProjectConfig {
    /** GitHub repository URL (e.g., "https://github.com/username/repo") */
    url: string
    /** Optional: Override the auto-generated title */
    title?: string
    /** Optional: Override the auto-generated description */
    description?: string
    /** Optional: Custom thumbnail image URL or path */
    image?: string
    /** Optional: Additional tags to add (merged with auto-detected topics) */
    extraTags?: string[]
    /** Optional: Mark as featured project */
    featured?: boolean
    /** Optional: Override live URL (set to null to disable) */
    liveUrl?: string | null
}

/**
 * List your GitHub repositories here.
 * Projects will be fetched in the order listed.
 */
export const githubProjects: GitHubProjectConfig[] = [
    {
        url: "https://github.com/ashwin-r11/Dexsent_round2",
        image: "/project1.png", // Path to your local image or a URL
        extraTags: ["Robotics", "Docker"],
        liveUrl: null, // Disable live demo button
    },
    {
        url: "https://github.com/ashwin-r11/Immi-Torch",
        title: "Immi-Torch",
        image: "", // Add your thumbnail URL here
        extraTags: ["Python", "NumPy"],
    },
    {
        url: "https://github.com/ashwin-r11/AstroWin",
        title: "AstroWin",
        image: "https://camo.githubusercontent.com/e0293f41067d65e909e60397415f8de91c76700e3607a55546f62569407e330f/68747470733a2f2f696d616765732d6173736574732e6e6173612e676f762f696d6167652f475346435f32303137313230385f417263686976655f653030303731302f475346435f32303137313230385f417263686976655f653030303731307e736d616c6c2e6a7067", // Add your thumbnail URL here
        extraTags: [],
    },

    {
        url: "https://github.com/ashwin-r11/Schwarzschild-RTX-Real-Time-Relativistic-Spacetime-Engine",
        featured: true,
        title: "Schwarzschild-RTX",
        image: "https://raw.githubusercontent.com/ashwin-r11/Schwarzschild-RTX-Real-Time-Relativistic-Spacetime-Engine/main/docs/screenshots/oblique_bloom_closeup.png", // Add your thumbnail URL here
        extraTags: ["C++", "OpenGL", "Ray Tracing", "CMake", "GLSL"],
    },
] 