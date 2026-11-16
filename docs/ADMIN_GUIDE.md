# CARRYFORM — Admin Workspace User Guide

The CARRYFORM administration dashboard provides a unified, professional content studio to manage products, photography references, collection doors, and brand settings.

This guide explains how to access, navigate, and utilize all capabilities of the admin studio.

---

## 1. Accessing the Admin Workspace

There are two ways to open the administration studio:

1. **Direct Navigation**:
   Open **[http://localhost:3000/admin](http://localhost:3000/admin)** in your browser.
2. **Footer Easter Egg Trigger**:
   Scroll to the very bottom of any public page. Next to the creator credit text (&ldquo;Created by chrysa&rdquo;), you will notice a waving hand icon (👋). **Double-click the waving hand** to navigate to `/admin`.

---

## 2. Demonstration Authentication

When running in local development mode (`NODE_ENV !== 'production'`), CARRYFORM provides a development account:

| Field | Default Value | Environment Variable Override |
|---|---|---|
| **Username** | `admin` | `NEXT_PUBLIC_CARRYFORM_ADMIN_USERNAME` |
| **Password** | `admin` | `NEXT_PUBLIC_CARRYFORM_ADMIN_PASSWORD` |

> [!WARNING]
> **DEVELOPMENT NOTICE**:
> This authentication session uses browser `sessionStorage` and is intended strictly for local development and client demonstrations. It is **NOT** production-grade security. Before launching your commercial store publicly, configure Supabase Auth (see Section 8).

---

## 3. Overview Dashboard

The **Overview** panel displays high-level metrics derived directly from your current catalogue state:
- **Active in Showroom**: Total products currently visible on public storefront pages.
- **Women's Collection**: Count of handbags, shoulder bags, and tote styles.
- **School & Student**: Count of daypacks, campus backpacks, and utility study bags.
- **Featured Pieces**: Spotlight products prioritized in curated homepage sections.
- **Workspace Status**: Displays local repository save timestamps and confirms storage health.

---

## 4. Product Catalogue Management

Click **Products** in the left sidebar navigation to open the full product management suite.

### 4.1 Search & Composable Filters
Above the table, use the filter bar to compose multi-criteria queries:
- **Text Search**: Type any product name, short description, or slug (e.g. `forma`, `leather`, `backpack`).
- **Audience Filter**: Filter by Women's, Student, Everyday, or Unisex.
- **Category Filter**: Filter by specific bag types (e.g. Handbags, School Backpacks, Totes).
- **Collection Filter**: Filter products assigned to a specific collection (e.g. The Women's Edit, School & Student).
- **Status Filter**: View Active items only, or Hidden (inactive) items.
- **Featured Filter**: Filter items by their featured spotlight flag.
- **New Badge Filter**: Filter items marked with the &ldquo;NEW&rdquo; badge.
- **Reset Filters**: One-click button clears all active filters and restores full catalogue view.

### 4.2 Product Table & Visual Thumbnails
- Every product displays a **visual photograph thumbnail** directly in the table row so you can instantly recognize bags without opening them.
- If an image reference is missing or broken, a graceful fallback placeholder is displayed.
- Click any **Active / Hidden** status pill to immediately toggle public visibility.
- Click **★ Yes / —** in the Featured column to toggle homepage spotlight status.
- Click **NEW / —** in the New column to toggle the new arrival badge on product cards.
- Click the **↗** icon to open the live public product page in a new browser tab.
- Click **Edit** to open the comprehensive product editing modal.
- Click **✕** to trigger deletion with confirmation.

### 4.3 Multi-Product Selection & Bulk Actions
- Check the box next to any product to select it.
- Click the **top-left header checkbox** to select all visible filtered products in one click.
- When 1 or more products are selected, the **sticky bulk actions toolbar** appears:
  - **Activate / Deactivate**: Bulk toggle visibility for all selected items.
  - **+ Featured / - Featured**: Bulk add or remove featured status.
  - **+ New / - New**: Bulk add or remove new arrival badges.
  - **Delete (X)**: Triggers a confirmation dialog to delete all selected items at once.
  - **Deselect All**: Immediately clears the active selection.

---

## 5. Creating & Editing Products

Click **+ Add New Product** or click **Edit** on any row to open the tabbed editor modal:

### Tab 1: Essentials
- **Product Name**: Required title of the product.
- **Slug**: Unique URL identifier. Click **Auto-generate from name** to instantly create a clean kebab-case slug. CARRYFORM validates uniqueness and prevents duplicate slugs.
- **Audience & Product Type**: Classify the item (e.g. Women's / Student, Handbag / Backpack / Tote).
- **Category**: Select the primary category.
- **Short Description**: Subtitle displayed on grid cards.
- **Editorial Story**: Long-form narrative and tactile description displayed on product detail pages.
- **Collection Associations**: Multi-checkbox selection allows assigning a product to multiple collections.

### Tab 2: Pricing & Status
- **Price (Amount)**: Numerical price (e.g. `4200`). Leave empty for enquiry-only / unpriced bags.
- **Compare-at Price (MSRP)**: Original price for showing discount strikethroughs.
- **Currency Code**: Default `INR`, customizable to `USD`, `EUR`, `GBP`, etc.
- **Availability**: Set to `In Stock & Available`, `Enquire for Availability`, or `Unavailable / Archive`.
- **Sort Order**: Integer controlling display sequence in catalogues (lower numbers appear first).

### Tab 3: Photography & Asset Management
- View all currently assigned images with live thumbnail previews.
- **Primary Image**: The main showroom photo. Click **Make primary** on any image to promote it.
- **Add Photography**: Enter a local asset path (e.g. `/images/products/demo-bag.jpg`) or external HTTPS URL, assign descriptive alt text, and select the image role (`Primary`, `Gallery`, `Detail`, `Lifestyle`).
- **Remove Asset**: Click ✕ to remove any image reference.

### Tab 4: Specifications
Enter structured craftsmanship and utility details:
- **Material & Exterior**: e.g. *Full-grain vegan leather, antique brass hardware*
- **Dimensions**: e.g. *28cm × 22cm × 11cm*
- **Closure**: e.g. *Magnetic snap with central zip partition*
- **Strap Details**: e.g. *Detachable crossbody strap + rolled top handles*
- **Capacity (Litres)**: For student backpacks (e.g. `24`)
- **Laptop Sleeve Size**: e.g. *Up to 15.6 inch*
- **Pockets & Interior**: e.g. *2 slip pockets, 1 zip security pocket*
- **Care Instructions**: e.g. *Wipe clean with a soft dry cloth*

### Tab 5: Placement & Flags
- Toggle **Active in Showroom**, **Featured Piece**, and **New Arrival Badge**.
- Switch **Content Record Status** between `Demonstration Data` and `Verified Production Data`.

---

## 6. Collections & Website Settings

### 6.1 Collections Panel
- View product counts automatically associated with each collection.
- Toggle **Featured Door** status to control which collections are spotlighted on the homepage.

### 6.2 Website Content & SEO Panel
- **Brand Identity**: Update Brand Name (`CARRYFORM`), Descriptor, Tagline, and Default SEO Meta Description.
- **Contact & Footer**: Update showroom physical address, customer support email, and the required footer creator credit text.
- Click **Save All Content Changes** to persist across your local environment.

---

## 7. Resetting Demonstration Content

If you wish to discard all local test modifications and restore the original verified sample catalogue:

1. Navigate to **Content** in the left sidebar.
2. Scroll to the bottom card: **Reset Local Demonstration Content**.
3. Click **Reset Demo Content** and confirm the browser prompt.
4. The local repository will clear `localStorage` and re-seed from the verified JSON files.

---

## 8. Production Authentication Roadmap

To transition the admin workspace to production:
1. Follow **[docs/SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** to configure your Supabase backend.
2. In Supabase Dashboard -> **Authentication**, enable Email/Password or Magic Link auth.
3. Replace the demo session in `src/lib/admin-auth.ts` with standard Supabase Auth session checks (`supabase.auth.getUser()`).
4. Ensure all admin write mutations communicate with server-side Route Handlers authenticated via session cookies.
