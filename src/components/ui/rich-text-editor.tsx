import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { isAxiosError } from "axios"
import {
    Bold,
    Heading2,
    Heading3,
    ImageIcon,
    Italic,
    List,
    ListOrdered,
    Loader2,
    Quote,
    Redo,
    Undo,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { isValidTiptapDoc } from "@/lib/tiptap"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
    value: object
    onChange: (value: object) => void
    placeholder?: string
    className?: string
}

type ToolbarButtonProps = {
    active?: boolean
    onClick: () => void
    children: React.ReactNode
    title: string
}

function ToolbarButton({ active, onClick, children, title }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            title={title}
            onMouseDown={(e) => { e.preventDefault(); onClick() }}
            className={cn(
                "p-1.5 rounded transition-colors text-sm",
                active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
        >
            {children}
        </button>
    )
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: placeholder ?? "Write something…" }),
            Image.configure({ inline: false, allowBase64: false }),
        ],
        content: value && Object.keys(value).length > 0 ? value : undefined,
        onUpdate({ editor }) {
            onChange(editor.getJSON())
        },
        immediatelyRender: false,
    })

    // Sync external value changes (e.g. when edit dialog opens with pre-filled content)
    useEffect(() => {
        if (!editor) return
        if (!isValidTiptapDoc(value)) {
            if (!editor.isEmpty) {
                editor.commands.clearContent(true)
            }
            return
        }
        const current = editor.getJSON()
        if (JSON.stringify(current) !== JSON.stringify(value)) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    return (
        <div className={cn("border border-input rounded-lg overflow-hidden bg-background", className)}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-input bg-muted/30">
                <ToolbarButton
                    title="Bold"
                    active={editor?.isActive("bold")}
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                >
                    <Bold size={14} />
                </ToolbarButton>
                <ToolbarButton
                    title="Italic"
                    active={editor?.isActive("italic")}
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                >
                    <Italic size={14} />
                </ToolbarButton>
                <div className="w-px h-4 bg-border mx-1" />
                <ToolbarButton
                    title="Heading 2"
                    active={editor?.isActive("heading", { level: 2 })}
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 size={14} />
                </ToolbarButton>
                <ToolbarButton
                    title="Heading 3"
                    active={editor?.isActive("heading", { level: 3 })}
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 size={14} />
                </ToolbarButton>
                <div className="w-px h-4 bg-border mx-1" />
                <ToolbarButton
                    title="Bullet list"
                    active={editor?.isActive("bulletList")}
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                >
                    <List size={14} />
                </ToolbarButton>
                <ToolbarButton
                    title="Ordered list"
                    active={editor?.isActive("orderedList")}
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered size={14} />
                </ToolbarButton>
                <ToolbarButton
                    title="Blockquote"
                    active={editor?.isActive("blockquote")}
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                >
                    <Quote size={14} />
                </ToolbarButton>
                <div className="w-px h-4 bg-border mx-1" />
                <ToolbarButton
                    title="Undo"
                    onClick={() => editor?.chain().focus().undo().run()}
                >
                    <Undo size={14} />
                </ToolbarButton>
                <ToolbarButton
                    title="Redo"
                    onClick={() => editor?.chain().focus().redo().run()}
                >
                    <Redo size={14} />
                </ToolbarButton>
                <div className="w-px h-4 bg-border mx-1" />
                <ToolbarButton
                    title="Insert image"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                </ToolbarButton>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file || !editor) return
                        setUploading(true)
                        try {
                            const form = new FormData()
                            form.append("image", file)
                            const { data } = await apiClient.post<{ url?: string }>("/upload", form, {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            })
                            if (data.url) {
                                editor.chain().focus().setImage({ src: data.url }).run()
                            }
                            else {
                                console.error("Upload succeeded without URL", data)
                            }
                        } catch (error) {
                            if (isAxiosError(error)) {
                                console.error("Image upload failed", error.response?.data ?? error.message)
                            } else {
                                console.error("Image upload failed", error)
                            }
                        } finally {
                            setUploading(false)
                            e.target.value = ""
                        }
                    }}
                />
            </div>
            <EditorContent
                editor={editor}
                className={cn(
                    "min-h-48 max-h-100 overflow-y-auto px-4 py-3 text-sm",
                    "[&_.tiptap]:outline-none",
                    "[&_.tiptap_img]:max-w-full [&_.tiptap_img]:rounded-lg [&_.tiptap_img]:my-2",
                    "[&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
                    "[&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground",
                    "[&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none",
                    "[&_.tiptap_p.is-editor-empty:first-child::before]:float-left",
                    "[&_.tiptap_p.is-editor-empty:first-child::before]:h-0",
                )}
            />
        </div>
    )
}
