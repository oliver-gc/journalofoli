import { z } from 'zod';

export const createTopicSchema = z.object({
    name: z.string().min(1, "Name is required"),
    color: z.string().min(1, "Color is required")
})

export type createTopicInput = z.infer<typeof createTopicSchema>

export const updateTopicSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    color: z.string().min(1, "Color is required").optional(),
    isActive: z.boolean().optional()
})

export type updateTopicInput = z.infer<typeof updateTopicSchema>

export const deleteTopicSchema = z.object({
    id: z.uuid("Invalid topic ID")
})

export const getTopicSchema = z.object({
    id: z.uuid("Invalid topic ID")
})

export const getTopicsSchema = z.object({
    page: z.number().min(1).optional(),
    limit: z.number().min(1).max(100).optional()
})

export const responseTopicsSchema = z.object({
    page: z.number().min(1).optional(),
    limit: z.number().min(1).max(100).optional(),
    total: z.number().min(0).optional(),
    data: z.array(z.object({
        id: z.uuid(),
        name: z.string(),
        color: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        isActive: z.boolean()
    }))
})