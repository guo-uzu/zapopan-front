FROM node:lts-alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile


# Stage 2: Build
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Receive values from `docker build --build-arg`
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SITE_URL

# Make them available to Next.js during `next build`
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Optional but VERY useful: fail immediately if they're missing.
RUN test -n "$NEXT_PUBLIC_SUPABASE_URL" || \
    (echo "NEXT_PUBLIC_SUPABASE_URL is missing" && exit 1)

RUN test -n "$NEXT_PUBLIC_SUPABASE_ANON_KEY" || \
    (echo "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing" && exit 1)

RUN corepack enable pnpm && pnpm run build


# Stage 3: Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache poppler-utils

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
