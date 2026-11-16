# CARRYFORM — Installation & Quick Start Guide

Welcome to **CARRYFORM**, a design-led editorial accessories and bag showroom template engineered with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, GSAP, and Motion.

This guide provides step-by-step instructions for extracting, installing, and running CARRYFORM on your local development machine.

---

## 1. Prerequisites

Before installing, ensure your machine has the following tools installed:

- **Node.js**: `v20.0.0` or higher (`v22.x` LTS recommended). Verify with:
  ```bash
  node -v
  ```
- **npm**: `v10.x` or higher (bundled with Node.js), or your preferred package manager (`pnpm` / `yarn` / `bun`). Verify with:
  ```bash
  npm -v
  ```
- **Code Editor**: Visual Studio Code or any modern code editor.
- **Git** (optional, recommended for version tracking).

---

## 2. Unpacking & Folder Setup

1. Extract the downloaded `carryform.zip` archive into your desired workspace directory (e.g. `~/projects/carryform` or `D:\projects\carryform`).
2. Open your terminal or command prompt and navigate to the project root directory:
   ```bash
   cd carryform
   ```

---

## 3. Installing Dependencies

Install the required npm dependencies using the lockfile:

```bash
npm install
```

This installs all dependencies including:
- **Next.js 16** with Turbopack support
- **React 19 & React DOM 19**
- **Tailwind CSS v4** (`@tailwindcss/turbopack`)
- **GSAP & @gsap/react** (choreographed scroll animations)
- **Motion** (component micro-interactions and transitions)
- **Swiper** (touch carousel interactions)
- **Supabase JavaScript SDK** (`@supabase/supabase-js`, `@supabase/ssr`)
- **Zod** (runtime schema validation)

---

## 4. Environment Configuration (Zero-Config Default)

CARRYFORM is designed to run **out-of-the-box in JSON Demonstration Mode** without requiring any external accounts, API keys, or databases.

If you wish to customize environment variables or prepare for future Supabase integration:

1. Copy the provided `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. For default local development, you do not need to modify any values in `.env.local`.

---

## 5. Running the Local Development Server

Start the development server:

```bash
npm run dev
```

If port `3000` is already in use by another process on your machine, you can run our clean script:
```bash
npm run dev:clean
```

Your terminal will display:
```
▲ Next.js 16.4.5 (Turbopack)
- Local: http://localhost:3000
✓ Ready in ~1s
```

Open your browser and navigate to:
**[http://localhost:3000](http://localhost:3000)**

---

## 6. Accessing the Admin Workspace

CARRYFORM includes a local content management studio for testing product and collection updates:

1. Visit **[http://localhost:3000/admin](http://localhost:3000/admin)** directly, or **double-click the waving hand (👋)** next to the creator credit in the public website footer.
2. Sign in with the temporary development credentials:
   - **Username**: `admin`
   - **Password**: `admin`
3. The dashboard allows searching, filtering, creating, editing, and deleting products. All changes are safely isolated in your browser's local storage and can be reset at any time via **Reset demo content**.

---

## 7. Verifying the Production Build

Before deploying to production, verify that the project compiles cleanly:

```bash
npm run build
```

A successful build will display:
```
✓ Compiled successfully
✓ Generating static pages (10/10)
✓ Finalizing page optimization
```

You can preview the production build locally with:
```bash
npm run start
```

---

## 8. Next Steps

- To connect your own PostgreSQL backend and activate server persistence, follow **[docs/SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**.
- To learn more about managing catalogue items, read **[docs/ADMIN_GUIDE.md](./ADMIN_GUIDE.md)**.
- To deploy to Vercel, read **[docs/DEPLOYMENT.md](./DEPLOYMENT.md)**.
- For troubleshooting common setup issues, see **[docs/TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**.
