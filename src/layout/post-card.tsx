import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import { extractPlainText } from "@/components/ui/rich-text-viewer"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/types/models"

interface PostCardProps {
    post: Post
    featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
    const preview = extractPlainText(post.content).slice(0, 200)
    const accentColor = post.topic ? `${post.topic.color}55` : "oklch(0.46 0.22 250 / 0.2)"

    return (
        <Link to="/posts/$id" params={{ id: post.id }}>
            <article
                className={[
                    "group relative bg-card rounded-2xl border border-border cursor-pointer mb-5",
                    "shadow-sm hover:shadow-[0_4px_24px_oklch(0.46_0.22_250/0.08)] transition-shadow duration-300",
                    featured ? "p-8" : "p-6",
                ].join(" ")}
            >
                <div
                    className="absolute left-0 top-6 bottom-6 w-0.75 rounded-full transition-colors duration-300"
                    style={{ backgroundColor: accentColor }}
                />
                <div className="pl-4">
                    <div className="flex items-center gap-3 mb-3">
                        <time className="text-xs text-muted-foreground font-mono tracking-wide">
                            {formatDate(post.createdAt)}
                        </time>
                        {post.topic && (
                            <span
                                className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border"
                                style={{
                                    backgroundColor: post.topic.color ? `${post.topic.color}22` : "rgba(0,0,0,0.1)",
                                    color: post.topic.color ?? "#888",
                                    borderColor: post.topic.color ? `${post.topic.color}44` : "rgba(0,0,0,0.2)",
                                }}
                            >
                                {post.topic.name ?? "Unknown"}
                            </span>
                        )}
                    </div>
                    <h2
                        className={[
                            "font-bold text-foreground tracking-tight mb-3",
                            featured ? "text-2xl" : "text-lg",
                        ].join(" ")}
                    >
                        {post.title}
                    </h2>
                    <Separator className="mb-3" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {preview}{preview.length === 200 ? "…" : ""}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-xs text-[oklch(0.46_0.22_250)] font-medium group-hover:gap-3 transition-all duration-200">
                        Read more <ArrowRight size={12} />
                    </div>
                </div>
            </article>
        </Link>
    )
}
