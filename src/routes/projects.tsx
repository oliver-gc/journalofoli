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
                    title="projects"
                    subtitle="things i'm building and thinking about."
                />

                <ProjectCard
                    title="journalofoli"
                    description="a personal journal and writing space, where i publish thoughts on product, tech, and whatever else is occupying my mind. built with TanStack Start, Drizzle, and Postgres."
                    status="live"
                    href="https://github.com/oliver-gc/journalofoli"
                    linkLabel="View on GitHub"
                    accentColor="oklch(0.46 0.22 250 / 0.25)"
                />

                <ProjectCard
                    title="rae"
                    description="the new style of physical assistant, rae is an ai-centric gym buddy."
                    status="in progress"
                    href="#"
                    linkLabel="Incoming soon"
                    accentColor="oklch(0.62 0.20 150 / 0.25)"
                />
            </main>
            <Footer />
        </div>
    )
}
