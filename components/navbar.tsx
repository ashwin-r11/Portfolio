"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Github, Twitter, Linkedin, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { SettingsPanel } from "./settings-panel"
import { siteConfig } from "@/config/site"

const navItems = [
  { name: "HOME", href: "/" },
  { name: "ABOUT", href: "/about" },
  { name: "BLOG", href: "/blog" },
  { name: "PROJECTS", href: "/projects" },
  { name: "STATS", href: "/stats" },
  { name: "SKILLS", href: "/skills" },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral">
                <span className="text-xs font-bold text-background">01</span>
              </div>
              <span className="text-sm font-bold tracking-wider text-foreground">{siteConfig.name.display}</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium tracking-wider transition-all duration-200 rounded-lg",
                    pathname === item.href
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-coral px-3 py-1.5 text-xs font-bold text-background transition-transform hover:scale-105"
              >
                <FileText className="h-3.5 w-3.5" />
                RESUME
              </a>
              <a
                href={siteConfig.social.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.twitter.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <SettingsPanel />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <SettingsPanel />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-foreground"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Outside nav, higher z-index */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-14 z-[9999] md:hidden"
          style={{
            backgroundColor: '#1a1a1a',
            position: 'fixed',
            top: '56px',
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <div className="h-full overflow-y-auto p-4">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    backgroundColor: pathname === item.href ? 'var(--foreground)' : '#2a2a2a',
                    color: pathname === item.href ? 'var(--background)' : '#a0a0a0',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    display: 'block',
                  }}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'var(--coral)',
                  color: 'var(--background)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <FileText className="h-4 w-4" />
                RESUME
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
