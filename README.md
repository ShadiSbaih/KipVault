<div align="center">
  <img src="./src/app/apple-icon.png" alt="KipVault Icon" width="88" height="88" />
  <h1>KipVault</h1>
  <p><strong>Lock it. Pin it. Keep it.</strong><br />Editorial-grade cloud file vault and permissioned sharing platform backed by Pinata IPFS.</p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15.5.29-0d0d0d?style=for-the-badge&logo=nextdotjs&logoColor=fbda5f" alt="Next.js 15" />
    <img src="https://img.shields.io/badge/React-19-0d0d0d?style=for-the-badge&logo=react&logoColor=fbda5f" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5-0d0d0d?style=for-the-badge&logo=typescript&logoColor=fbda5f" alt="TypeScript 5" />
    <img src="https://img.shields.io/badge/Hono-4.6-0d0d0d?style=for-the-badge&logo=hono&logoColor=fbda5f" alt="Hono" />
    <img src="https://img.shields.io/badge/Better_Auth-1.1-0d0d0d?style=for-the-badge&logo=shield&logoColor=fbda5f" alt="Better Auth" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose_8-0d0d0d?style=for-the-badge&logo=mongodb&logoColor=fbda5f" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Pinata-IPFS-fbda5f?style=for-the-badge&labelColor=0d0d0d" alt="Pinata IPFS" />
  </p>
</div>

---

## Overview

**KipVault** is a full-stack file storage and collaboration web application built with Next.js App Router, Hono, Better Auth, MongoDB, and Pinata IPFS. Every uploaded asset is pinned to IPFS, indexed in MongoDB with automatic MIME-type classification, and retrieved via short-lived signed gateway URLs.

The interface implements the **KipVault Design System** defined in [`DESIGN.md`](./DESIGN.md): a high-contrast light editorial system anchored by Paper (`#ffffff`), Ink (`#0d0d0d`), Butter Highlight (`#fbda5f`), Fog (`#edeef0`), and Signal Blue (`#006aff`), paired with **Phudu** uppercase display typography and **Inter** UI typography.

---

## Core Capabilities

| Capability | Description |
| :--- | :--- |
| **IPFS-Backed Storage** | Uploads files directly to Pinata IPFS with user metadata and retrieves them via 5-minute signed gateway URLs (`createSignedURL`). |
| **Automatic Vault Rooms** | Classifies uploads by MIME type into **Documents**, **Images**, **Videos**, and **Others** (`document`, `image`, `video`, `audio`, `other`). |
| **Scoped Email Sharing** | Shares any owned file with another user by email with explicit `file:read`, `file:update`, and `file:delete` permissions. |
| **Real-Time Upload Progress** | Supports multi-file uploads with per-file circular progress indicators and automatic React Query cache updates. |
| **Infinite Pagination & Search** | Paginates vault rooms (9 items per page via Intersection Observer) alongside debounced filename search across your vault. |
| **Quota Accounting** | Auto-provisions a storage subscription on sign-in (~15 GiB default quota) and tracks `usedStorage` vs. `selectedStorage` in real time. |
| **Google OAuth Sessions** | Uses Better Auth with MongoDB persistence and Next.js middleware route protection. |

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js `15.5.29` (App Router, Turbopack), React `19`, TypeScript `5` |
| **Styling & UI** | Tailwind CSS `3.4`, Radix UI primitives, Remixicon, Lucide React, Sonner |
| **Typography** | `Phudu` (display headings) & `Inter` (UI & body) via `next/font/google` |
| **API Layer** | Hono `4.6` (`/api/v1/*`) + Next.js Server Actions |
| **State & Forms** | TanStack React Query `5`, React Hook Form `7`, Zod `3`, Axios |
| **Authentication** | Better Auth `1.1` (Google OAuth + MongoDB adapter) |
| **Database** | MongoDB + Mongoose `8.9` |
| **Storage** | Pinata SDK `1.10` (IPFS pinning & signed gateway URLs) |

---

## Project Structure

```text
kipvault/
├── DESIGN.md                                  # Brand & UI design system specification
├── .env.example                               # Environment variable template
├── package.json
├── tailwind.config.ts                         # DESIGN.md tokens, fonts, and radii
├── public/
│   ├── kipvault-logo.svg                      # Full KipVault vector lockup
│   ├── document.png                           # DESIGN.md category icon (Documents)
│   ├── image.png                              # DESIGN.md category icon (Images)
│   ├── video.png                              # DESIGN.md category icon (Videos)
│   ├── other.png                              # DESIGN.md category icon (Others/Archive)
│   └── not-found.png                          # DESIGN.md empty vault room illustration
└── src/
    ├── middleware.ts                          # Auth guard & / -> /dashboard redirect
    ├── action/
    │   ├── auth.action.ts                     # getServerSession()
    │   ├── file.action.ts                     # generateUrl, deleteFile, renameFile, updateFilePermissions
    │   └── subscription.action.ts             # getSubscription()
    ├── app/
    │   ├── icon.svg                           # Browser tab SVG icon
    │   ├── favicon.ico                        # Multi-res (16/32/48) browser tab icon
    │   ├── apple-icon.png                     # 180x180 touch/pinned-tab icon
    │   ├── globals.css                        # CSS variables & base typography rules
    │   ├── layout.tsx                         # Root layout, fonts, metadata, providers
    │   ├── (auth)/
    │   │   ├── layout.tsx                     # Split Pure Black / Paper auth layout
    │   │   ├── sign-in/page.tsx
    │   │   ├── sign-up/page.tsx
    │   │   └── _components/auth-form.tsx
    │   ├── (dashboard)/
    │   │   ├── layout.tsx                     # Sidebar + Header + Fog vault shell
    │   │   ├── dashboard/
    │   │   │   ├── page.tsx                   # Redirects /dashboard -> /dashboard/documents
    │   │   │   └── [page]/
    │   │   │       ├── page.tsx               # Dynamic vault room & storage route
    │   │   │       └── _components/
    │   │   │           ├── page-files.tsx
    │   │   │           └── page-subscription.tsx
    │   │   └── _components/
    │   │       ├── app-sidebar.tsx
    │   │       ├── breadcrumb.tsx
    │   │       ├── header.tsx
    │   │       ├── header-profile.tsx
    │   │       ├── search-bar.tsx
    │   │       ├── uplaod-button.tsx
    │   │       ├── file-card/{card.tsx,menu.tsx}
    │   │       └── subscription/subs-widget.tsx
    │   └── api/
    │       ├── auth/[...all]/route.ts         # Better Auth endpoint
    │       └── v1/
    │           ├── [[...route]]/route.ts      # Hono API entry (/api/v1)
    │           └── _routes/file.route.ts      # File listing, search, and upload routes
    ├── components/
    │   ├── brand/
    │   │   ├── logo.tsx                       # Reusable <KipVaultLogo /> component
    │   │   └── category-badge.tsx             # Framed category PNG badge
    │   ├── custom/{p.tsx,sidebar-trigger.tsx}
    │   ├── icons/kebab.tsx
    │   ├── styles/button.ts
    │   └── ui/*                               # DESIGN.md-styled Radix/shadcn primitives
    ├── context/query-provider.tsx
    ├── hooks/{use-mobile.tsx,use-toast.ts}
    ├── lib/
    │   ├── contants.ts                        # Time constants (e.g., FIVE_MINUTES)
    │   ├── env.ts                             # Environment variable exports
    │   ├── utils.ts                           # MIME classification, size formatting, helpers
    │   ├── better-auth/{auth.ts,auth-client.ts,auth-types.ts,db.ts}
    │   ├── database/{db.ts,schema/{file.model.ts,subscription.model.ts}}
    │   ├── fetch/files.fetch.tsx
    │   └── pinata/config.ts
    └── props/types.ts
```

---

## Getting Started

### 1. Prerequisites

* **Node.js 20+** (or **Bun**)
* **MongoDB** cluster (e.g., MongoDB Atlas)
* **Google Cloud OAuth 2.0** client credentials
* **Pinata** account with a JWT and dedicated IPFS Gateway URL

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` in the project root and populate every required key:

```bash
cp .env.example .env
```

| Variable | Required | Description |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_APP_URL` | Yes | Public application origin (e.g., `http://localhost:3000`). |
| `BETTER_AUTH_SECRET` | Yes | High-entropy 32+ byte secret for session signing (`openssl rand -hex 32`). |
| `BETTER_AUTH_URL` | Yes | Base URL used by Better Auth client and server (`http://localhost:3000`). |
| `MONGODB_URI` | Yes | MongoDB connection string used by both Mongoose and Better Auth's adapter. |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth 2.0 Client ID. |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth 2.0 Client Secret. |
| `PINATA_JWT` | Yes | Pinata API JWT with file upload and deletion permissions. |
| `NEXT_PUBLIC_GATEWAY_URL` | Yes | Pinata gateway domain used to sign file download URLs. |
| `CRON_SECRET` | No | Optional bearer secret for scheduled endpoints when deployed. |

> **Google OAuth Redirect URI:** Register `<BETTER_AUTH_URL>/api/auth/callback/google` in your Google Cloud Console OAuth credentials.

### 4. Run Locally

```bash
npm run dev
```

Open [`http://localhost:3000`](http://localhost:3000). Unauthenticated requests redirect to `/sign-in`; authenticated requests land in `/dashboard/documents`.

### Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `dev` | `next dev --turbopack` | Start local development server with Turbopack. |
| `build` | `next build` | Create optimized production build and run type/lint checks. |
| `start` | `next start` | Serve the production build. |
| `lint` | `next lint` | Run ESLint across the codebase. |

---

## Routing & Authentication Flow

1. **Middleware (`src/middleware.ts`)**:
   * `/` redirects to `/dashboard`.
   * `/dashboard/*` requires an active Better Auth session; unauthenticated visitors redirect to `/sign-in`.
   * `/sign-in` and `/sign-up` redirect authenticated users to `/dashboard`.
2. **Dashboard Entry (`src/app/(dashboard)/dashboard/page.tsx`)**:
   * Redirects `/dashboard` to `/dashboard/documents`.
3. **Auto-Provisioned Quota (`src/lib/better-auth/auth.ts`)**:
   * On successful OAuth sign-in, Better Auth's `after` hook ensures a `Subscription` document exists for the user (`selectedStorage: 16105174016` bytes, `usedStorage: 0`) and links it to the user record.

---

## API & Server Actions Reference

### HTTP Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET/POST` | `/api/auth/[...all]` | Better Auth OAuth, session, and sign-out handler. |
| `GET` | `/api/v1/files?search=<query>` | Case-insensitive filename search scoped to the authenticated user. |
| `GET` | `/api/v1/files/:category?page=<n>` | Paginated file list (`9` files/page) for `document`, `image`, `video`, `other`, or aggregated `shared` files matching the user's email. |
| `POST` | `/api/v1/files/upload` | Validates session and storage quota (`selectedStorage > usedStorage`), pins `multipart/form-data` file to Pinata, creates a `File` document, and increments `usedStorage`. |

### Server Actions

| Action | Module | Purpose |
| :--- | :--- | :--- |
| `generateUrl(cid)` | `src/action/file.action.ts` | Generates a signed Pinata gateway URL valid for 5 minutes (`FIVE_MINUTES`). |
| `renameFile({ file, values })` | `src/action/file.action.ts` | Updates the file's display `name` in MongoDB by `pinataId`. |
| `updateFilePermissions(file, values)` | `src/action/file.action.ts` | Upserts an entry in `sharedWith` (`email` + `permissions`: `file:read`, `file:update`, `file:delete`). |
| `deleteFile(file)` | `src/action/file.action.ts` | Unpins/deletes the file from Pinata and removes the `File` document from MongoDB. |
| `getSubscription()` | `src/action/subscription.action.ts` | Fetches the authenticated user's `Subscription` quota document. |
| `getServerSession()` | `src/action/auth.action.ts` | Reads the current Better Auth session from incoming request headers. |

---

## Data Models

### `File` (`src/lib/database/schema/file.model.ts`)

| Field | Type | Notes |
| :--- | :--- | :--- |
| `pinataId` | `string` | Pinata file identifier. |
| `name` | `string` | Display filename. |
| `cid` | `string` | IPFS Content Identifier. |
| `size` | `number` | File size in bytes. |
| `mimeType` | `string` | Detected MIME type. |
| `category` | `string` | `document`, `image`, `video`, `audio`, or `other`. |
| `userInfo` | `{ id, name }` | Owner's MongoDB user ID and display name. |
| `sharedWith` | `{ email, permissions[] }[]` | Scoped sharing list (`file:read`, `file:update`, `file:delete`). |
| `createdAt` / `updatedAt` | `Date` | Mongoose timestamps. |

### `Subscription` (`src/lib/database/schema/subscription.model.ts`)

| Field | Type | Notes |
| :--- | :--- | :--- |
| `subscriber` | `ObjectId` | Reference to the owning user. |
| `selectedStorage` | `number` | Allocated quota in bytes (default: `16105174016`). |
| `usedStorage` | `number` | Consumed storage in bytes (default: `0`). |
| `createdAt` / `updatedAt` | `Date` | Mongoose timestamps. |
