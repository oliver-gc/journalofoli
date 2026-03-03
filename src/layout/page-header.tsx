import { Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import type { ReactNode } from "react"

interface PageHeaderProps {
    title: string
    subtitle?: ReactNode
    backHref?: string
    backLabel?: string
    /** Optional slot rendered on the right side of the title row (e.g. sort button) */
    actions?: ReactNode
}

export function PageHeader({
    title,
    subtitle,
    backHref = "/",
    backLabel = "Home",
    actions,
}: PageHeaderProps) {
    return (
        <div className="mb-8">
            <Link
                to={backHref as "/"}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
                <ArrowLeft size={12} />
                {backLabel}
            </Link>
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
                    )}
                </div>
                {actions && <div className="shrink-0">{actions}</div>}
            </div>
        </div>
    )
}
