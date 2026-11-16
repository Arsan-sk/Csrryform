# CARRYFORM — Troubleshooting & FAQ Guide

This guide addresses common scenarios, environment edge cases, and troubleshooting steps when developing, configuring, or deploying CARRYFORM.

---

## 1. Local Development & Port Conflicts

### Issue: Port 3000 is already in use (`EADDRINUSE`)
**Cause**: Another Next.js dev server or local application is running on port 3000.  
**Solution**:
- CARRYFORM includes a built-in clean command for Windows PowerShell:
  ```bash
  npm run dev:clean
  ```
- Alternatively, specify a custom port:
  ```bash
  npx next dev -p 3002
  ```

### Issue: `Node.js version mismatch` or syntax errors during build
**Cause**: Running an outdated Node.js runtime (e.g. Node 16 or 18.0).  
**Solution**: CARRYFORM requires **Node.js 20.x or 22.x LTS**. Upgrade Node via [nodejs.org](https://nodejs.org) or your version manager:
```bash
nvm use 22
```

---

## 2. Supabase Integration & Database Issues

### Issue: Console warning: `[CARRYFORM] Supabase health check failed — falling back to JSON provider`
**Cause**:
1. `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` has a typo.
2. The initial migration `0001_initial_schema.sql` has not been executed on your Supabase project, so tables like `collections` or `products` do not exist yet.
3. The database was paused or is unreachable.  
**Solution**:
- Ensure your project URL starts with `https://` and has no trailing slash.
- Ensure the anon key is the full public JWT key.
- Open **Supabase Dashboard -> SQL Editor**, paste `supabase/migrations/0001_initial_schema.sql`, and run it.
- Run `supabase/seed.sql` to populate initial demo rows.
- The application will automatically switch to the Supabase provider once the health query succeeds.

### Issue: `permission denied for table products` or empty public catalogue
**Cause**: Row Level Security (RLS) is enabled, but the public read policy is missing.  
**Solution**:
Ensure the migration applied the following grant and policy:
```sql
grant select on public.products to anon, authenticated;
create policy "Public can read active products"
  on public.products for select to anon, authenticated
  using (is_active = true);
```

---

## 3. Image Loading & Next.js Image Optimization

### Issue: External images fail to load with `Invalid src prop` or hostname error
**Cause**: Next.js requires external image hostnames to be whitelisted in `next.config.ts`.  
**Solution**:
Open `next.config.ts`. If you are referencing images from an external CDN or your own domain, add it to `images.remotePatterns`:
```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'your-project-id.supabase.co',
      },
    ],
  },
};
```

---

## 4. Admin Studio & Local Storage

### Issue: Changes made in the Admin Dashboard disappeared after clearing browser data
**Cause**: In the default demonstration mode, catalogue modifications are saved locally in the browser's `localStorage` (`carryform-admin-content-v1`). If browser history, site cookies, or local storage is wiped, the studio re-seeds from the original verified JSON files.  
**Solution**:
This is intended behavior for the safe local prototype. To achieve permanent cloud persistence across devices, connect Supabase following **[docs/SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**.

### Issue: Admin login says `Admin authentication is not configured for this environment`
**Cause**: You are running in production mode (`NODE_ENV === 'production'`), where the temporary development password (`admin` / `admin`) is automatically deactivated for security.  
**Solution**:
For local development, run `npm run dev`. For production, implement Supabase Auth in `src/lib/admin-auth.ts`.

---

## 5. Build & Cache Issues

### Issue: Turbopack or `.next` cache corruption
**Cause**: Interrupted builds or switching Node.js versions.  
**Solution**:
Delete the local cache and re-build:
```bash
# On Windows PowerShell
Remove-Item -Recurse -Force .next
npm run build

# On macOS / Linux
rm -rf .next
npm run build
```

---

## 6. Getting Additional Support

If you encounter an issue not covered in this guide:
1. Review the official documentation in the `docs/` folder:
   - [INSTALLATION.md](./INSTALLATION.md)
   - [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)
   - [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Verify all TypeScript types compile without errors with `npm run build`.
