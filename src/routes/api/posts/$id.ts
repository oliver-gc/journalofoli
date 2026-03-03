import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/db/index.ts";
import { post } from "@/db/schema";
import { requireSession } from "@/lib/require-session";
import { getPostSchema, updatePostSchema } from "@/schemas/posts/posts.schemas";

export const Route = createFileRoute("/api/posts/$id")({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				const url = new URL(request.url);
				const id = url.pathname.split("/").pop();
				if (!id) {
					return new Response(
						JSON.stringify({ error: "Post ID is required" }),
						{ status: 400 },
					);
				}
				const parsed = getPostSchema.safeParse({ id });
				if (!parsed.success) {
					return new Response(
						JSON.stringify({ error: parsed.error.flatten() }),
						{ status: 400 },
					);
				}
				const found = await db.query.post.findFirst({
					where: (post, { eq }) => eq(post.id, parsed.data.id),
					with: { topic: true },
				});
				if (!found) {
					return new Response(JSON.stringify({ error: "Post not found" }), {
						status: 404,
					});
				}
				return new Response(JSON.stringify(found), { status: 200 });
			},

			PATCH: async ({ request }: { request: Request }) => {
				const authError = await requireSession(request)
				if (authError) return authError
				const url = new URL(request.url);
				const body = await request.json();
				const id = url.pathname.split("/").pop();
				if (!id) {
					return new Response(
						JSON.stringify({ error: "Post ID is required" }),
						{ status: 400 },
					);
				}
				const idParsed = getPostSchema.safeParse({ id });
				if (!idParsed.success) {
					return new Response(
						JSON.stringify({ error: idParsed.error.flatten() }),
						{ status: 400 },
					);
				}
				const bodyParsed = updatePostSchema.safeParse(body);
				if (!bodyParsed.success) {
					return new Response(
						JSON.stringify({ error: bodyParsed.error.flatten() }),
						{ status: 400 },
					);
				}
				const updated = await db
					.update(post)
					.set(bodyParsed.data)
					.where(eq(post.id, idParsed.data.id));
				if (updated.rowCount === 0) {
					return new Response(JSON.stringify({ error: "Post not found" }), {
						status: 404,
					});
				}
				return new Response(
					JSON.stringify({ message: "Post updated successfully" }),
					{ status: 200 },
				);
			},

			DELETE: async ({ request }: { request: Request }) => {
				const authError = await requireSession(request)
				if (authError) return authError
				const url = new URL(request.url);
				const id = url.pathname.split("/").pop();
				if (!id) {
					return new Response(
						JSON.stringify({ error: "Post ID is required" }),
						{ status: 400 },
					);
				}
				const parsed = getPostSchema.safeParse({ id });
				if (!parsed.success) {
					return new Response(
						JSON.stringify({ error: parsed.error.flatten() }),
						{ status: 400 },
					);
				}
				const deleted = await db
					.delete(post)
					.where(eq(post.id, parsed.data.id));
				if (deleted.rowCount === 0) {
					return new Response(JSON.stringify({ error: "Post not found" }), {
						status: 404,
					});
				}
				return new Response(
					JSON.stringify({ message: "Post deleted successfully" }),
					{ status: 200 },
				);
			},
		},
	},
});
