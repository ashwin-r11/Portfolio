/**
 * Site Configuration
 * 
 * Edit this file to update your personal details across the entire site.
 * Changes here will automatically reflect in navbar, footer, pages, and API integrations.
 */

export const siteConfig = {
  // ============================================
  // PERSONAL INFORMATION
  // ============================================
  name: {
    first: "Ashwin",
    last: "Ramachandran",
    full: "Ashwin Ramachandran",
    display: "ashwinr-11", // Used in navbar, footer, meta tags
    initials: "AR", // Used in avatar placeholders
  },

  // ============================================
  // PROFESSIONAL INFO
  // ============================================
  title: "AI Systems Engineer",
  tagline: "Building reliable, scalable, and safety-aware AI systems",
  bio: "AI Systems Engineer focused on designing and operating real-world AI infrastructure — from model integration and evaluation to deployment, monitoring, and control systems.",
  aboutBio: [
    "I'm an AI Systems Engineer with a strong foundation in computer science and systems thinking. My work focuses on building the infrastructure around AI models — orchestration, evaluation pipelines, deployment, monitoring, and reliability — rather than just training models in isolation.",
    "I'm particularly interested in AI safety, robustness, and long-term human–AI coexistence. I approach AI as an engineering discipline first: constrained, testable, and accountable. Outside of core development, I explore alignment research, system failure modes, and the societal implications of advanced AI systems."
  ],
  status: "OPEN TO INTERNSHIPS",

  // ============================================
  // LOCATION & CONTACT
  // ============================================
  location: "Tamil Nadu, IN",
  email: "mail.to.ashwinr11@gmail.com",
  availability: "Available for internships",

  // ============================================
  // SOCIAL LINKS
  // ============================================
  social: {
    github: {
      username: "ashwin-r11",
      url: "https://github.com/ashwin-r11",
    },
    twitter: {
      username: "at_singularity",
      url: "https://twitter.com/at_singularity",
    },
    linkedin: {
      username: "ashwin-r11",
      url: "https://www.linkedin.com/in/ashwin-r11/",
    },
  },

  // ============================================
  // TECH STACK (displayed on homepage)
  // ============================================
  techStack: ["PYTHON", "PYTORCH", "PostgreSQL", "DOCKER", "LINUX", "FastAPI"],

  // ============================================
  // GITHUB PROFILE README (optional)
  // SVG cards from your GitHub profile README
  // ============================================
  githubReadme: {
    darkMode: "https://raw.githubusercontent.com/ashwin-r11/ashwin-r11/main/dark_mode.svg",
    lightMode: "https://raw.githubusercontent.com/ashwin-r11/ashwin-r11/main/light_mode.svg",
    tagline: "I craft code, decode systems, and map the unknown.",
  },

  // ============================================
  // EXPERIENCE (empty for freshers)
  // ============================================
  experience: [],

  // Show this message when seeking opportunities
  seekingOpportunities: {
    active: true,
    title: "Seeking Internship Opportunities",
    description: "I'm a passionate newcomer to the industry, eager to learn and grow. Currently seeking internship opportunities where I can contribute my skills in AI systems, apply my theoretical knowledge to real-world problems, and learn from experienced professionals.",
    interests: [
      "AI/ML Engineering",
      "Backend Development",
      "Systems Engineering",
      "DevOps & Infrastructure",
      "Robotics",
    ],
  },

  // ============================================
  // EDUCATION
  // ============================================
  education: {
    degree: "B.Tech Computer Science Engineering - IoT & Automation",
    school: "Sastra Deemed University",
    period: "2023 - 2027",
    cgpa: "7.7965",
  },

  // ============================================
  // CERTIFICATIONS (with detailed info for modal)
  // ============================================
  certifications: [
    {
      name: "Docker Essentials: A Developer Introduction",
      issuer: "IBM Developer Skills Network:Cognitive Class",
      date: "2025",
      credentialId: "dc29dc35aaba4a63a639ff65543aba29",
      credentialUrl: "https://courses.cognitiveclass.ai/certificates/dc29dc35aaba4a63a639ff65543aba29#",
      image: "/certs/Docker_cert.png",
      description: "Learn how to use containers for your applications. Create and run your first Docker container. Then, learn how to run containers in production and solve problems of orchestration such as high availability, service discovery, and reconciliation.",
    },
    {
      name: "Human Research and Data or Specimens Only Research",
      issuer: "CITI Program",
      date: "2025",
      credentialId: "72096046",
      credentialUrl: "https://www.citiprogram.org/verify/?wbb2a11c1-79aa-4d21-b12f-bb4658df8fef-72096046",
      image: "/certs/CITI_Lisc.png",
      description: "Research involving analysis of existing human data or biological specimens, without direct interaction or intervention with participants.Focuses on extracting insights while maintaining privacy, ethical handling, and regulatory compliance.",
    },
    {
      name: "Electronics and PCB Design",
      issuer: "Udemy",
      date: "2025",
      credentialId: "UC-56e4e703-cde2-4d1d-9a1f-0ac2a3bbc7a5",
      credentialUrl: "https://www.udemy.com/certificate/UC-56e4e703-cde2-4d1d-9a1f-0ac2a3bbc7a5/",
      image: "/certs/pcb_udemy.png",
      description: "this course builds a solid foundation in electronics and PCB design by moving from basic circuit concepts to practical, manufacturable boards.It’s valuable because it focuses on hands-on understanding of how real hardware is designed, tested, and prepared for production rather than just theory.",
    },

  ],

  // ============================================
  // SEO & META
  // ============================================
  meta: {
    title: "ashwinr-11 // Portfolio",
    titleTemplate: "%s // ashwinr-11",
    description: "AI Systems Engineer portfolio - Building reliable, scalable, and safety-aware AI systems.",
    keywords: ["AI engineer", "portfolio", "machine learning", "systems engineering", "python", "pytorch"],
    ogTitle: "Ashwin Ramachandran - AI Systems Engineer",
    ogDescription: "AI Systems Engineer focused on designing and operating real-world AI infrastructure.",
  },

  // ============================================
  // THEME COLORS (for external services)
  // ============================================
  colors: {
    coral: "d4654a",
    sage: "8b9e7c",
    cream: "e8d5b7",
    transparent: "00000000",
  },

  // ============================================
  // BLOG RECENT POSTS (populated from markdown files)
  // ============================================
  recentPosts: [],
}



export type SiteConfig = typeof siteConfig
