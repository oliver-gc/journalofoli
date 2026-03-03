
export type Topic = {
    id: string
    name: string
    color: string
    createdAt?: string
    updatedAt?: string
    isActive?: boolean
}

export type Post = {
    id: string
    title: string
    content: object
    topicId: string | null
    createdAt: string
    updatedAt?: string
    isActive?: boolean
    topic?: Topic | null
}

