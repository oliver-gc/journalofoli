import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/db/index.ts";
import { fetchTopics } from "@/db/queries";
import { topic } from "@/db/schema";
import { requireSession } from "@/lib/require-session";
import {
	createTopicSchema,
	getTopicsSchema,
	responseTopicsSchema,
} from "@/schemas/topics/topics.schemas";

export const Route = createFileRoute("/api/topics/")({
	server: {
		handlers: {

			
			GET: async ({ request }: { request: Request }) => {
				const url = new URL(request.url);

				const parsed = getTopicsSchema.safeParse({
					page: url.searchParams.get("page")
						? Number(url.searchParams.get("page"))
						: undefined,
					limit: url.searchParams.get("limit")
						? Number(url.searchParams.get("limit"))
						: undefined,
				})

				if (!parsed.success) {
					return new Response(
						JSON.stringify({ error: parsed.error.flatten() }),
						{ status: 400 },
					)
				}

				const { page = 1, limit = 10 } = parsed.data;
			const result = await fetchTopics(page, limit);
				const responseParsed = responseTopicsSchema.safeParse({
					page,
					limit,
					total: result.total,
					data: result.data,
				})

				if (!responseParsed.success) {
					return new Response(
						JSON.stringify({ error: responseParsed.error.flatten() }),
						{ status: 500 },
					)
				}

				return new Response(JSON.stringify(responseParsed.data), {
					status: 200,
				})
			},


			POST: async ({ request }: { request: Request }) => {
				const authError = await requireSession(request)
				if (authError) return authError
				const body = await request.json();
				const parsed = createTopicSchema.safeParse(body);
				if (!parsed.success) {
					return new Response(
						JSON.stringify({ error: parsed.error.flatten() }),
						{ status: 400 },
					)
				}
				const { name, color } = parsed.data;
				const newTopic = await db
					.insert(topic)
					.values({
						name,
						color,
					})
					.returning()
				return new Response(JSON.stringify(newTopic), { status: 201 });
			},
		},
	},
});
