/**
 * Reads a required environment variable and throws at startup if it is missing or empty.
 */
export function getRequiredEnv(name: string): string {
    const value = process.env[name]
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }
    return value
}
