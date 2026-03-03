import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/db/index.ts";
import { topic } from "@/db/schema";
import { requireSession } from "@/lib/require-session";
import { getTopicSchema } from "@/schemas/topics/topics.schemas";

export const Route = createFileRoute("/api/topics/$id")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				const url = new URL(request.url);
				const id = url.pathname.split("/").pop();
				if (!id) {
					return new Response(
						JSON.stringify({ error: "Topic ID is required" }),
						{ status: 400 },
					)
				}
				const parsed = getTopicSchema.safeParse({ id });
				if (!parsed.success) {
					return new Response(
						JSON.stringify({ error: parsed.error.flatten() }),
						{ status: 400 },
					)
				}
				const topic = await db.query.topic.findFirst({
					where: (topic, { eq }) => eq(topic.id, parsed.data.id),
				})
				if (!topic) {
					return new Response(JSON.stringify({ error: "Topic not found" }), {
						status: 404,
					})
				}
				return new Response(JSON.stringify(topic), { status: 200 });
			},
            PATCH: async ({ request }: { request: Request }) => {
                const authError = await requireSession(request)
                if (authError) return authError
                const url = new URL(request.url);
                const body = await request.json();
                const id = url.pathname.split("/").pop();
                if (!id) {
                    return new Response(
                        JSON.stringify({ error: "Topic ID is required" }),
                        { status: 400 },
                    );
                }
                const parsed = getTopicSchema.safeParse({ id });
                if (!parsed.success) {
                    return new Response(
                        JSON.stringify({ error: parsed.error.flatten() }),
                        { status: 400 },
                    );
                }
                const updated = await db
                    .update(topic)
                    .set(body)
                    .where(eq(topic.id, parsed.data.id));
                if (updated.rowCount === 0) {
                    return new Response(JSON.stringify({ error: "Topic not found" }), {
                        status: 404,
                    });
                }
                return new Response(JSON.stringify({ message: "Topic updated successfully" }), {
                    status: 200,
                });
			},
			DELETE: async ({ request }: { request: Request }) => {
				const authError = await requireSession(request)
				if (authError) return authError
				const url = new URL(request.url);
				const id = url.pathname.split("/").pop();
				if (!id) {
					return new Response(
						JSON.stringify({ error: "Topic ID is required" }),
						{ status: 400 },
					)
				}
				const parsed = getTopicSchema.safeParse({ id });
				if (!parsed.success) {
					return new Response(
						JSON.stringify({ error: parsed.error.flatten() }),
						{ status: 400 },
					)
				}

				const deleted = await db
					.delete(topic)
					.where(eq(topic.id, parsed.data.id));
				if (deleted.rowCount === 0) {
					return new Response(JSON.stringify({ error: "Topic not found" }), {
						status: 404,
					})
				}
				return new Response(
					JSON.stringify({ message: "Topic deleted successfully" }),
					{ status: 200 },
				)
			},
		},
	},
});
