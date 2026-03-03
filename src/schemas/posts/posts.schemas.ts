import { z } from 'zod';

export const createPostSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.any(),
    topicId: z.uuid("Invalid topic ID").optional()
})

export type createPostInput = z.infer<typeof createPostSchema>

export const updatePostSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    content: z.any().optional(),
    topicId: z.uuid("Invalid topic ID").optional(),
    isActive: z.boolean().optional()
})

export type updatePostInput = z.infer<typeof updatePostSchema>

export const deletePostSchema = z.object({
    id: z.uuid("Invalid post ID")
})

export const getPostSchema = z.object({
    id: z.uuid("Invalid post ID")
})

export const getPostsSchema = z.object({
    page: z.number().min(1).optional(),
    limit: z.number().min(1).max(100).optional(),
    search: z.string().optional(),
    topicId: z.string().uuid().optional(),
    sort: z.enum(["asc", "desc"]).optional(),
})

export const responsePostsSchema = z.object({
    page: z.number().min(1).optional(),
    limit: z.number().min(1).max(100).optional(),
    total: z.number().min(0).optional(),
    data: z.array(z.object({
        id: z.uuid(),
        title: z.string(),
        content: z.any(),
        topicId: z.uuid().nullable(),
        createdAt: z.date(),
        updatedAt: z.date(),
        isActive: z.boolean(),
        topic: z.object({
            id: z.uuid(),
            name: z.string(),
            color: z.string(),
            createdAt: z.date(),
            updatedAt: z.date(),
            isActive: z.boolean(),
        }).nullable().optional(),
    }))
})