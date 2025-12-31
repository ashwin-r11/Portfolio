"use client"

import { useState, useEffect, useRef } from "react"
import { Settings, Minus, Plus, Check } from "lucide-react"

// Color palettes - you can customize these
const colorPalettes = [
  {
    name: "Cyberpunk",
    id: "cyberpunk",
    colors: {
      background: "#0a0a0a",
      foreground: "#e8d5b7",
      card: "#1a1a1a",
      muted: "#2a2a2a",
      coral: "#d4654a",
      sage: "#8b9e7c",
    },
  },
  {
    name: "Ocean Depths",
    id: "ocean",
    colors: {
      background: "#1a3a4a",
      foreground: "#e0f0f5",
      card: "#2a4a5a",
      muted: "#3a5a6a",
      coral: "#5ab0c0",
      sage: "#3a8a9a",
    },
  },
  {
    name: "Warm Earth",
    id: "earth",
    colors: {
      background: "#2a2015",
      foreground: "#e8d8c8",
      card: "#3a3025",
      muted: "#4a4035",
      coral: "#c09060",
      sage: "#8a7050",
    },
  },
  {
    name: "Deep Maroon",
    id: "maroon",
    colors: {
      background: "#1a0a0a",
      foreground: "#f0d8d0",
      card: "#2a1515",
      muted: "#3a2525",
      coral: "#a03030",
      sage: "#703030",
    },
  },
  {
    name: "Dusty Purple",
    id: "purple",
    colors: {
      background: "#2a2a3a",
      foreground: "#e0d8e8",
      card: "#3a3a4a",
      muted: "#4a4a5a",
      coral: "#9080a0",
      sage: "#706080",
    },
  },
  {
    name: "Soft Rose",
    id: "rose",
    colors: {
      background: "#f5e8e8",
      foreground: "#3a2828",
      card: "#ffffff",
      muted: "#e8d0d0",
      coral: "#e08080",
      sage: "#c06070",
    },
  },
  {
    name: "Golden Cream",
    id: "cream",
    colors: {
      background: "#f8f0e0",
      foreground: "#3a3020",
      card: "#ffffff",
      muted: "#e8e0d0",
      coral: "#d0a040",
      sage: "#b08830",
    },
  },
  {
    name: "Olive Grove",
    id: "olive",
    colors: {
      background: "#1a1a10",
      foreground: "#d8e0c8",
      card: "#2a2a20",
      muted: "#3a3a30",
      coral: "#a0a060",
      sage: "#708040",
    },
  },
  {
    name: "Teal Mint",
    id: "teal",
    colors: {
      background: "#0a2020",
      foreground: "#d0f0e8",
      card: "#1a3030",
      muted: "#2a4040",
      coral: "#40b0a0",
      sage: "#309080",
    },
  },
  {
    name: "Sunset Orange",
    id: "sunset",
    colors: {
      background: "#1a1008",
      foreground: "#f8e8d0",
      card: "#2a2018",
      muted: "#3a3028",
      coral: "#e08030",
      sage: "#c06020",
    },
  },
  {
    name: "Navy Gold",
    id: "navy",
    colors: {
      background: "#0a1020",
      foreground: "#f0e8d0",
      card: "#1a2030",
      muted: "#2a3040",
      coral: "#d0a040",
      sage: "#4080c0",
    },
  },
  {
    name: "Electric Blue",
    id: "electric",
    colors: {
      background: "#0a0a1a",
      foreground: "#e0f0ff",
      card: "#1a1a2a",
      muted: "#2a2a3a",
      coral: "#4090f0",
      sage: "#60b0ff",
    },
  },
  {
    name: "Forest Night",
    id: "forest",
    colors: {
      background: "#0a1a0a",
      foreground: "#d0e8d0",
      card: "#1a2a1a",
      muted: "#2a3a2a",
      coral: "#50a050",
      sage: "#70c070",
    },
  },
  {
    name: "Coral Peach",
    id: "peach",
    colors: {
      background: "#f8f0e8",
      foreground: "#3a3030",
      card: "#ffffff",
      muted: "#f0e0d8",
      coral: "#f08060",
      sage: "#e0a080",
    },
  },
  {
    name: "Slate Gray",
    id: "slate",
    colors: {
      background: "#1a1a1a",
      foreground: "#d0d0d8",
      card: "#2a2a2a",
      muted: "#3a3a3a",
      coral: "#808090",
      sage: "#606070",
    },
  },
  {
    name: "Cherry Blossom",
    id: "cherry",
    colors: {
      background: "#1a1018",
      foreground: "#f8e0f0",
      card: "#2a2028",
      muted: "#3a3038",
      coral: "#e060a0",
      sage: "#c04080",
    },
  },
]

const fontSizes = [
  { label: "XS", value: 14 },
  { label: "S", value: 15 },
  { label: "M", value: 16 },
  { label: "L", value: 18 },
  { label: "XL", value: 20 },
]

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(18)
  const [palette, setPalette] = useState("cyberpunk")
  const panelRef = useRef<HTMLDivElement>(null)

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      // Add a small delay to prevent immediate closing when opening
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside)
      }, 0)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem("portfolio-font-size")
    const savedPalette = localStorage.getItem("portfolio-palette")
    
    if (savedFontSize) {
      setFontSize(Number(savedFontSize))
      document.documentElement.style.fontSize = `${savedFontSize}px`
    }
    
    if (savedPalette) {
      setPalette(savedPalette)
      applyPalette(savedPalette)
    }
  }, [])

  const applyPalette = (paletteId: string) => {
    const selected = colorPalettes.find(p => p.id === paletteId)
    if (selected) {
      const root = document.documentElement
      root.style.setProperty("--background", selected.colors.background)
      root.style.setProperty("--foreground", selected.colors.foreground)
      root.style.setProperty("--card", selected.colors.card)
      root.style.setProperty("--muted", selected.colors.muted)
      root.style.setProperty("--coral", selected.colors.coral)
      root.style.setProperty("--sage", selected.colors.sage)
      root.style.setProperty("--accent", selected.colors.coral)
      root.style.setProperty("--chart-1", selected.colors.coral)
      root.style.setProperty("--chart-2", selected.colors.sage)
    }
  }

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize)
    document.documentElement.style.fontSize = `${newSize}px`
    localStorage.setItem("portfolio-font-size", String(newSize))
  }

  const handlePaletteChange = (paletteId: string) => {
    setPalette(paletteId)
    applyPalette(paletteId)
    localStorage.setItem("portfolio-palette", paletteId)
  }

  const decreaseFontSize = () => {
    const currentIndex = fontSizes.findIndex(f => f.value === fontSize)
    if (currentIndex > 0) {
      handleFontSizeChange(fontSizes[currentIndex - 1].value)
    }
  }

  const increaseFontSize = () => {
    const currentIndex = fontSizes.findIndex(f => f.value === fontSize)
    if (currentIndex < fontSizes.length - 1) {
      handleFontSizeChange(fontSizes[currentIndex + 1].value)
    }
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all duration-300 hover:bg-muted"
        aria-label="Settings"
      >
        <Settings className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
      </button>

      {isOpen && (
        <>
          {/* Panel */}
          <div className="fixed md:absolute right-4 md:right-0 top-16 md:top-12 z-[200] w-[calc(100vw-2rem)] md:w-72 max-h-[80vh] overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-lg">
            <h3 className="text-sm font-bold tracking-wider text-foreground">SETTINGS</h3>
            
            {/* Font Size */}
            <div className="mt-5">
              <span className="text-xs font-medium tracking-wider text-muted-foreground">FONT SIZE</span>
              <div className="mt-2 flex items-center justify-between gap-3">
                <button
                  onClick={decreaseFontSize}
                  disabled={fontSize === fontSizes[0].value}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground transition-colors hover:bg-coral hover:text-background disabled:opacity-30 disabled:hover:bg-muted disabled:hover:text-foreground"
                >
                  <Minus className="h-4 w-4" />
                </button>
                
                <div className="flex flex-1 justify-center gap-1">
                  {fontSizes.map((size) => (
                    <button
                      key={size.label}
                      onClick={() => handleFontSizeChange(size.value)}
                      className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors ${
                        fontSize === size.value 
                          ? "bg-coral text-background" 
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={increaseFontSize}
                  disabled={fontSize === fontSizes[fontSizes.length - 1].value}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground transition-colors hover:bg-coral hover:text-background disabled:opacity-30 disabled:hover:bg-muted disabled:hover:text-foreground"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Color Palette */}
            <div className="mt-5">
              <span className="text-xs font-medium tracking-wider text-muted-foreground">COLOR PALETTE</span>
              <div className="mt-2 grid gap-2">
                {colorPalettes.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePaletteChange(p.id)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-all ${
                      palette === p.id 
                        ? "bg-muted ring-1 ring-coral" 
                        : "bg-muted/50 hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Color preview circles */}
                      <div className="flex -space-x-1">
                        <div 
                          className="h-4 w-4 rounded-full border border-border" 
                          style={{ backgroundColor: p.colors.background }}
                        />
                        <div 
                          className="h-4 w-4 rounded-full border border-border" 
                          style={{ backgroundColor: p.colors.coral }}
                        />
                        <div 
                          className="h-4 w-4 rounded-full border border-border" 
                          style={{ backgroundColor: p.colors.sage }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground">{p.name}</span>
                    </div>
                    {palette === p.id && (
                      <Check className="h-4 w-4 text-coral" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                handleFontSizeChange(16)
                handlePaletteChange("cyberpunk")
              }}
              className="mt-5 w-full rounded-xl bg-muted py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-coral hover:text-background"
            >
              RESET TO DEFAULT
            </button>
          </div>
        </>
      )}
    </div>
  )
}
