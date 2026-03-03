import { auth } from "@/lib/auth"

/**
 * Use inside API route handlers to require an authenticated session.
 * Returns a 401 Response if unauthenticated, otherwise returns null (authenticated).
 */
export async function requireSession(request: Request): Promise<Response | null> {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        })
    }
    return null
}
