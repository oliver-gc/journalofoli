# journalofoli

Personal site and blog. Built with TanStack Start, Drizzle ORM, Better Auth, and AWS S3.

Using AWS for hosting.

## Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (SSR React) |
| Router | TanStack Router (file-based) |
| Data fetching | TanStack Query |
| Database | PostgreSQL via [Drizzle ORM](https://orm.drizzle.team) |
| Auth | [Better Auth](https://better-auth.com) (email/password, sign-up disabled) |
| Storage | AWS S3 (`ogc-general-web/jounralofoli/`) |
| Styling | Tailwind CSS v4 |
| Editor | Tiptap (rich text) |
| Validation | Zod |
| Forms | React Hook Form |
| Linting | Biome |
| Testing | Vitest + Testing Library |
| Components | Storybook |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_URL` | Full URL of the app (e.g. `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | Random secret string |
| `AWS_REGION` | S3 bucket region (e.g. `eu-west-2`) |
| `AWS_ACCESS_KEY_ID` | IAM access key with `s3:PutObject` on the uploads prefix |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key |
| `AWS_S3_PUBLIC_URL` | Optional CloudFront or custom domain for served image URLs |

### 3. Run database migrations

```bash
npm run db:migrate
```

### 4. Start the dev server

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev           # Start dev server (port 3000)
npm run build         # Production build
npm run preview       # Preview production build

npm run db:generate   # Generate Drizzle migrations from schema
npm run db:migrate    # Run pending migrations
npm run db:push       # Push schema directly (no migration file)
npm run db:studio     # Open Drizzle Studio GUI

npm run check         # Biome lint + format check
npm run lint          # Biome lint only
npm run format        # Biome format only

npm run test          # Run Vitest tests

npm run storybook     # Start Storybook (port 6006)
```

## Project structure

```
src/
├── components/
│   ├── ui/                # Shared UI components (button, input, rich text editor, etc.)
│   └── storybook/         # Storybook stories
├── db/
│   ├── schema.ts          # Drizzle table definitions (post, topic)
│   ├── queries.ts         # Shared DB query functions (fetchPosts, fetchTopics)
│   └── index.ts           # DB client instance
├── layout/                # Page-level layout components (header, footer, post card)
├── lib/
│   ├── api-client.ts      # Axios instance (base: /api)
│   ├── auth.ts            # Better Auth server config
│   ├── auth.server.ts     # getSession / ensureSession server functions
│   ├── auth-client.ts     # Better Auth browser client
│   ├── env.ts             # getRequiredEnv() helper
│   ├── require-session.ts # requireSession() guard for API handlers
│   ├── s3.ts              # S3 client + bucket/prefix/CDN constants
│   ├── tiptap.ts          # isValidTiptapDoc() utility
│   └── utils.ts           # cn(), formatDate()
├── routes/
│   ├── index.tsx          # Home page
│   ├── posts/             # Public post listing and detail pages
│   ├── projects.tsx       # Projects page
│   ├── contact.tsx        # Contact page
│   ├── login.tsx          # Login page
│   ├── _auth/             # Protected admin routes (require session)
│   │   ├── dashboard.tsx
│   │   ├── admin_posts.tsx
│   │   └── admin_topics.tsx
│   └── api/               # API route handlers
│       ├── posts/         # GET public · POST/PATCH/DELETE auth-required
│       ├── topics/        # GET public · POST/PATCH/DELETE auth-required
│       ├── upload.ts      # Image upload to S3 (auth-required)
│       └── auth/          # Better Auth catch-all handler
├── schemas/
│   ├── posts/             # Zod schemas + inferred types for posts
│   └── topics/            # Zod schemas + inferred types for topics
└── types/
    └── models.ts          # Shared domain types (Post, Topic)
```

## API

All `GET` endpoints are public. All write endpoints require an authenticated session cookie.

| Method | Endpoint | Auth required |
|---|---|---|
| GET | `/api/posts` | No |
| POST | `/api/posts` | Yes |
| GET | `/api/posts/:id` | No |
| PATCH | `/api/posts/:id` | Yes |
| DELETE | `/api/posts/:id` | Yes |
| GET | `/api/topics` | No |
| POST | `/api/topics` | Yes |
| GET | `/api/topics/:id` | No |
| PATCH | `/api/topics/:id` | Yes |
| DELETE | `/api/topics/:id` | Yes |
| POST | `/api/upload` | Yes |

## Auth

Uses Better Auth with email/password. **Sign-up is disabled** accounts must be seeded directly in the database. Sign in at `/login`.

## Image uploads

Images are uploaded to S3 bucket `ogc-general-web` under the `jounralofoli/` prefix with a UUID filename. The public URL is built from `AWS_S3_PUBLIC_URL` if set, otherwise falls back to the standard S3 endpoint (`https://ogc-general-web.s3.<region>.amazonaws.com`).
