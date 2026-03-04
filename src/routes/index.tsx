import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { ArrowRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchPosts } from "@/db/queries"
import { Footer } from "@/layout/footer"
import { Header } from "@/layout/header"
import { PostCard } from "@/layout/post-card"
import type { Post } from "@/types/models"

const getHomePosts = createServerFn({ method: "GET" }).handler(async () => {
    const result = await fetchPosts(1, 4)
    return result.data.map((post) => ({
        ...post,
        content: post.content as object,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        topic: post.topic
            ? {
                  ...post.topic,
                  createdAt: post.topic.createdAt.toISOString(),
                  updatedAt: post.topic.updatedAt.toISOString(),
              }
            : null,
    }))
})

export const Route = createFileRoute("/")({
    loader: async () => ({
        posts: await getHomePosts(),
    }),
    component: App,
})

function App() {
    const { posts: initialPosts } = Route.useLoaderData()

    const { data } = useQuery({
        queryKey: ["posts-home"],
        queryFn: getHomePosts,
        initialData: initialPosts,
        staleTime: 60_000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    const posts: Post[] = data ?? []
    const [latest, ...older] = posts

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-3xl mx-auto px-4 py-12 space-y-10">
                {/* Profile strip */}
                <div className="rounded-2xl border border-[oklch(0.46_0.22_250/0.15)] bg-[linear-gradient(135deg,oklch(1_0_0),oklch(0.975_0.012_240))] dark:bg-[linear-gradient(135deg,oklch(0.19_0.022_245),oklch(0.16_0.012_240))] shadow-[0_2px_12px_oklch(0.46_0.22_250/0.08),0_1px_2px_oklch(0.46_0.22_250/0.06)] p-6 flex items-start gap-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[linear-gradient(to_right,oklch(0.46_0.22_250),oklch(0.62_0.20_220),oklch(0.46_0.22_250))]" />
                    <div className="relative shrink-0 mt-1">
                        <Avatar className="h-14 w-14">
                            <AvatarImage
                                src="https://media.licdn.com/dms/image/v2/D4E03AQFg2Q5QCTDWEQ/profile-displayphoto-crop_800_800/B4EZedKY_RHgAQ-/0/1750688436736?e=1773273600&v=beta&t=sh4GqbrDVCRLSarC-T3LBBrK-K9Z5XAYwgPfgU-nHO0"
                                width={56}
                                height={56}
                                loading="eager"
                                fetchPriority="high"
                                decoding="async"
                            />
                            <AvatarFallback className="text-xl font-bold bg-[linear-gradient(135deg,oklch(0.46_0.22_250),oklch(0.62_0.20_220))] text-[oklch(0.98_0.01_250)]">
                                oc
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl font-bold tracking-tight text-foreground">oli chester</h1>
                        <p className="text-xs mt-0.5 mb-3 text-muted-foreground">28 · product lead · london</p>
                        <p className="text-sm leading-relaxed text-foreground mb-3">
                            currently building rae, the physical assistant. work full time in b2b saas for anvil. writing mostly about rae and tech - documenting the full journey.
                        </p>
                        <div className="flex flex-row gap-3">
                            <a href="https://github.com/oliver-gc" className="text-sm text-[oklch(0.46_0.22_250)] hover:text-[oklch(0.36_0.20_255)] dark:text-[oklch(0.62_0.20_230)] dark:hover:text-[oklch(0.72_0.18_250)] font-medium transition-colors">
                                github
                            </a>
                            <a href="https://www.linkedin.com/in/olivergchester/" className="text-sm text-[oklch(0.46_0.22_250)] hover:text-[oklch(0.36_0.20_255)] dark:text-[oklch(0.62_0.20_230)] dark:hover:text-[oklch(0.72_0.18_250)] font-medium transition-colors">
                                linkedin
                            </a>
                            <a href="/OliverChesterCV.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-[oklch(0.46_0.22_250)] hover:text-[oklch(0.36_0.20_255)] dark:text-[oklch(0.62_0.20_230)] dark:hover:text-[oklch(0.72_0.18_250)] font-medium transition-colors">
                                cv
                            </a>
                        </div>
                    </div>
                </div>

                {latest && (
                    <section>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3 pl-1">latest entry</p>
                        <PostCard post={latest} featured />
                    </section>
                )}

                {older.length > 0 && (
                    <section>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3 pl-1">earlier</p>
                        <div className="space-y-4">
                            {older.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    </section>
                )}

                <div className="text-center">
                    <Link to="/posts" className="text-sm text-[oklch(0.46_0.22_250)] hover:text-[oklch(0.36_0.20_255)] font-medium transition-colors inline-flex items-center gap-1.5">
                        View all posts <ArrowRight size={13} />
                    </Link>
                </div>

                <Footer />
            </main>
        </div>
    )
}
