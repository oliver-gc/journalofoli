import { ArrowRight } from "lucide-react"

export interface ProjectCardProps {
    title: string
    description: string
    /** Short status label, e.g. "live" or "in progress" */
    status?: string
    href: string
    linkLabel?: string
    accentColor?: string
}

export function ProjectCard({
    title,
    description,
    status,
    href,
    linkLabel = "Visit project",
    accentColor = "oklch(0.46 0.22 250 / 0.2)",
}: ProjectCardProps) {
    return (
        <article className="group relative bg-card rounded-2xl border border-border shadow-sm hover:shadow-[0_4px_24px_oklch(0.46_0.22_250/0.08)] transition-shadow duration-300 p-8">
            <div
                className="absolute left-0 top-6 bottom-6 w-0.75 rounded-full"
                style={{ backgroundColor: accentColor }}
            />
            <div className="pl-4">
                {status && (
                    <div className="mb-3">
                        <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border border-[oklch(0.46_0.22_250/0.3)] bg-[oklch(0.46_0.22_250/0.08)] text-[oklch(0.46_0.22_250)]">
                            {status}
                        </span>
                    </div>
                )}
                <h2 className="text-2xl font-bold text-foreground tracking-tight mb-3">{title}</h2>
                <div className="h-px bg-border mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                <a
                    href={href}
                    className="inline-flex items-center gap-2 mt-6 text-xs text-[oklch(0.46_0.22_250)] font-medium group-hover:gap-3 transition-all duration-200 hover:underline"
                >
                    {linkLabel} <ArrowRight size={12} />
                </a>
            </div>
        </article>
    )
}
