import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
// KaTeX CSS for LaTeX math rendering
import "katex/dist/katex.min.css"
// Highlight.js theme for syntax highlighting
import "highlight.js/styles/github-dark.css"

import { ThemeProvider } from "@/components/theme-provider"
import { siteConfig } from "@/config/site"

import { Space_Mono, Inter, Inter as V0_Font_Inter, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _inter = V0_Font_Inter({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200", "300", "400", "500", "600", "700", "800", "900"] })

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
})

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: siteConfig.meta.title,
    template: siteConfig.meta.titleTemplate,
  },
  description: siteConfig.meta.description,
  generator: "v0.app",
  keywords: siteConfig.meta.keywords,
  authors: [{ name: siteConfig.name.full }],
  openGraph: {
    title: siteConfig.meta.ogTitle,
    description: siteConfig.meta.ogDescription,
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceMono.className} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
