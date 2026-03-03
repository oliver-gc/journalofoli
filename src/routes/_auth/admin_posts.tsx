import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { ArrowDownAZ, ArrowUpAZ, FileText, Hash, Pencil, Plus, Search, Trash2, X } from "lucide-react"
import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { extractPlainText } from "@/components/ui/rich-text-viewer"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Header } from "@/layout/header"
import { apiClient } from "@/lib/api-client"
import { formatDate } from "@/lib/utils"
import type { createPostInput, updatePostInput } from "@/schemas/posts/posts.schemas"
import type { Post } from "@/types/models"

export const Route = createFileRoute("/_auth/admin_posts")({
    component: Posts,
})

type PostFormValues = {
    title: string
    content: object
    topicId?: string
}

function Posts() {
    const [createOpen, setCreateOpen] = useState(false)
    const [editingPost, setEditingPost] = useState<Post | null>(null)

    // Filter / sort state
    const [searchInput, setSearchInput] = useState("")
    const [activeTopicId, setActiveTopicId] = useState<string | null>(null)
    const [sort, setSort] = useState<"asc" | "desc">("desc")

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<PostFormValues>({ defaultValues: { content: {} } })

    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        control: controlEdit,
        setValue: setEditValue,
        reset: resetEdit,
        formState: { errors: editErrors, isSubmitting: isEditSubmitting },
    } = useForm<PostFormValues>({ defaultValues: { content: {} } })

    const { data: posts, refetch } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const response = await apiClient.get("/posts?page=1&limit=100")
            return response.data
        },
    })

    const { data: topicsData } = useQuery({
        queryKey: ["topics"],
        queryFn: async () => {
            const response = await apiClient.get("/topics?page=1&limit=100")
            return response.data
        },
    })

    const topics: Array<{ id: string; name: string; color: string }> = topicsData?.data ?? []

    const onSubmit = async (data: PostFormValues) => {
        try {
            const payload: createPostInput = {
                title: data.title,
                content: data.content,
                topicId: data.topicId || undefined,
            }
            await apiClient.post("/posts", payload)
            reset({ content: {} })
            setCreateOpen(false)
            refetch()
        } catch (error) {
            console.error(error)
        }
    }

    const onDelete = async (id: string) => {
        try {
            await apiClient.delete(`/posts/${id}`)
            refetch()
        } catch (error) {
            console.error(error)
        }
    }

    const openEdit = (post: Post) => {
        setEditingPost(post)
        resetEdit({
            title: post.title,
            content: post.content,
            topicId: post.topicId ?? "",
        })
    }

    const onEdit = async (data: PostFormValues) => {
        if (!editingPost) return
        try {
            const payload: updatePostInput = {
                title: data.title,
                content: data.content,
                topicId: data.topicId || undefined,
            }
            await apiClient.patch(`/posts/${editingPost.id}`, payload)
            setEditingPost(null)
            refetch()
        } catch (error) {
            console.error(error)
        }
    }

    const postList: Post[] = posts?.data ?? []

    const filteredPosts = useMemo(() => {
        let list = [...postList]
        if (searchInput.trim()) {
            const q = searchInput.toLowerCase()
            list = list.filter((p) => p.title.toLowerCase().includes(q))
        }
        if (activeTopicId) {
            list = list.filter((p) => p.topicId === activeTopicId)
        }
        list.sort((a, b) => {
            const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            return sort === "asc" ? diff : -diff
        })
        return list
    }, [postList, searchInput, activeTopicId, sort])

    return (
        <>
            <Header />

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Page header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <a href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-1 inline-block">
                            ← Dashboard
                        </a>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <FileText size={22} />
                            Posts
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {filteredPosts.length} of {postList.length} post{postList.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => setSort((s) => (s === "asc" ? "desc" : "asc"))}
                        >
                            {sort === "asc" ? (
                                <><ArrowUpAZ size={14} /> Oldest first</>
                            ) : (
                                <><ArrowDownAZ size={14} /> Newest first</>
                            )}
                        </Button>
                        <Button onClick={() => setCreateOpen(true)} className="cursor-pointer gap-2">
                            <Plus size={15} />
                            New post
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-3">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        <Input
                            placeholder="Search posts…"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-8 pr-8"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={() => setSearchInput("")}
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
                                onClick={() => setActiveTopicId(null)}
                                className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-colors ${
                                    !activeTopicId
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
                                    onClick={() => setActiveTopicId(activeTopicId === t.id ? null : t.id)}
                                    className="text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full border transition-all"
                                    style={
                                        activeTopicId === t.id
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

                {/* Posts table */}
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
                        <FileText size={36} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">
                            {postList.length === 0 ? "No posts yet. Create your first one." : "No posts match your filters."}
                        </p>
                        {postList.length > 0 && (searchInput || activeTopicId) && (
                            <button
                                type="button"
                                onClick={() => { setSearchInput(""); setActiveTopicId(null) }}
                                className="text-xs mt-2 text-[oklch(0.46_0.22_250)] hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {filteredPosts.map((post) => (
                            <Card key={post.id} className="group px-5 py-4 hover:ring-1 hover:ring-ring/30 transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-sm leading-tight">{post.title}</span>
                                            {post.topic && (
                                                <span
                                                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                                                    style={{
                                                        backgroundColor: `${post.topic.color}22`,
                                                        color: post.topic.color,
                                                    }}
                                                >
                                                    <Hash size={10} />
                                                    {post.topic.name}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 truncate">
                                            {extractPlainText(post.content)}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground/60 mt-1">
                                            {post.updatedAt ? formatDate(post.updatedAt) : ""}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="cursor-pointer gap-1.5 h-8"
                                            onClick={() => openEdit(post)}
                                        >
                                            <Pencil size={13} />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="cursor-pointer text-destructive hover:text-destructive hover:border-destructive/50 h-8"
                                            onClick={() => onDelete(post.id)}
                                        >
                                            <Trash2 size={13} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Create dialog */}
            <Dialog open={createOpen} onOpenChange={(open) => { if (!open) { setCreateOpen(false); reset({ content: {} }) } }}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>New post</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div>
                            <Input
                                placeholder="Title"
                                className="text-base font-medium"
                                {...register("title", { required: "Title is required" })}
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                            )}
                        </div>
                        <div>
                            <Controller
                                control={control}
                                name="content"
                                rules={{ required: "Content is required" }}
                                render={({ field }) => (
                                    <RichTextEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Write your post content..."
                                    />
                                )}
                            />
                            {errors.content && (
                                <p className="text-sm text-destructive mt-1">{errors.content.message as string}</p>
                            )}
                        </div>
                        <div>
                            <Select onValueChange={(val) => setValue("topicId", val as string)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a topic (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {topics.map((topic) => (
                                        <SelectItem key={topic.id} value={topic.id}>
                                            <span className="flex items-center gap-2">
                                                <span className="inline-block w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: topic.color }} />
                                                {topic.name}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => { setCreateOpen(false); reset({ content: {} }) }}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                                Create post
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit dialog */}
            <Dialog open={!!editingPost} onOpenChange={(open) => { if (!open) setEditingPost(null) }}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Edit post</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitEdit(onEdit)} className="flex flex-col gap-4">
                        <div>
                            <Input
                                placeholder="Title"
                                className="text-base font-medium"
                                {...registerEdit("title", { required: "Title is required" })}
                            />
                            {editErrors.title && (
                                <p className="text-sm text-destructive mt-1">{editErrors.title.message}</p>
                            )}
                        </div>
                        <div>
                            <Controller
                                control={controlEdit}
                                name="content"
                                rules={{ required: "Content is required" }}
                                render={({ field }) => (
                                    <RichTextEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Write your post content..."
                                    />
                                )}
                            />
                            {editErrors.content && (
                                <p className="text-sm text-destructive mt-1">{editErrors.content.message as string}</p>
                            )}
                        </div>
                        <div>
                            <Select
                                defaultValue={editingPost?.topicId ?? ""}
                                onValueChange={(val) => setEditValue("topicId", (val as string) ?? undefined)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a topic (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {topics.map((topic) => (
                                        <SelectItem key={topic.id} value={topic.id}>
                                            <span className="flex items-center gap-2">
                                                <span className="inline-block w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: topic.color }} />
                                                {topic.name}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingPost(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isEditSubmitting} className="cursor-pointer">
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}