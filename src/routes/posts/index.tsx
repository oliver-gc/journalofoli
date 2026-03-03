import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { ArrowDownAZ, ArrowLeft, ArrowRight, ArrowUpAZ, FileText, Search, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/layout/header"
import { PageHeader } from "@/layout/page-header"
import { PostCard } from "@/layout/post-card"
import { apiClient } from "@/lib/api-client"
import type { Post, Topic } from "@/types/models"

const searchSchema = z.object({
    page: z.number().int().min(1).optional().default(1),
    search: z.string().optional(),
    topicId: z.string().optional(),
    sort: z.enum(["asc", "desc"]).optional().default("desc"),
})

export const Route = createFileRoute("/posts/")({
    validateSearch: searchSchema,
    component: PostsPage,
})

const LIMIT = 10

function PostsPage() {
    const { page, search, topicId, sort } = Route.useSearch()
    const navigate = useNavigate({ from: "/posts/" })

    const [searchInput, setSearchInput] = useState(search ?? "")
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            const trimmed = searchInput.trim() || undefined
            if (trimmed !== search) {
                navigate({ search: (prev) => ({ ...prev, search: trimmed, page: 1 }) })
            }
        }, 400)
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [searchInput, search, navigate])

    const { data: topicsData } = useQuery({
        queryKey: ["topics-all"],
        queryFn: async () => {
            const res = await apiClient.get("/topics?page=1&limit=100")
            return res.data
        },
        staleTime: 60_000,
    })
    const topics: Topic[] = topicsData?.data ?? []

    const buildQs = () => {
        const params = new URLSearchParams()
        params.set("page", String(page))
        params.set("limit", String(LIMIT))
        if (search) params.set("search", search)
        if (topicId) params.set("topicId", topicId)
        if (sort) params.set("sort", sort)
        return params.toString()
    }

    const { data, isLoading } = useQuery({
        queryKey: ["posts-public", page, search, topicId, sort],
        queryFn: async () => {
            const res = await apiClient.get(`/posts?${buildQs()}`)
            return res.data
        },
    })

    const posts: Post[] = data?.data ?? []
    const total: number = data?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / LIMIT))
    const hasFilters = !!(search || topicId)

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-3xl mx-auto px-4 py-12">
                <PageHeader
                    title="posts"
                    subtitle={
                        !isLoading
                            ? `${total} post${total !== 1 ? "s" : ""}${hasFilters ? " found" : ""}`
                            : undefined
                    }
                    actions={
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={() =>
                                navigate({
                                    search: (prev) => ({
                                        ...prev,
                                        sort: sort === "asc" ? "desc" : "asc",
                                        page: 1,
                                    }),
                                })
                            }
                        >
                            {sort === "asc" ? (
                                <><ArrowUpAZ size={14} /> Oldest first</>
                            ) : (
                                <><ArrowDownAZ size={14} /> Newest first</>
                            )}
                        </Button>
                    }
                />

                <div className="mb-6 flex flex-col gap-3">
                    <div className="relative">
                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <Input
                            placeholder="Search posts..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-8 pr-8"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchInput("")
                                    navigate({ search: (prev) => ({ ...prev, search: undefined, page: 1 }) })
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    {topics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate({ search: (prev) => ({ ...prev, topicId: undefined, page: 1 }) })
                                }
                                className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-colors ${
                                    !topicId
                                        ? "bg-foreground text-background border-foreground"
                                        : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                                }`}
                            >
                                All
                            </button>
                            {topics.map((t) => (
                                <button
                                    type="button"
                                    key={t.id}
                                    onClick={() =>
                                        navigate({
                                            search: (prev) => ({
                                                ...prev,
                                                topicId: topicId === t.id ? undefined : t.id,
                                                page: 1,
                                            }),
                                        })
                                    }
                                    className="text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full border transition-all"
                                    style={
                                        topicId === t.id
                                            ? { backgroundColor: t.color, color: "#fff", borderColor: t.color }
                                            : { backgroundColor: `${t.color}18`, color: t.color, borderColor: `${t.color}44` }
                                    }
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {["sk-1", "sk-2", "sk-3", "sk-4"].map((k) => (
                            <div key={k} className="h-28 rounded-2xl bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
                        <FileText size={36} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">{hasFilters ? "No posts match your filters." : "No posts yet."}</p>
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchInput("")
                                    navigate({ search: { page: 1, sort: sort ?? "desc" } })
                                }}
                                className="text-xs mt-2 text-[oklch(0.46_0.22_250)] hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-10">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 1}
                            onClick={() => navigate({ search: (prev) => ({ ...prev, page: page - 1 }) })}
                            className="gap-1.5"
                        >
                            <ArrowLeft size={14} /> Previous
                        </Button>
                        <span className="text-xs text-muted-foreground">
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages}
                            onClick={() => navigate({ search: (prev) => ({ ...prev, page: page + 1 }) })}
                            className="gap-1.5"
                        >
                            Next <ArrowRight size={14} />
                        </Button>
                    </div>
                )}

                <footer className="text-center pt-12">
                    <p className="text-xs text-muted-foreground font-mono">
                        {"\u00a9"} 2026 oli chester {"\u00b7"} powered by life
                    </p>
                </footer>
            </main>
        </div>
    )
}
