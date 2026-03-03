import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Header } from "@/layout/header"
import { getSession } from '@/lib/auth-fns'

export const Route = createFileRoute('/_auth/dashboard')({
  loader: async () => {
    const session = await getSession()
    return { session }
  },
  component: Dashboard,
})

function Dashboard() {
  const { session } = Route.useLoaderData()
  const navigate = Route.useNavigate()

  return (
    <>
      <Header />
      <div className="gap-3 text-center mt-5 max-w-2xl mx-auto px-6">
        <h1 className="text-2xl font-bold">Hey, {session?.user?.name}</h1>
        <p className="text-sm text-muted-foreground mb-5">Welcome to the dashboard</p>
        <div className='flex-row w-full flex items-center justify-center gap-2'>
          <Button className="cursor-pointer" onClick={() => navigate({ to: '/admin_topics' })}>
            Topics
          </Button>
          <Button className="cursor-pointer" onClick={() => navigate({ to: '/admin_posts' })}>
            Posts
          </Button>
        </div>

      </div>
    </>
  )
}
