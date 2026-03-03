/**
 * Returns true only when `value` is a valid TipTap document JSON object.
 */
export function isValidTiptapDoc(value: object | null | undefined): boolean {
    if (!value || typeof value !== "object") return false
    const maybeDoc = value as { type?: string }
    return maybeDoc.type === "doc"
}
