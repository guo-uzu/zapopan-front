# 🎯 Atención Ciudadana

A modern Next.js application for managing **bitácora** (log) entries and dashboard analytics for the Zapopan municipality.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-3FC400?style=flat&logo=supabase)

---

## 🚀 Technologies

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **UI** | React 19, Tailwind CSS 4, shadcn/ui |
| **Forms** | React Hook Form + Zod |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Charts** | Recharts |
| **Tables** | TanStack Table |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Dashboard home
│   ├── layout.tsx                # Root layout
│   ├── globals.css              # Global styles
│   ├── bitacora/                # Bitácora module
│   │   └── [[...bitacora]]/page.tsx
│   ├── respuestas/              # Respuestas module
│   │   └── [[...respuestas]]/page.tsx
│
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx, input.tsx, table.tsx
│   │   ├── sheet.tsx, dialog.tsx, form.tsx
│   │   └── ...
│   ├── bitacora/                # Bitácora feature
│   │   ├── bitacora.tsx, table.tsx, form.tsx
│   │   ├── filter-selector.tsx
│   │   └── cells/               # Table cells
│   │       ├── date.tsx, status.tsx, priority.tsx
│   │       └── ...
│   └── dashboard/               # Dashboard feature
│       ├── chart.tsx, table.tsx
│       └── download-chart-btn.tsx
│
├── hooks/                       # Custom hooks
│   ├── types.ts                # TypeScript interfaces
│   ├── sendData.ts             # Insert data (Server Action)
│   ├── fetch-data.ts           # Data fetching
│   ├── deleteRow.ts            # Delete operations
│   ├── dataBitacoraColumns.ts # Column configs
│   └── bitacora/
│       ├── useBitacoraTable.tsx
│       └── useDebounce.ts
│
├── lib/                        # Utilities & configs
│   ├── data/                   # Data operations
│   │   ├── bitacora.ts
│   │   └── updateRowBitacora.ts
│   ├── bitacora/              # Bitácora specific
│   │   ├── maps.ts            # Value mappings
│   │   ├── constants.ts
│   │   └── deleteRow.ts
│   ├── formatters/            # Data formatting
│   │   └── formatData.ts, date.ts
│   ├── configs/              # Configuration
│   │   └── dashboard.ts
│   └── utils.ts              # General utilities
│
├── types/                     # Type definitions
│   ├── bitacoraTable.ts
│   ├── fetchData.ts
│   ├── UsersFilterBitacora.ts
│   └── dashboardTable.ts
│
└── utils/                    # Utility modules
    ├── supabase/             # Supabase client/server
    │   ├── client.ts, server.ts
    │   └── middleware.ts
    └── bitacora/            # Bitácora utilities
        ├── goNextPage.ts, goPreviousPage.ts
        ├── formatDate.ts, bitacora.ts
```

---

## ⚙️ Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🏃‍♂️ How to Run

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
# Copy .env.example to .env.local and fill values

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## ✨ Key Features

- 📋 **Bitácora Management** — Full CRUD for log entries
- 📊 **Dashboard Analytics** — Charts and statistics tables
- 🔐 **Authentication** — Supabase Auth with protected routes
- 📱 **Responsive UI** — Mobile-friendly with sidebar navigation
- 📝 **Forms** — React Hook Form with validation
- 📈 **Tables** — Sortable, filterable with pagination
- 🔔 **Notifications** — Sonner toasts

---

## 🗄️ Database Tables (Supabase)

- `bitacora` — Main log entries
- `respuestas` — Response records

---

## 📦 Dependencies

```
@supabase/ssr          # Supabase SSR
@supabase/supabase-js # Supabase client
@radix-ui/*            # UI primitives (shadcn)
@tanstack/react-table # Table logic
react-hook-form        # Form handling
zod                    # Schema validation
recharts               # Charts
date-fns               # Date utilities
lucide-react           # Icons
sonner                 # Notifications
```

---

## 📝 Notes

- Uses **Server Actions** for data mutations
- Supabase configured for client & server usage
- Middleware handles session refresh
- Supabase Auth protects routes