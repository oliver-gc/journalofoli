import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft, Calendar, Hash } from "lucide-react"
import { RichTextViewer } from "@/components/ui/rich-text-viewer"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/layout/header"
import { apiClient } from "@/lib/api-client"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/types/models"

export const Route = createFileRoute("/posts/$id")({
    component: PostPage,
})

function PostPage() {
    const { id } = Route.useParams()

    const { data: post, isLoading, isError } = useQuery<Post>({
        queryKey: ["post", id],
        queryFn: async () => {
            const res = await apiClient.get(`/posts/${id}`)
            return res.data
        },
        enabled: !!id,
    })

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-3xl mx-auto px-4 py-12">
                <Link
                    to="/posts"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft size={12} />
                    Back to posts
                </Link>

                {isLoading ? (
                    <>
                        <div className="h-8 w-2/3 bg-muted animate-pulse rounded-lg mb-4" />
                        <div className="h-4 w-1/3 bg-muted animate-pulse rounded mb-6" />
                        <div className="space-y-3">
                            {(["sk-80a", "sk-87a", "sk-94a", "sk-80b", "sk-87b", "sk-94b"] as const).map((k, i) => (
                                <div
                                    key={k}
                                    className="h-4 bg-muted animate-pulse rounded"
                                    style={{ width: ["80%", "87%", "94%", "80%", "87%", "94%"][i] }}
                                />
                            ))}
                        </div>
                    </>
                ) : isError || !post ? (
                    <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
                        <p className="text-sm font-medium">Post not found.</p>
                        <Link
                            to="/posts"
                            className="text-xs mt-2 block text-[oklch(0.46_0.22_250)] hover:underline"
                        >
                            Browse all posts
                        </Link>
                    </div>
                ) : (
                    <article>
                        {post.topic && (
                            <div className="mb-4">
                                <span
                                    className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border"
                                    style={{
                                        backgroundColor: `${post.topic.color}22`,
                                        color: post.topic.color,
                                        borderColor: `${post.topic.color}44`,
                                    }}
                                >
                                    <Hash size={9} />
                                    {post.topic.name}
                                </span>
                            </div>
                        )}

                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground leading-tight mb-4">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-6">
                            <span className="inline-flex items-center gap-1">
                                <Calendar size={11} />
                                {formatDate(post.createdAt, "long")}
                            </span>
                            {post.updatedAt && post.updatedAt !== post.createdAt && (
                                <span className="text-muted-foreground/60">
                                    updated {formatDate(post.updatedAt, "long")}
                                </span>
                            )}
                        </div>

                        <Separator className="mb-8" />

                        <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
                            <RichTextViewer content={post.content} />
                        </div>

                        <Separator className="mt-12 mb-6" />

                        <Link
                            to="/posts"
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft size={12} />
                            All posts
                        </Link>
                    </article>
                )}

                <footer className="text-center pt-16">
                    <p className="text-xs text-muted-foreground font-mono">
                        {"\u00a9"} 2026 oli chester {"\u00b7"} powered by life
                    </p>
                </footer>
            </main>
        </div>
    )
}
