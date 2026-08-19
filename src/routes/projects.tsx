import { createFileRoute } from "@tanstack/react-router"
import { Footer } from "@/layout/footer"
import { Header } from "@/layout/header"
import { PageHeader } from "@/layout/page-header"
import { ProjectCard } from "@/layout/project-card"

export const Route = createFileRoute("/projects")({ component: Projects })

function Projects() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-3xl mx-auto px-4 py-12 space-y-6">
                <PageHeader
                    title="Projects"
                    subtitle="Things I'm building and thinking about."
                />

                <ProjectCard
                    title="slic"
                    description="The smart way to ask AI. Slic is a place where users can ask questions and get answers from a variety of AI models in a digestible forum format. Complete with voting and debating, it is designed to be a one-stop shop for all your AI needs, whether you're looking for a quick answer or a more in-depth explanation."
                    status="In Progress"
                    href="#"
                    linkLabel="Incoming Soon"
                    accentColor="oklch(0.62 0.20 150 / 0.25)"
                />

                <ProjectCard
                    title="journalofoli"
                    description="My personal journal."
                    status="Live"
                    href="https://github.com/oliver-gc/journalofoli"
                    linkLabel="View on GitHub"
                    accentColor="oklch(0.46 0.22 250 / 0.25)"
                />

                
            </main>
            <Footer />
        </div>
    )
}
