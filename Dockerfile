FROM node:lts-alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- 🛠️ CAMBIO AQUÍ: Las llaves deben estar ANTES del build ---
ENV NEXT_PUBLIC_SUPABASE_URL=https://rpbkprzjlgbjqwgxrdqr.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwYmtwcnpqbGdianF3Z3hyZHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDI1NzgsImV4cCI6MjA3MjQxODU3OH0.sgO33HHNj5V_4_6QYXklvA0SHtMe9rHkwB-wsfR6_tE
# (Nota: La PUBLISHABLE_KEY de Clerk u otros servicios también iría aquí si se usa en el build)

RUN corepack enable pnpm && pnpm run build
# -------------------------------------------------------------

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Opcional: Puedes dejarlas aquí también si las necesitas en runtime, 
# pero lo CRÍTICO es que estén arriba en el 'builder'.

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
