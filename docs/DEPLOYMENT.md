# CARRYFORM — Production Deployment Guide (Vercel)

CARRYFORM is built with Next.js 16 App Router and is optimized for zero-configuration global deployment on **Vercel**, the native cloud platform for Next.js.

This guide walks you through deploying your CARRYFORM website to production.

---

## 1. Important Commercial Note on Supabase vs JSON Mode

> [!IMPORTANT]
> **Supabase integration is NOT active by default.**
> When deployed without environment variables, CARRYFORM runs automatically in **JSON Demonstration Mode**, serving catalogue content from local static data with lightning-fast edge performance.
> If you wish to connect Supabase, ensure you have first completed the steps in **[docs/SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**.

---

## 2. Preparing Your Git Repository

1. If you extracted CARRYFORM from a ZIP file, initialize a Git repository in your project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commercial release commit"
   ```
2. Create a private or public repository on **GitHub**, **GitLab**, or **Bitbucket**.
3. Push your code to your remote repository:
   ```bash
   git remote add origin https://github.com/your-username/your-carryform-repo.git
   git branch -M main
   git push -u origin main
   ```

---

## 3. Deploying to Vercel via Web Dashboard

1. Sign in to your account at **[https://vercel.com](https://vercel.com)**.
2. Click **Add New…** -> **Project**.
3. Find your CARRYFORM repository from your GitHub integration and click **Import**.
4. Configure the Project Settings:
   - **Framework Preset**: `Next.js` (detected automatically)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (or Next.js default `next build`)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

---

## 4. Configuring Production Environment Variables

Under the **Environment Variables** section on the Vercel import screen:

### Scenario A: Deploying in Static / JSON Mode (Recommended for fast launch)
You do not need to enter any database keys! Just optionally set your production domain:
- `NEXT_PUBLIC_SITE_URL`: `https://yourdomain.com`

### Scenario B: Deploying with Supabase Connected
Add the credentials obtained from your Supabase project dashboard:
- `NEXT_PUBLIC_SITE_URL`: `https://yourdomain.com`
- `NEXT_PUBLIC_SUPABASE_URL`: `https://your-project-id.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOi...your-anon-key...`
- `SUPABASE_SERVICE_ROLE_KEY`: `your-service-role-key` (Optional — keep strictly server-only)

> [!CAUTION]
> **DO NOT** configure `NEXT_PUBLIC_CARRYFORM_ADMIN_USERNAME` or `NEXT_PUBLIC_CARRYFORM_ADMIN_PASSWORD` in your production Vercel environment variables. The local development admin login is automatically disabled in production (`NODE_ENV === 'production'`). Configure Supabase Auth before opening admin to public staff.

---

## 5. Completing the Deployment

1. Click **Deploy**.
2. Vercel will build your project, execute Next.js page generation, and deploy across their global edge network (~1 minute).
3. Upon completion, you will see the celebration screen with your live production URL (e.g. `https://carryform-production.vercel.app`).

---

## 6. Configuring Custom Domains & SSL

To attach your brand's custom domain (e.g. `carryform.in` or `yourbrand.com`):

1. In your Vercel Project Dashboard, navigate to **Settings** -> **Domains**.
2. Enter your domain name and click **Add**.
3. Follow the DNS instructions provided by Vercel:
   - For an Apex domain (`yourbrand.com`): Add an `A` record pointing to `76.76.21.21`.
   - For a Subdomain (`shop.yourbrand.com` or `www.yourbrand.com`): Add a `CNAME` record pointing to `cname.vercel-dns.com`.
4. Vercel will automatically provision a free, auto-renewing SSL certificate.

---

## 7. Post-Deployment Verification Checklist

Verify the following after deploying:
- [ ] Homepage loads instantly with all hero photography and zipper reveal animations intact.
- [ ] Collection pages (`/collections/womens-edit`, `/collections/school-student`) filter and sort correctly.
- [ ] Product detail pages load high-res photography and specifications without image errors.
- [ ] Enquiries submitted via the Contact form (`/contact`) execute without server errors.
- [ ] Floating WhatsApp button links to your verified customer care number.
- [ ] Footer creator credit remains intact and functional.
