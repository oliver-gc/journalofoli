import { and, asc, count, desc, eq, ilike } from "drizzle-orm"
import { db } from "@/db/index"
import { post, topic } from "@/db/schema"

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

export const fetchPosts = async (
    page: number,
    limit: number,
    opts: { search?: string; topicId?: string; sort?: "asc" | "desc" } = {},
) => {
    const { search, topicId, sort = "desc" } = opts
    const offset = (page - 1) * limit

    const buildWhere = () => {
        const conditions = [
            search ? ilike(post.title, `%${search}%`) : undefined,
            topicId ? eq(post.topicId, topicId) : undefined,
        ].filter(Boolean) as ReturnType<typeof ilike>[]
        if (conditions.length === 0) return undefined
        return conditions.length === 1 ? conditions[0] : and(...conditions)
    }

    const where = buildWhere()

    const posts = await db.query.post.findMany({
        limit,
        offset,
        with: { topic: true },
        where: where ? () => where : undefined,
        orderBy: sort === "asc" ? asc(post.createdAt) : desc(post.createdAt),
    })

    const [{ value: total }] = await db
        .select({ value: count() })
        .from(post)
        .where(where)

    return { data: posts, total }
}

// ---------------------------------------------------------------------------
// Topics
// ---------------------------------------------------------------------------

export const fetchTopics = async (page: number, limit: number) => {
    const offset = (page - 1) * limit
    const topics = await db.query.topic.findMany({ limit, offset })
    const [{ value: total }] = await db.select({ value: count() }).from(topic)
    return { data: topics, total }
}
