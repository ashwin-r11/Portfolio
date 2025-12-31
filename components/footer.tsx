import { Github, Twitter, Linkedin } from "lucide-react"
import { siteConfig } from "@/config/site"

const socialLinks = [
  { name: "Twitter", href: siteConfig.social.twitter.url, icon: Twitter },
  { name: "GitHub", href: siteConfig.social.github.url, icon: Github },
  { name: "LinkedIn", href: siteConfig.social.linkedin.url, icon: Linkedin },
]

const footerLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Projects", href: "/projects" },
  { name: "Skills", href: "/skills" },
  { name: "Stats", href: "/stats" },
]

export function Footer() {
  return (
    <footer className="bg-background py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-card p-6 md:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral">
              <span className="text-xs font-bold text-background">01</span>
            </div>
            <div>
              <span className="text-sm font-bold tracking-wider text-foreground">{siteConfig.name.display}</span>
              <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} // ALL RIGHTS RESERVED</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-all hover:bg-sage hover:text-sage-foreground"
                  aria-label={social.name}
                >
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
