import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  ScriptOnce,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ThemeProvider } from '@/components/theme-provider'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'
import appCss from '../styles.css?url'

const themeScript = `(function () {
  try {
    var storageKey = 'vite-ui-theme';
    var defaultTheme = 'light';
    var theme = localStorage.getItem(storageKey) || defaultTheme;
    var resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    root.classList.add('theme-ready');
  } catch (e) {}
})();`

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'journalofoli',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
})

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3">
          404
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          Page not found
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Back home
        </Link>
      </div>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <ScriptOnce>{themeScript}</ScriptOnce>
      </head>
      <body>
        <TanStackQueryProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          {children}
          </ThemeProvider>
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </TanStackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}
