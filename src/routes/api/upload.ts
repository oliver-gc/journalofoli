import { randomUUID } from "node:crypto"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { createFileRoute } from "@tanstack/react-router"
import { requireSession } from "@/lib/require-session"
import { S3_BUCKET, S3_CDN_URL, S3_PREFIX, s3 } from "@/lib/s3"

export const Route = createFileRoute("/api/upload")({
    server: {
        handlers: {
            POST: async ({ request }: { request: Request }) => {

                const authError = await requireSession(request)
                if (authError) return authError
                const contentType = request.headers.get("content-type") ?? ""
                if (!contentType.includes("multipart/form-data")) {
                    return new Response(JSON.stringify({ error: "Expected multipart/form-data" }), {
                        status: 400,
                    })
                }

                const formData = await request.formData()
                const file = formData.get("image") as File | null

                if (!file || typeof file === "string") {
                    return new Response(JSON.stringify({ error: "No image file provided" }), {
                        status: 400,
                    })
                }

                const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
                if (!allowed.includes(file.type)) {
                    return new Response(JSON.stringify({ error: "Unsupported file type" }), {
                        status: 400,
                    })
                }

                const ext = file.name.split(".").pop() ?? "bin"
                const key = `${S3_PREFIX}/${randomUUID()}.${ext}`

                const buffer = Buffer.from(await file.arrayBuffer())

                try {
                    await s3.send(new PutObjectCommand({
                        Bucket: S3_BUCKET,
                        Key: key,
                        Body: buffer,
                        ContentType: file.type,
                    }))
                }
                catch (error) {
                    const message = error instanceof Error ? error.message : "Failed to upload image"
                    return new Response(JSON.stringify({ error: message, key, bucket: S3_BUCKET }), {
                        status: 500,
                        headers: { "Content-Type": "application/json" },
                    })
                }

                const url = `${S3_CDN_URL}/${key}`

                return new Response(JSON.stringify({ url }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                })
            },
        },
    },
})
