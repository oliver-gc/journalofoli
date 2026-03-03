import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db/index.ts";
import { fetchPosts } from "@/db/queries";
import { post } from "@/db/schema";
import { requireSession } from "@/lib/require-session";
import {
	createPostSchema,
	getPostsSchema,
	responsePostsSchema,
} from "@/schemas/posts/posts.schemas";

export const Route = createFileRoute("/api/posts/")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				const url = new URL(request.url);

				const parsed = getPostsSchema.safeParse({
					page: url.searchParams.get("page")
						? Number(url.searchParams.get("page"))
						: undefined,
					limit: url.searchParams.get("limit")
						? Number(url.searchParams.get("limit"))
						: undefined,
					search: url.searchParams.get("search") ?? undefined,
					topicId: url.searchParams.get("topicId") ?? undefined,
					sort: (url.searchParams.get("sort") as "asc" | "desc") ?? undefined,
				});

				if (!parsed.success) {
					return new Response(
						JSON.stringify({ error: parsed.error.flatten() }),
						{ status: 400 },
					);
				}

				const { page = 1, limit = 10, search, topicId, sort } = parsed.data;
				const result = await fetchPosts(page, limit, { search, topicId, sort });

				const responseParsed = responsePostsSchema.safeParse({
					page,
					limit,
					total: result.total,
					data: result.data,
				});

				if (!responseParsed.success) {
					return new Response(
						JSON.stringify({ error: responseParsed.error.flatten() }),
						{ status: 500 },
					);
				}

				return new Response(JSON.stringify(responseParsed.data), {
					status: 200,
				});
			},

			POST: async ({ request }: { request: Request }) => {
				const authError = await requireSession(request)
				if (authError) return authError
				const body = await request.json();
				const parsed = createPostSchema.safeParse(body);
				if (!parsed.success) {
					return new Response(
						JSON.stringify({ error: parsed.error.flatten() }),
						{ status: 400 },
					);
				}
				const { title, content, topicId } = parsed.data;
				const newPost = await db
					.insert(post)
					.values({
						title,
						content,
						topicId: topicId ?? null,
					})
					.returning();
				return new Response(JSON.stringify(newPost[0]), { status: 201 });
			},
		},
	},
});
