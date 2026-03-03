import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Hash, Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
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
import { Header } from "@/layout/header"
import { apiClient } from "@/lib/api-client"
import type { createTopicInput, updateTopicInput } from "@/schemas/topics/topics.schemas"
import type { Topic } from "@/types/models"
import { formatDate } from "@/types/models"

export const Route = createFileRoute("/_auth/admin_topics")({
    component: Topics,
})

function Topics() {
    const [createOpen, setCreateOpen] = useState(false)
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<createTopicInput>()

    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        reset: resetEdit,
        formState: { errors: editErrors, isSubmitting: isEditSubmitting },
    } = useForm<updateTopicInput>()

    const { data: topics, refetch } = useQuery({
        queryKey: ["topics"],
        queryFn: async () => {
            const response = await apiClient.get("/topics?page=1&limit=100")
            return response.data
        },
    })

    const onSubmit = async (data: createTopicInput) => {
        try {
            await apiClient.post("/topics", data)
            reset()
            setCreateOpen(false)
            refetch()
        } catch (error) {
            console.error(error)
        }
    }

    const onDelete = async (id: string) => {
        try {
            await apiClient.delete(`/topics/${id}`)
            refetch()
        } catch (error) {
            console.error(error)
        }
    }

    const openEdit = (topic: Topic) => {
        setEditingTopic(topic)
        resetEdit({ name: topic.name, color: topic.color })
    }

    const onEdit = async (data: updateTopicInput) => {
        if (!editingTopic) return
        try {
            await apiClient.patch(`/topics/${editingTopic.id}`, data)
            setEditingTopic(null)
            refetch()
        } catch (error) {
            console.error(error)
        }
    }

    const topicList: Topic[] = topics?.data ?? []

    return (
        <>
            <Header />

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Page header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <a href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-1 inline-block">
                            ← Dashboard
                        </a>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Hash size={22} />
                            Topics
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {topicList.length} topic{topicList.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <Button onClick={() => setCreateOpen(true)} className="cursor-pointer gap-2">
                        <Plus size={15} />
                        New topic
                    </Button>
                </div>

                {/* Topics list */}
                {topicList.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
                        <Hash size={36} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No topics yet. Create your first one.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {topicList.map((topic) => (
                            <Card key={topic.id} className="group px-5 py-4 hover:ring-1 hover:ring-ring/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-4 h-4 rounded-full shrink-0"
                                        style={{ backgroundColor: topic.color }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <span className="font-semibold text-sm">{topic.name}</span>
                                        <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                                            {topic.updatedAt ? formatDate(topic.updatedAt) : ""}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="cursor-pointer gap-1.5 h-8"
                                            onClick={() => openEdit(topic)}
                                        >
                                            <Pencil size={13} />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="cursor-pointer text-destructive hover:text-destructive hover:border-destructive/50 h-8"
                                            onClick={() => onDelete(topic.id)}
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
            <Dialog open={createOpen} onOpenChange={(open) => { if (!open) { setCreateOpen(false); reset() } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New topic</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div>
                            <Input
                                placeholder="Name"
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                            )}
                        </div>
                        <div>
                            <Input
                                placeholder="Color (e.g. #3b82f6)"
                                {...register("color", { required: "Color is required" })}
                            />
                            {errors.color && (
                                <p className="text-sm text-destructive mt-1">{errors.color.message}</p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => { setCreateOpen(false); reset() }}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                                Create topic
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit dialog */}
            <Dialog open={!!editingTopic} onOpenChange={(open) => { if (!open) setEditingTopic(null) }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit topic</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitEdit(onEdit)} className="flex flex-col gap-4">
                        <div>
                            <Input
                                placeholder="Name"
                                {...registerEdit("name", { required: "Name is required" })}
                            />
                            {editErrors.name && (
                                <p className="text-sm text-destructive mt-1">{editErrors.name.message}</p>
                            )}
                        </div>
                        <div>
                            <Input
                                placeholder="Color (e.g. #3b82f6)"
                                {...registerEdit("color", { required: "Color is required" })}
                            />
                            {editErrors.color && (
                                <p className="text-sm text-destructive mt-1">{editErrors.color.message}</p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingTopic(null)}>
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

