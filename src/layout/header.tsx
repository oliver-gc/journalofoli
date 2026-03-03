import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { useTheme } from "@/components/theme-provider"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (theme === "dark") setTheme("light")
    else setTheme("dark")
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border backdrop-blur-md bg-[oklch(0.985_0.003_240/0.92)] dark:bg-[oklch(0.16_0.012_240/0.92)] shadow-[0_1px_0_oklch(0.46_0.22_250/0.08),0_4px_24px_oklch(0.46_0.22_250/0.06)]">
      {/* Thin primary-coloured top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[linear-gradient(to_right,oklch(0.46_0.22_250),oklch(0.62_0.20_220),oklch(0.46_0.22_250))]" />

      <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <a href="/" className="flex items-center gap-2 group">
            <span className="text-foreground font-bold text-sm tracking-tight">
              journalof
              <span className="text-[oklch(0.46_0.22_250)]">oli</span>
            </span>
          </a>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {["posts", "projects", "contact"].map((item) => (
            <a
              key={item}
              href={`/${item}`}
              className="relative text-[13px] font-medium px-3 py-1.5 rounded-md transition-all duration-200 text-[oklch(0.50_0.015_240)] hover:text-[oklch(0.46_0.22_250)] hover:bg-[oklch(0.46_0.22_250/0.07)] dark:text-[oklch(0.65_0.015_240)] dark:hover:text-[oklch(0.72_0.18_250)] dark:hover:bg-[oklch(0.72_0.18_250/0.12)]"
            >
              {item}
            </a>
          ))}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="ml-1 p-1.5 rounded-md transition-all cursor-pointer duration-200 text-[oklch(0.50_0.015_240)] hover:text-[oklch(0.46_0.22_250)] hover:bg-[oklch(0.46_0.22_250/0.07)] dark:text-[oklch(0.65_0.015_240)] dark:hover:text-[oklch(0.72_0.18_250)] dark:hover:bg-[oklch(0.72_0.18_250/0.12)]"
            aria-label="Toggle theme"
            type="button"
          >
            {mounted && theme === "dark" ? (
              <Sun size={14} strokeWidth={2} />
            ) : (
              <Moon size={14} strokeWidth={2} />
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}