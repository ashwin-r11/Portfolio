"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MapPin, Mail, Calendar, ArrowUpRight, Sparkles, Award, ExternalLink, X } from "lucide-react"
import { siteConfig } from "@/config/site"

export default function AboutPage() {
  const [selectedCert, setSelectedCert] = useState<typeof siteConfig.certifications[0] | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          {/* Header */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
            {/* Photo */}
            <div className="shrink-0">
              <div className="relative h-48 w-48 overflow-hidden rounded-3xl bg-coral lg:h-64 lg:w-64">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-6xl font-bold text-background lg:text-7xl">{siteConfig.name.initials}</span>
                </div>
              </div>
            </div>

            {/* Bio Content */}
            <div className="flex-1">
              <span className="text-xs font-medium tracking-wider text-coral">ABOUT ME</span>
              <h1 className="mt-3 text-4xl font-bold text-foreground lg:text-5xl">{siteConfig.name.full.toUpperCase()}</h1>
              {siteConfig.aboutBio.map((paragraph, index) => (
                <p key={index} className={`${index === 0 ? 'mt-6' : 'mt-4'} text-lg leading-relaxed text-muted-foreground`}>
                  {paragraph}
                </p>
              ))}

              {/* Quick Info */}
              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-sage" />
                  <span className="text-sm">{siteConfig.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 text-sage" />
                  <span className="text-sm">{siteConfig.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-sage" />
                  <span className="text-sm">{siteConfig.availability}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Section - Show seeking opportunities if no experience */}
          <div className="mt-24">
            <h2 className="text-2xl font-bold text-foreground">EXPERIENCE</h2>

            {siteConfig.experience.length > 0 ? (
              <div className="mt-8 space-y-6">
                {siteConfig.experience.map((item, index) => (
                  <div key={index} className="group rounded-2xl bg-card p-6 transition-colors hover:bg-muted">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-foreground">{item.role}</h3>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        <p className="mt-1 text-coral">{item.company}</p>
                        <p className="mt-3 text-muted-foreground">{item.description}</p>
                      </div>
                      <span className="shrink-0 rounded-lg bg-muted px-3 py-1 text-xs font-medium text-muted-foreground md:bg-transparent">
                        {item.period}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : siteConfig.seekingOpportunities?.active ? (
              <div className="mt-8 rounded-2xl bg-gradient-to-br from-coral/20 to-sage/20 p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-coral">
                    <Sparkles className="h-6 w-6 text-background" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{siteConfig.seekingOpportunities.title}</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {siteConfig.seekingOpportunities.description}
                    </p>
                    <div className="mt-6">
                      <span className="text-xs font-medium tracking-wider text-muted-foreground">AREAS OF INTEREST</span>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {siteConfig.seekingOpportunities.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="rounded-lg bg-card px-3 py-1.5 text-sm font-medium text-foreground"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-8 text-muted-foreground">No experience listed yet.</p>
            )}
          </div>

          {/* Education */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground">EDUCATION</h2>
            <div className="mt-8 rounded-2xl bg-card p-6">
              <p className="text-lg font-bold text-foreground">{siteConfig.education.degree}</p>
              <p className="mt-2 text-coral">{siteConfig.education.school}</p>
              <div className="mt-2 flex items-center gap-4">
                <p className="text-sm text-muted-foreground">{siteConfig.education.period}</p>
                {siteConfig.education.cgpa && (
                  <span className="rounded-lg bg-sage px-2 py-1 text-xs font-bold text-sage-foreground">
                    CGPA: {siteConfig.education.cgpa}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Certifications - Individual Cards */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground">CERTIFICATIONS</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {siteConfig.certifications.map((cert, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCert(cert)}
                  className="group rounded-2xl bg-card p-6 text-left transition-all hover:bg-muted hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage">
                      <Award className="h-5 w-5 text-sage-foreground" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <h3 className="mt-4 font-bold text-foreground">{cert.name}</h3>
                  <p className="mt-1 text-sm text-coral">{cert.issuer}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{cert.date}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Certification Modal with Image */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute right-4 top-4 z-10 rounded-lg bg-card/80 p-2 text-muted-foreground hover:bg-muted hover:text-foreground backdrop-blur-sm"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Certificate Image */}
            {selectedCert.image && (
              <div className="mb-6 overflow-hidden rounded-2xl border border-border">
                <img
                  src={selectedCert.image}
                  alt={selectedCert.name}
                  className="w-full h-auto"
                />
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage">
                <Award className="h-6 w-6 text-sage-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-foreground">{selectedCert.name}</h3>
                <p className="mt-1 text-coral">{selectedCert.issuer}</p>
              </div>
            </div>

            <p className="mt-4 text-muted-foreground">{selectedCert.description}</p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-muted p-3">
                <span className="text-sm text-muted-foreground">Issue Date</span>
                <span className="font-medium text-foreground">{selectedCert.date}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted p-3">
                <span className="text-sm text-muted-foreground">Credential ID</span>
                <span className="font-medium text-foreground text-right break-all">{selectedCert.credentialId}</span>
              </div>
            </div>

            <a
              href={selectedCert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-coral px-4 py-3 font-bold text-background transition-transform hover:scale-[1.02]"
            >
              <ExternalLink className="h-4 w-4" />
              VERIFY CREDENTIAL
            </a>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
