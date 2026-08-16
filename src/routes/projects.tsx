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
                    description="my personal journal."
                    status="live"
                    href="https://github.com/oliver-gc/journalofoli"
                    linkLabel="View on GitHub"
                    accentColor="oklch(0.46 0.22 250 / 0.25)"
                />

                <ProjectCard
                    title="slic"
                    description="the smart way to navigate tech roles and get hired."
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
