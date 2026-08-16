import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { cn } from "@/lib/utils"

interface RichTextViewerProps {
    content: object
    className?: string
}

export function RichTextViewer({ content, className }: RichTextViewerProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                autolink: true,
                defaultProtocol: "https",
                openOnClick: true,
                protocols: ["http", "https", "mailto", "tel"],
            }),
            Image.configure({ inline: false }),
        ],
        content,
        editable: false,
        immediatelyRender: false,
    })

    if (!editor) return null

    return (
        <EditorContent
            editor={editor}
            className={cn(
                "[&_.tiptap]:outline-none",
                "[&_.tiptap_p]:my-3 [&_.tiptap_p:first-child]:mt-0 [&_.tiptap_p:last-child]:mb-0",
                "[&_.tiptap_h2]:mt-6 [&_.tiptap_h2]:mb-3 [&_.tiptap_h2]:text-2xl [&_.tiptap_h2]:font-semibold",
                "[&_.tiptap_h3]:mt-5 [&_.tiptap_h3]:mb-2 [&_.tiptap_h3]:text-xl [&_.tiptap_h3]:font-semibold",
                "[&_.tiptap_ul]:my-4 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-6",
                "[&_.tiptap_ol]:my-4 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-6",
                "[&_.tiptap_li]:my-1",
                "[&_.tiptap_blockquote]:my-5 [&_.tiptap_blockquote]:border-l-4 [&_.tiptap_blockquote]:border-border [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:italic [&_.tiptap_blockquote]:text-muted-foreground",
                "[&_.tiptap_a]:font-medium [&_.tiptap_a]:text-primary [&_.tiptap_a]:underline [&_.tiptap_a]:underline-offset-4",
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
