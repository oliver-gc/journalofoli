import { createFileRoute } from "@tanstack/react-router"
import { Mail, Send } from "lucide-react"
import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Footer } from "@/layout/footer"
import { Header } from "@/layout/header"
import { PageHeader } from "@/layout/page-header"

export const Route = createFileRoute("/contact")({ component: Contact })

const EMAIL = "olivergchester@gmail.com"

function Contact() {
    const baseId = useId()
    const nameId = `${baseId}-name`
    const subjectId = `${baseId}-subject`
    const bodyId = `${baseId}-body`

    const [name, setName] = useState("")
    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")

    const handleSend = () => {
        const params = new URLSearchParams()
        if (subject) params.set("subject", subject)
        if (name || body) {
            const bodyText = [name ? `Hi, I'm ${name}.` : "", body].filter(Boolean).join("\n\n")
            params.set("body", bodyText)
        }
        const query = params.toString()
        window.location.href = `mailto:${EMAIL}${query ? `?${query}` : ""}`
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-3xl mx-auto px-4 py-12">
                <PageHeader
                    title="contact"
                    subtitle="i read everything."
                />

                <article className="group relative bg-card rounded-2xl border border-border shadow-sm hover:shadow-[0_4px_24px_oklch(0.46_0.22_250/0.08)] transition-shadow duration-300 p-8">
                    {/* Left accent bar */}
                    <div
                        className="absolute left-0 top-6 bottom-6 w-0.75 rounded-full"
                        style={{ backgroundColor: "oklch(0.46 0.22 250 / 0.25)" }}
                    />

                    <div className="pl-4 space-y-5">
                        {/* Email address chip */}
                        <div className="flex items-center gap-2">
                            <Mail size={14} className="text-[oklch(0.46_0.22_250)] shrink-0" />
                            <a
                                href={`mailto:${EMAIL}`}
                                className="text-sm font-medium text-[oklch(0.46_0.22_250)] hover:underline"
                            >
                                {EMAIL}
                            </a>
                        </div>

                        <div className="h-px bg-border" />

                        {/* Form */}
                        <div className="space-y-3">
                            <div>
                                <label htmlFor={nameId} className="text-xs font-medium text-muted-foreground uppercase tracking-widest block mb-1.5">
                                    your name
                                </label>
                                <Input
                                    id={nameId}
                                    placeholder="Jane Smith"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor={subjectId} className="text-xs font-medium text-muted-foreground uppercase tracking-widest block mb-1.5">
                                    subject
                                </label>
                                <Input
                                    id={subjectId}
                                    placeholder="Hi Oli..."
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor={bodyId} className="text-xs font-medium text-muted-foreground uppercase tracking-widest block mb-1.5">
                                    message
                                </label>
                                <textarea
                                    id={bodyId}
                                    rows={5}
                                    placeholder="What's on your mind?"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.46_0.22_250/0.4)] resize-none"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleSend}
                            className="gap-2 cursor-pointer bg-[oklch(0.46_0.22_250)] hover:bg-[oklch(0.40_0.22_255)] text-white"
                        >
                            <Send size={13} />
                            Open in email client
                        </Button>

                        <p className="text-xs text-muted-foreground">
                            this will open your default email app with the message pre-filled.
                        </p>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    )
}
