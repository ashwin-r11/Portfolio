"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TableOfContentsProps {
    content: string
}

interface TocItem {
    id: string
    text: string
    level: number
}

export function TableOfContents({ content }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("")
    const [items, setItems] = useState<TocItem[]>([])

    useEffect(() => {
        // Parse markdown headings
        const headingLines = content.match(/^#{2,3}\s.+$/gm) || []
        const tocItems = headingLines.map((line) => {
            const level = line.match(/^#{2,3}/)?.[0].length || 2
            const text = line.replace(/^#{2,3}\s/, "")
            // Generate ID compatible with rehype-slug (lowercase, remove special chars, replace spaces with dashes)
            const id = text
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")

            return { id, text, level }
        })
        setItems(tocItems)
    }, [content])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: "0% 0% -80% 0%" }
        )

        items.forEach((item) => {
            const element = document.getElementById(item.id)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [items])

    if (items.length === 0) return null

    return (
        <div className="sticky top-24 hidden lg:block">
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
                On This Page
            </h4>
            <nav className="flex flex-col gap-2">
                {items.map((item) => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={cn(
                            "text-sm transition-colors hover:text-coral",
                            item.level === 3 && "pl-4",
                            activeId === item.id
                                ? "font-medium text-coral"
                                : "text-muted-foreground"
                        )}
                        onClick={(e) => {
                            e.preventDefault()
                            document.querySelector(`#${item.id}`)?.scrollIntoView({
                                behavior: "smooth",
                            })
                            setActiveId(item.id)
                        }}
                    >
                        {item.text}
                    </a>
                ))}
            </nav>
        </div>
    )
}
