import Image from "@tiptap/extension-image"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { cn } from "@/lib/utils"

interface RichTextViewerProps {
    content: object
    className?: string
}

export function RichTextViewer({ content, className }: RichTextViewerProps) {
    const editor = useEditor({
        extensions: [StarterKit, Image.configure({ inline: false })],
        content,
        editable: false,
        immediatelyRender: false,
    })

    if (!editor) return null

    return (
        <EditorContent
            editor={editor}
            className={cn(
                "prose prose-sm dark:prose-invert max-w-none",
                "[&_.tiptap]:outline-none",
                "[&_.tiptap_img]:max-w-full [&_.tiptap_img]:rounded-lg [&_.tiptap_img]:my-3",
                className
            )}
        />
    )
}

export function extractPlainText(content: object): string {
    try {
        const doc = content as { content?: Array<{ content?: Array<{ text?: string }> }> }
        return (doc.content ?? [])
            .flatMap((node) => node.content ?? [])
            .map((n) => n.text ?? "")
            .join(" ")
    } catch {
        return ""
    }
}
