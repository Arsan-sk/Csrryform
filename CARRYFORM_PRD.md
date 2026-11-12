# CARRYFORM — Product Requirements Document
## The Art of Carrying | Brand showcase and product-discovery website

**Document status:** Implementation-ready product and experience specification  
**Version:** 1.0  
**Date:** 8 November 2026  
**Working brand:** CARRYFORM *(provisional; trademark/domain availability not verified)*  
**Tagline:** Every day has a way to carry.  
**Primary platform:** Responsive web  
**Primary conversion:** Product enquiry / WhatsApp contact  
**Initial commerce scope:** Showcase and enquiry; no cart, payment, or checkout

---

# 1. Executive summary

CARRYFORM is a design-led, multi-page product showcase website for a small bag retailer selling women's handbags and purses alongside school and student bags. The experience should feel like entering a contemporary accessories showroom: editorial, tactile, curated, visually memorable, and easy to navigate.

The website is not a conventional e-commerce storefront. Its first release is intended to build brand perception, present the catalogue, help visitors discover relevant products, explain product details, and convert interest into enquiries or visits.

The brand's merchandising emphasis is intentionally weighted toward women's bags, while giving school and student bags a meaningful and visible role:

- **Planning mix: approximately 65% women's bags and 35% school/student bags** across homepage product emphasis, sample content, and campaign imagery. This is a creative planning ratio, not a permanent inventory rule.
- Women's collections are the lead editorial world.
- School/student collections are a co-equal top-level discovery path, not a buried subcategory.
- School imagery should feel confident, modern, practical, and age-appropriate—not childish or like a separate unrelated brand.
- Homepage art direction must include both worlds. At least one strong school/student campaign moment must appear above the fold or immediately after the opening hero, and the school/student collection door must be visible without deep scrolling.

The central creative idea is **“The Art of Carrying.”** The site tells a story through arrival, discovery, inspection, confidence, and contact. Its visual motifs are opening, unfolding, carrying, display plinths, material details, and one signature zipper-inspired reveal. The zipper is a recognisable accent, not a repetitive gimmick.

The technical foundation is Next.js App Router, TypeScript, and a provider-based data layer that uses local JSON by default and Supabase when correctly configured and reachable. GSAP/ScrollTrigger owns complex scroll choreography; Motion for React owns component-level transitions and gestures; Swiper is reserved for appropriate touch-first carousels; Locomotive Scroll v5 is optional and must pass an integration/performance proof before adoption; Three.js / React Three Fiber is reserved for one genuinely useful 3D feature when real product models exist.

---

# 2. Product vision and goals

## 2.1 Vision

Create a memorable digital showroom where visitors can explore bags by lifestyle and need, appreciate the visual character of each product, understand practical details, and contact the shop with confidence.

## 2.2 Business goals

1. Establish a distinctive, credible brand identity.
2. Showcase women's handbags, purses, totes, shoulder bags, sling bags, and related styles.
3. Give school and student bags substantial visibility and useful product information.
4. Improve product discovery through clear categories and curated collections.
5. Increase qualified enquiries through WhatsApp and contact actions.
6. Make catalogue updates possible without rebuilding page layouts.
7. Support a future transition from local JSON to Supabase without rewriting UI components.
8. Create a strong visual foundation that can later support real inventory, an admin workflow, and e-commerce if the business chooses to expand.

## 2.3 Visitor goals

- Quickly understand what the business sells.
- Identify the correct product world: women's bags or school/student bags.
- Browse products without getting lost in decorative interactions.
- Inspect photos, colours, dimensions, compartments, materials, and other relevant details where the business has supplied them.
- Know whether a product is available or whether availability must be confirmed.
- Enquire through WhatsApp or the contact page.
- Find the shop's real address, hours, and social channels once verified.

## 2.4 Non-goals for release 1

- Online payment, checkout, shipping calculation, order fulfilment, or cart.
- Customer accounts, wishlists, or order history.
- A full inventory-management/admin dashboard.
- Fake reviews, fake stock counts, false scarcity, or invented product claims.
- Mandatory 3D for every product.
- A complex CMS before the catalogue and content workflow are understood.
- Heavy animation on every section or every route.

---

# 3. Brand and creative direction

## 3.1 Working brand identity

**Name:** CARRYFORM  
**Descriptor:** Bags · Accessories · Everyday Style  
**Tagline:** Every day has a way to carry.  
**Campaign thought:** The Art of Carrying  
**Positioning:** Accessible premium accessories showroom.

CARRYFORM is a working name selected for the prototype and PRD. Before public launch, the owner must verify business-name, trademark, domain, and social-handle availability. The website must make the brand name, logo, and descriptor easy to replace from a central site configuration.

## 3.2 Brand personality

- Considered, not ostentatious.
- Stylish, not intimidating.
- Practical, not utilitarian-looking.
- Warm, not overly sentimental.
- Modern, not trend-chasing.
- Curated, not cluttered.

## 3.3 Audience groups

### Audience A — Women's bags (primary editorial audience; target planning share 65%)

People exploring handbags and purses for everyday use, outings, work, college, travel, gifting, and personal style. They need clear photos, style cues, size/context, colours, materials, closure types, and practical details where known.

### Audience B — School and student bags (substantial secondary audience; target planning share 35%)

Parents/guardians, school students, and college students looking for bags suited to daily routines. They need clear product imagery and practical information such as dimensions, capacity, compartments, strap type, material, closure, and intended use where the shop has verified those details.

This audience must not be treated as an afterthought. It gets a top-level navigation entry, a distinct collection landing experience, a dedicated homepage campaign section, category-specific product details, and a meaningful share of demo products and photography.

### Audience C — Gift buyers / general browsers

Visitors who may not know the exact product category. They need a curated route into popular products, new arrivals, and contact assistance.

## 3.4 Visual system

### Palette

| Token | Suggested value | Use |
|---|---:|---|
| Warm ivory | `#F4F0E8` | Main canvas and light surfaces |
| Espresso | `#30251F` | Primary text, navigation, strong contrast |
| Muted wine | `#813E45` | Signature accent and primary CTA |
| Soft sage | `#A5AD96` | Supporting accent, especially utility/student campaign details |
| Brushed brass | `#C5A16B` | Small decorative details, hardware references |
| White | `#FFFFFF` | Cards and clean product backgrounds |
| Ink | `#171513` | High-contrast text where needed |

Colour usage must pass contrast checks. Brass is decorative and must not be used as small body text on ivory. The muted wine is the main action accent; sage is secondary, not a competing CTA colour.

### Typography

- Display face: elegant editorial serif for large statements and selected collection titles.
- UI/body face: highly legible sans-serif for navigation, descriptions, product specifications, and forms.
- Metadata face: restrained mono or compact sans-serif for product codes, category labels, and chapter numbering.
- Use a consistent type scale and responsive clamp-based sizing.
- Apply the golden ratio (~1.618) selectively to layout relationships, such as a 62/38 split or headline-to-supporting-copy scale. Do not force every typography size into a golden-ratio progression; readability and hierarchy take precedence.

### Layout principles

- Editorial grid with generous whitespace.
- Product imagery is the visual hero.
- Use asymmetry sparingly and intentionally.
- Align text and product image baselines consistently.
- Use a 12-column desktop grid; collapse to 6/4/2-column responsive logic as appropriate.
- Keep the page content width readable; do not stretch long paragraphs across ultra-wide screens.
- Product cards must remain recognisable and comparable even when art-directed differently.

## 3.5 Image art direction and audience balance

The imagery must not default to a women-only fashion moodboard. The image set must intentionally represent both product worlds.

**Planning allocation for homepage/editorial imagery:**
- Approximately 65% women's bag imagery.
- Approximately 35% school/student bag imagery.

The ratio is a creative guide, not a rigid count on every viewport. A user must not need to scroll through many women's sections before discovering the school collection.

**Required school/student visual moments:**
1. One prominent school/student bag campaign image or hero-slide.
2. One clearly visible school/student collection card in the first collection-discovery section.
3. A dedicated school/student category landing page with its own hero.
4. Multiple product cards showing different bag shapes and use cases.
5. Close-up/detail photography where available: straps, padding, zips, pockets, compartments, bottle pockets, fabric, and stitching.
6. At least one practical product detail layout with dimensions/capacity/compartments where supplied.

School imagery should look contemporary and aspirational while remaining age-appropriate. Do not use identifiable minors without appropriate rights and consent. Prefer product-only imagery, adult/college-age models with appropriate licensing, or non-identifiable lifestyle compositions.

## 3.6 Motif language

- **Unfolding:** panels and imagery open into view.
- **Zipper pull:** one signature reveal / chapter transition.
- **Display plinths:** products presented as curated objects.
- **Carrying motion:** a restrained product entrance or shift into position.
- **Material inspection:** macro detail crops and annotated callouts.
- **Collection index:** editorial numbering and concise chapter labels.

Do not repeat the zipper motif in every navigation event. A single strong signature interaction creates more brand memory than constant repetition.

---

# 4. Information architecture and routes

## 4.1 Global navigation

Desktop primary navigation:
- Home
- Women's Bags
- School & Student
- Everyday & Travel
- About
- Contact

A search icon/action may be included if catalogue size justifies it. The logo returns home. The mobile navigation uses an accessible menu drawer with the same hierarchy.

Suggested collection taxonomy:
- Women's Bags
  - Handbags
  - Shoulder Bags
  - Sling / Crossbody Bags
  - Tote Bags
  - Purses / Wallets (only if stocked)
- School & Student
  - School Backpacks
  - College Backpacks
  - Lunch / Utility Bags (only if stocked)
- Everyday & Travel
  - Everyday Backpacks
  - Travel / Weekender Bags (only if stocked)
  - Utility / Multi-purpose Bags (only if stocked)

Categories are data-driven. Do not render empty categories. Category names may be adjusted to match the actual inventory.

## 4.2 Route map

| Route | Page |
|---|---|
| `/` | Home showroom |
| `/collections` | All collections |
| `/collections/[slug]` | Collection landing / product listing |
| `/products/[slug]` | Product detail |
| `/about` | Brand story |
| `/contact` | Contact and enquiry |
| `/privacy` | Privacy notice, if forms/analytics are enabled |
| `/not-found` | Branded not-found experience |

## 4.3 Homepage section order

### 01. Header / showroom navigation

- Transparent or light header over the opening hero, transitioning to a solid ivory surface after scroll.
- Wordmark at left; collection navigation centered or balanced; contact CTA at right.
- Mobile: wordmark, menu button, optional enquiry icon/action.
- Sticky behaviour must not obscure page content or keyboard focus.
- Header transition: background/opacity/height only; avoid large layout jumps.

### 02. Hero — “Carry a little more of who you are.”

- Large editorial composition with a lead women's bag visual.
- Supporting visual or alternate hero slide introduces the school/student range.
- Headline: “Carry a little more of who you are.”
- Supporting line: “Thoughtfully chosen bags for school days, city days, and everything in between.”
- Primary CTA: “Explore the collection”.
- Secondary CTA: “Find a school or student bag”.
- A small chapter marker: “THE ART OF CARRYING / 01”.
- Signature zipper-inspired reveal may introduce the hero image once on first visit, subject to reduced-motion and performance settings.
- The hero must communicate that the business serves both women's and school/student needs.

### 03. Brand introduction — The Art of Carrying

- Editorial split layout: text + lifestyle/product image.
- Message: bags are practical companions and personal expression.
- Use concise copy; avoid unsupported quality or manufacturing claims.
- A subtle image reveal and headline stagger.

### 04. Two worlds / collection discovery

This is the key balance section. Present two strong entry doors:
- **Women's Bags** — lead editorial treatment and larger/primary visual emphasis.
- **School & Student** — equally clear top-level card and direct route to the collection.

A planning ratio around 65/35 can guide image scale and editorial weighting, but both cards must be visible and understandable on desktop without requiring a deep scroll. On mobile, stack them in a deliberate order and keep School & Student immediately discoverable.

### 05. Curated edit — featured products

- A custom showroom stage, not a default generic carousel.
- One active product shown prominently, with previous/next product peeks or a small index.
- Product name, category, optional price, short description, and “View details”.
- Product switching updates image, copy, category, and product link as one coherent state change.
- Include keyboard previous/next controls and touch swipe.
- If JavaScript is unavailable, render a static featured product with links.

### 06. School & Student spotlight — “Ready for every new beginning.”

A dedicated homepage chapter must make the school/student range tangible:
- Backpack hero image or campaign composition.
- Supporting copy: “Made for the everyday rhythm of school, study, and everything in between.” Use “made for” as intended-use copy, not a manufacturing claim.
- Show 3–4 school/student products with practical metadata.
- Where data exists, surface compartments, dimensions, capacity, strap/padding details, and material.
- CTA: “Explore school & student bags”.
- Avoid childish visual styling. Use confident, clean, contemporary product photography.

### 07. A closer look — materials and details

- Product macro photography: zip, stitching, handle, straps, lining, pockets, hardware, fabric texture.
- Use real details from the actual catalogue.
- Callouts must be tied to the image and verified product facts.
- No generic “premium leather”, “waterproof”, or “lifetime quality” claims unless confirmed.

### 08. Everyday stories / lifestyle chapter

- Two editorial scenes: an everyday city/style use case and a school/study routine.
- Show the product in context without overclaiming.
- Keep each story short and link to the relevant collection.

### 09. New arrivals / popular picks

- Responsive product grid.
- Product cards show image, category, name, price if configured, and data-backed badge if applicable.
- Quick view is optional; direct product detail is the baseline.
- Do not label a product “Bestseller” unless sales evidence supports it. Use “Featured” for editorial selection.

### 10. Why CARRYFORM

- Four concise pillars selected from verified business facts, for example: curated range, options for different routines, practical details, helpful assistance.
- Avoid invented sourcing, ethical, manufacturing, warranty, or durability statements.

### 11. Contact / visit

- WhatsApp enquiry CTA.
- Contact details and business hours from verified owner data.
- Address/map only after the real address is supplied.
- Demo address must be explicitly labelled “Sample address — replace before launch”.
- Contact form with name, contact method, product of interest, and message. Use validation and anti-spam protection if backend submission is enabled.

### 12. Footer

- Wordmark, short brand statement, collection links, about/contact links.
- Social icons for Instagram, Facebook, Pinterest, and WhatsApp.
- Until real profile URLs are provided, social links may point to the platform homepage and must be treated as placeholders.
- Contact details and hours must be data-driven.
- Copyright line.
- Final centred credit at the absolute bottom, exactly:
  **Created by chrysa**
  Link: `https://chrysaaa.vercel.app/`
- The credit must remain visible but visually secondary to the brand footer.

## 4.4 Collection listing page

- Collection-specific hero with title, short description, and image.
- Breadcrumbs.
- Product count only if it is computed from active products.
- Filters: product type, colour, size, price range, material, and intended use only where the underlying data exists.
- Sort: featured, newest, price ascending/descending where price is configured.
- Responsive product grid: 3–4 columns desktop, 2 tablet, 2 or 1 mobile depending on card width.
- Empty state with clear reset filters action.
- Filters must be keyboard accessible and update URL query parameters when practical.
- School & Student page must prioritise practical details and not reuse a women's fashion template without adaptation.

## 4.5 Product detail page

Common structure:
1. Breadcrumb.
2. Product image gallery.
3. Product name and category.
4. Price and currency, if supplied.
5. Short description.
6. Colour/variant selection if variants exist.
7. Availability label based on real data; otherwise “Contact us to confirm availability”.
8. Enquiry CTA (WhatsApp with product name/slug prefilled).
9. Product information/specifications.
10. Related products from the same or complementary collection.
11. Return to collection link.

Women's product-specific fields may include:
- Bag type / silhouette.
- Dimensions.
- Strap/handle type and drop, if measured.
- Closure.
- Material, only if confirmed.
- Pockets/compartments.
- Colour/variant.

School/student product-specific fields may include:
- Intended use (school/college/everyday).
- Dimensions.
- Capacity in litres, only if supplied.
- Number/type of compartments.
- Laptop sleeve size, only if measured.
- Bottle pocket, only if present.
- Strap padding/back padding, only if verified.
- Material and care instructions, only if confirmed.

Do not display empty fields. Do not infer measurements from photos. Use “Not specified” only if the business deliberately wants that label; otherwise omit the field.

## 4.6 About page

- Brand introduction.
- Why the shop curates different kinds of bags.
- The two audience/product worlds.
- Real business story, location, and values once provided.
- No invented founder history or origin story.

## 4.7 Contact page

- WhatsApp CTA.
- Phone/email/address/hours when verified.
- Contact form.
- Map embed only when the real location is confirmed.
- Clear confirmation and error states.

---

# 5. UX flows and conversion

## 5.1 Primary discovery journey

Home → choose Women's Bags or School & Student → collection page → product detail → WhatsApp enquiry/contact.

## 5.2 Assisted discovery journey

Home → curated edit / featured product → product detail → enquiry.

## 5.3 Gift/general browsing journey

Home → featured/new arrivals → collection/product → enquiry.

## 5.4 Enquiry interaction

WhatsApp links should:
- Open the configured business WhatsApp destination.
- Prefill a concise message with product name and product URL/slug.
- Never invent the phone number.
- If no real WhatsApp number exists, disable the direct action or link to a clearly marked placeholder configuration; do not route to an unrelated account.

Contact form fields:
- Name (required).
- Preferred contact (phone/email; at least one required).
- Product of interest (optional; may be prefilled).
- Message (required).
- Consent checkbox if required by the deployed privacy/legal context.

Show clear loading, success, validation, and error states. Do not claim an enquiry was sent until the server confirms success.

---

# 6. Motion and interaction specification

## 6.1 Motion principles

- Motion communicates hierarchy, reveals product detail, and reinforces the showroom story.
- The product remains the focal point.
- The loudest animation belongs to one primary action or one key reveal at a time.
- Each screen should have at most one ambient effect, one reveal style, and restrained micro-interactions.
- Avoid animating every text block, icon, and image independently.
- Prefer transform, opacity, and clip-path. Avoid continuous layout-affecting animation.
- Respect `prefers-reduced-motion`; all content must render in its final readable state without requiring motion.
- Mobile uses shorter, simpler transitions and no pinned scroll choreography.

## 6.2 Library responsibility map

| Library | Responsibility | Must not own |
|---|---|---|
| GSAP + ScrollTrigger | Complex timelines, scroll reveals, pinning, parallax, zipper reveal | Small button hover states |
| `@gsap/react` / `useGSAP` | React-safe setup, scoping, cleanup | Application state |
| Motion for React (`motion`, `motion/react`) | Component-level transitions, hover/tap, layout/exit transitions | Scroll scene transforms already controlled by GSAP |
| Swiper | Touch-first carousels and product image galleries where appropriate | Custom featured product stage if it needs bespoke choreography |
| Locomotive Scroll v5 | Optional smooth-scroll layer and in-view/parallax utilities | Must not be added without integration proof |
| Three.js / React Three Fiber | Optional 3D product viewer / one hero 3D scene | Decorative 3D on every section |
| CSS | Simple transitions, layout, reduced-motion fallbacks | Complex timeline orchestration |

**Transform ownership rule:** one animation system per DOM element/property at a time. Do not let GSAP and Motion both write `transform` on the same element. If a nested element needs a different animation system, use separate wrapper elements.

## 6.3 GSAP implementation rules

- Register only required GSAP plugins.
- Use `useGSAP` with scoped refs for React components.
- Use context-safe handlers for GSAP animations created in event callbacks.
- Revert/clean up timelines and ScrollTriggers on unmount.
- Use `gsap.matchMedia()` or equivalent responsive setup for desktop-only pinning.
- Call `ScrollTrigger.refresh()` after significant image/font/layout changes when needed; avoid refresh on every render.
- Use function-based start/end values for responsive dimensions where appropriate.
- Avoid deeply nested pinning and avoid pinning inside transformed ancestors.
- Keep selectors scoped to component refs; avoid broad global selectors.

## 6.4 Detailed interaction timeline

Timings are initial design targets and must be tuned during implementation on real devices.

### A. Hero zipper reveal — signature moment

**Trigger:** first homepage visit, after critical hero image is loaded and the page is ready.  
**Duration:** approximately 1.1–1.6 seconds; never block navigation or delay content access.  
**Sequence:**
1. Hero content is already present in accessible DOM and has a static fallback.
2. A narrow seam/mask overlays part of the hero composition.
3. Zipper-pull detail moves along a short path.
4. Mask opens/retracts to reveal the full hero image.
5. Headline and CTA settle with a short opacity/vertical movement.
6. Header becomes interactive; if intro is skipped, final state is immediate.

**Implementation:** GSAP timeline + CSS clip-path/mask. Use actual zipper hardware photography or a small physical asset if available; avoid drawing a complex fake zipper in SVG. Do not require a 3D model.

**Reduced motion:** no zipper animation; render the fully open hero.

**Mobile:** shorter, simplified reveal or no zipper movement; never cover CTA or delay first interaction.

### B. Header transition

**Trigger:** scroll beyond hero threshold.  
**Duration:** 250–400ms.  
**Properties:** background opacity, subtle shadow, text colour, compact header height.  
**Implementation:** CSS transition or Motion. Do not animate page layout in a way that causes content jump.

### C. Editorial section reveals

**Trigger:** section enters viewport.  
**Duration:** 500–800ms, stagger 60–100ms.  
**Properties:** opacity + y translation (small distance), image clip-path reveal.  
**Implementation:** GSAP ScrollTrigger for coordinated multi-element sequences; Motion `whileInView` only for isolated, simple components. Do not apply both to the same elements.

### D. Two-world collection reveal

**Trigger:** collection section enters viewport.  
**Duration:** 700–1000ms.  
**Sequence:** Women's Bags card enters first with lead editorial emphasis; School & Student card enters immediately after with a slightly offset motion. Both remain equally legible and actionable.  
**Implementation:** GSAP timeline. Keep both cards in normal flow and visible when JS is unavailable.

### E. Curated product stage transition

**Trigger:** next/previous control, swipe, or keyboard input.  
**Duration:** 450–650ms.  
**Sequence:**
1. Current product image moves slightly outward and fades.
2. Current product text exits with a small vertical offset.
3. Next image enters with a subtle scale/position change.
4. Product name, category, and metadata update as one state change.
5. Active index updates and accessible announcement is made.

**Implementation:** React state owns active product; Motion `AnimatePresence` handles image/text enter/exit. For a more elaborate stage, GSAP may orchestrate the image wrapper while Motion handles text wrappers—but never both on the same transform target. Provide pause/no-autoplay by default. If autoplay is later introduced, it must pause on hover/focus and respect reduced motion.

### F. Material inspection callouts

**Trigger:** detail section enters view or user selects a detail thumbnail.  
**Duration:** 300–500ms.  
**Properties:** image crop transition, callout opacity, short line/label reveal.  
**Implementation:** CSS/Motion for labels; GSAP for a coordinated scroll sequence. Use HTML positioning and CSS borders/lines instead of custom SVG drawing wherever practical.

### G. Product gallery

**Trigger:** thumbnail selection or swipe.  
**Duration:** 250–450ms.  
**Implementation:** Swiper for touch-first galleries, or controlled Motion transition for a small gallery. Avoid nested carousels. Provide thumbnails, keyboard controls, alt text, and a visible active state.

### H. Route transition

**Trigger:** navigation between major routes.  
**Duration:** 250–450ms maximum.  
**Implementation:** Motion `AnimatePresence` or a route-level transition component with correct Next.js App Router lifecycle handling. Use opacity and small translate; do not delay route content or interfere with browser back/forward navigation. A full-screen branded zipper transition is not required on every route.

### I. Footer reveal

**Trigger:** footer enters viewport.  
**Duration:** 450–650ms.  
**Properties:** subtle opacity and y movement.  
**Implementation:** CSS/Motion. Footer content must remain in DOM and accessible.

## 6.5 Locomotive Scroll v5 decision gate

Locomotive Scroll v5 is optional, not a hard dependency. It is built on Lenis and is a complete rewrite from older v4 APIs. The implementation team must:
1. Confirm the current v5 API and package compatibility at build time.
2. Build a small proof page with one ScrollTrigger reveal and one pinned section.
3. Confirm scroll position synchronisation and resize behaviour.
4. Confirm keyboard/native scroll and touch behaviour.
5. Confirm no conflict with Next.js route transitions.
6. Compare with native scrolling + ScrollTrigger before retaining it.

If the integration introduces fragility, use native browser scrolling with GSAP ScrollTrigger. Do not install a second Lenis instance alongside Locomotive v5.

## 6.6 3D usage gate

Three.js / React Three Fiber is only approved if the shop can provide a real model or a sufficiently accurate, rights-cleared asset. Initial use case:
- One rotatable bag viewer on a selected product detail page or a campaign scene.
- Lazy-load only when the viewer approaches viewport or user opens it.
- Provide a static image fallback.
- Provide keyboard-accessible controls or an equivalent non-3D image gallery.
- Limit texture resolution and polygon count.
- Dispose geometries, materials, and textures on unmount.
- Disable or simplify on low-power/mobile devices if performance suffers.

No 3D placeholder that misrepresents the actual product.

---

# 7. Responsive design

## 7.1 Breakpoint intent

Use project tokens rather than treating breakpoints as rigid device labels. Suggested ranges:
- Small mobile: below 480px.
- Mobile: 480–767px.
- Tablet: 768–1023px.
- Desktop: 1024–1439px.
- Wide desktop: 1440px and above.

## 7.2 Mobile experience

- Native scrolling; no pinned sections.
- Hero stack with product visual and headline; CTAs visible early.
- Both Women's Bags and School & Student collection doors discoverable within the first two content sections.
- Product showcase becomes a swipeable card stage with visible controls.
- Product grids use two columns only when card text and image remain readable; otherwise one column.
- Filters open in an accessible drawer/sheet.
- Sticky bottom enquiry CTA may be used on product detail only if it does not obscure content.
- Touch targets meet WCAG guidance; no hover-only information.
- Avoid large parallax and continuous floating product movement.

## 7.3 Tablet and desktop

- Desktop may use editorial split layouts and limited pinned scenes.
- Tablet reduces pin distances and parallax.
- Wide screens use a constrained content container and larger image stage, not stretched copy.
- Hover interactions are enhancements, not the only way to access information.

---

# 8. Technical architecture

## 8.1 Stack

**Core**
- Next.js App Router
- React
- TypeScript
- CSS Modules or Tailwind CSS (choose one styling system; recommendation: Tailwind with a small token layer, unless the team has a strong CSS Modules preference)
- ESLint + Prettier
- Zod for runtime validation of external/config data

**Motion**
- `gsap`
- `@gsap/react`
- `motion`
- `swiper`
- Optional `locomotive-scroll` v5 after proof of compatibility
- Optional `three` + `@react-three/fiber` + `@react-three/drei` only if real models exist

**Data**
- Local JSON files
- `@supabase/supabase-js`
- `@supabase/ssr` for cookie-aware SSR/auth integration if authentication is later introduced or required by server-side user context

**Forms**
- Server Action or Route Handler for enquiry submission.
- Add a spam-protection mechanism (honeypot/rate limiting; CAPTCHA only if needed).
- Email delivery provider is a later integration and must be selected before production form submission is enabled.

Use current stable package versions at implementation time, record exact versions in the lockfile, and do not copy stale version numbers from this PRD.

## 8.2 App Router rendering strategy

- Default to Server Components for pages, product/collection data retrieval, metadata, and static content.
- Use Client Components only for interactive galleries, carousels, filters, menu state, animations, and form controls.
- Keep animation libraries out of server-rendered component modules unless dynamically imported into client-only boundaries.
- Use dynamic imports for heavy 3D and other large client-only components.
- Use `next/image` with explicit dimensions/aspect ratio and restricted `remotePatterns` for remote images.
- Generate route metadata from product/collection data.
- Use `notFound()` for unknown slugs.
- Use stable IDs/slugs for keys; do not use array indexes for reorderable product lists.

## 8.3 Suggested folder structure

```text
src/
  app/
    layout.tsx
    page.tsx
    collections/
      page.tsx
      [slug]/page.tsx
    products/
      [slug]/page.tsx
    about/page.tsx
    contact/page.tsx
    privacy/page.tsx
    not-found.tsx
    api/
      enquiries/route.ts

  components/
    layout/
      SiteHeader.tsx
      MobileNavigation.tsx
      SiteFooter.tsx
      Breadcrumbs.tsx
    home/
      HeroShowroom.tsx
      BrandIntroduction.tsx
      CollectionDoors.tsx
      CuratedProductStage.tsx
      StudentSpotlight.tsx
      MaterialStory.tsx
      LifestyleStories.tsx
      FeaturedProductGrid.tsx
      WhyCarryform.tsx
      ContactBand.tsx
    collections/
      CollectionHero.tsx
      ProductGrid.tsx
      ProductFilters.tsx
      SortControl.tsx
    products/
      ProductGallery.tsx
      ProductSummary.tsx
      ProductSpecifications.tsx
      ProductEnquiry.tsx
      RelatedProducts.tsx
      Product3DViewer.tsx
    ui/
      Button.tsx
      IconButton.tsx
      Badge.tsx
      Dialog.tsx
      FormField.tsx

  lib/
    data/
      index.ts
      provider.ts
      json-provider.ts
      supabase-provider.ts
      product-repository.ts
      collection-repository.ts
      site-repository.ts
    supabase/
      server.ts
      client.ts
      middleware.ts (only if auth/session refresh is needed)
    validation/
      product.ts
      collection.ts
      enquiry.ts
    seo/
      metadata.ts
    whatsapp.ts
    utils.ts

  data/
    site.json
    navigation.json
    categories.json
    collections.json
    products.json
    contact.json

  types/
    product.ts
    collection.ts
    site.ts
    enquiry.ts

public/
  images/
    brand/
    home/
    collections/
    products/
    student/
  models/
  fonts/

supabase/
  migrations/
    0001_initial_schema.sql
  seed.sql
```

---

# 9. Data architecture and provider fallback

## 9.1 Important distinction: database availability vs login session

The data-source decision must **not** depend on whether a visitor has an active Supabase Auth session. A public catalogue should be readable by anonymous visitors if its public-read policies allow it.

The intended rule is:
- Supabase is selected when it is configured and the catalogue query succeeds.
- JSON is selected when Supabase is not configured or the catalogue query fails.
- Auth session state is a separate concern and must not determine whether product data is loaded.

## 9.2 Provider selection

Environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or the current publishable-key equivalent supported by the Supabase project)
- `SUPABASE_SERVICE_ROLE_KEY` — server-only; never expose to browser/client bundle; not required for public catalogue reads.

Provider resolution:
1. Validate required public Supabase configuration.
2. If absent, choose JSON provider.
3. If present, initialise server-side Supabase client and query a small catalogue health/read operation.
4. If query succeeds, use Supabase provider for that request.
5. If query fails, log a structured warning and fall back to JSON.
6. Do not silently swallow programming/schema errors in development; surface a clear warning and preserve diagnostics.
7. Do not cache a failed provider selection forever. Re-evaluate per request or use a short bounded cache with an explicit invalidation policy.

For public pages, server-side provider selection should avoid exposing credentials and avoid making browser requests to a private database key.

## 9.3 Normalised repository interface

Both providers return the same typed objects. Components must not know whether data came from JSON or Supabase.

Example conceptual interface:
- `getActiveProducts()`
- `getFeaturedProducts(limit)`
- `getProductBySlug(slug)`
- `getProductsByCollection(collectionSlug, filters, sort)`
- `getCollections()`
- `getCollectionBySlug(slug)`
- `getSiteSettings()`

Normalise database rows and JSON records at the provider boundary. Validate with Zod or equivalent. Missing optional fields should remain absent/null consistently.

## 9.4 Product data model

Core product fields:
- `id`: UUID/string stable identifier.
- `slug`: unique URL-safe slug.
- `name`.
- `short_description`.
- `description`.
- `category_id`.
- `collection_id` (nullable if product belongs to multiple collections; use join table if multi-collection becomes required).
- `product_audience`: `womens | student | everyday | unisex`.
- `product_type`: `handbag | shoulder_bag | tote | sling | purse | school_backpack | college_backpack | everyday_backpack | travel_bag | other`.
- `price_amount`: nullable decimal.
- `currency`: default `INR` for India-targeted demo, configurable.
- `compare_at_price`: nullable; only use if legitimate.
- `availability_status`: `available | unavailable | enquire`.
- `is_active`.
- `is_featured`.
- `is_new`.
- `sort_order`.
- `created_at`, `updated_at`.

Images:
- `image_url`.
- `alt_text`.
- `role`: `primary | gallery | detail | lifestyle | cutout | thumbnail`.
- `sort_order`.
- `width`, `height` (optional but recommended).
- `source_credit` / `license_note` for internal asset provenance.

Variants:
- `id`, `product_id`, `name`, `value`, `swatch_hex` (optional), `image_url` (optional), `sort_order`, `is_active`.

Specifications:
- Flexible category-specific JSON object for early release.
- Promote frequently filtered attributes to typed columns or normalised tables once actual catalogue/filter requirements are confirmed.
- Never fabricate material, capacity, waterproofing, dimensions, or compartment counts.

## 9.5 Suggested JSON sample structure

`products.json` should be an array of product records with fields matching the normalised TypeScript type. Example placeholder values must be explicitly marked as demo data. Each product should include:
- `id`, `slug`, `name`, `audience`, `type`, `categorySlug`, `collectionSlugs`
- `shortDescription`, `description`
- `price` object or null
- `availability`
- `images` array with role and alt text
- `specifications` object with only known fields
- `variants` array
- `flags` (`featured`, `new`, `active`)
- `sortOrder`
- `contentStatus: "demo"` for all placeholder products until verified

Provide a seed set that demonstrates the 65/35 planning balance: for example, 13 women's products and 7 school/student products in a 20-item demo catalogue. This is a visual/content fixture only, not a claim about real inventory. If the actual catalogue has fewer products, do not pad with misleading fake products in production.

## 9.6 Supabase SQL schema requirements

The initial migration should create:
- `categories`
- `collections`
- `products`
- `product_images`
- `product_variants`
- `site_settings`
- `contact_messages`

Optional later tables:
- `product_specifications` if JSONB becomes unwieldy.
- `collection_products` if products belong to multiple collections.
- `enquiry_events` if the business needs enquiry analytics.

Requirements:
- UUID primary keys.
- Unique slugs.
- Foreign keys with deliberate delete/update behaviour.
- `created_at` and `updated_at`.
- Indexes for `slug`, `is_active`, `is_featured`, `category_id`, `collection_id`, `sort_order`.
- Check constraints for non-negative prices and valid availability values.
- JSONB for flexible specs only where justified.
- RLS enabled for every exposed table.
- Public anonymous read only for active catalogue records.
- No public write access to product, category, collection, or site settings.
- Contact message insert policy only if direct public inserts are intentionally enabled and rate limiting/spam mitigation is present; safer initial approach is a server endpoint with validation and controlled server-side insert.
- No service-role key in client-side environment variables or code.

The SQL migration must be runnable on a fresh Supabase PostgreSQL project and include comments for each policy. Include a seed file with clearly marked demo records. Verify policies with positive and negative tests before deployment.

---

# 10. Content model and sample content rules

## 10.1 Site settings

Central configuration:
- brand name and descriptor.
- tagline.
- logo/wordmark asset.
- default currency.
- WhatsApp phone number.
- phone/email.
- real address and opening hours.
- social profile URLs.
- footer credit text and URL.
- SEO defaults.
- data-provider preference/feature flags.

## 10.2 Demo data policy

The prototype may use generated sample names, descriptions, and placeholder contact details to demonstrate layout. Every placeholder record must be marked `demo` in data or documentation.

Never present:
- a generated address as a real store location;
- a generated phone number as the business's number;
- a stock image as a verified image of an actual product;
- invented customer reviews as testimonials;
- invented sale prices, scarcity, popularity, or stock availability;
- unsupported materials, dimensions, warranty, waterproofing, or quality claims.

Use a visible development/demo label in non-production environments. Before launch, replace all demo contact details and product data.

## 10.3 Copywriting principles

- Lead with identity and use case, not empty superlatives.
- Write short, specific headings.
- Use emotional language sparingly and pair it with useful information.
- Women's collection copy can focus on style, versatility, and everyday expression.
- School/student copy can focus on routine, organisation, readiness, and practical fit.
- Avoid gender stereotypes and avoid implying all student bags are for children.
- Do not use false urgency or manipulative scarcity.
- Avoid claims such as “best quality”, “premium leather”, “waterproof”, “ergonomic”, or “built to last” unless the business can substantiate them.

---

# 11. SEO, analytics, and sharing

## 11.1 SEO

- Unique title and meta description for each route.
- Canonical URLs.
- Product and collection slugs should be stable and human-readable.
- Open Graph/Twitter metadata with actual licensed images.
- Product structured data only when price, availability, currency, and product details are accurate and visible on page.
- Breadcrumb structured data where appropriate.
- Sitemap and robots configuration.
- Descriptive alt text; avoid keyword stuffing.
- Server-rendered content for collection/product pages.
- Noindex preview/demo routes if they are not intended for public discovery.

## 11.2 Analytics

Initial release may use privacy-conscious basic analytics after consent/legal review:
- collection view,
- product view,
- product image change,
- filter use,
- WhatsApp click,
- contact form submit success,
- contact form error.

Do not collect unnecessary personal data. Do not record message contents in analytics. Define retention and consent requirements before production analytics are enabled.

---

# 12. Accessibility and inclusive experience

Target WCAG 2.2 AA as the implementation goal.

- Semantic landmarks and headings.
- Skip-to-content link.
- Visible focus rings.
- Full keyboard navigation.
- Accessible mobile menu and dialogs.
- Carousel controls with labels and keyboard support.
- Announce product-stage changes to assistive technology without excessive announcements.
- Provide meaningful image alt text; decorative images use empty alt.
- Ensure colour contrast for body text and controls.
- Do not rely on colour alone for state.
- Respect reduced motion at the global and component level.
- Avoid auto-playing motion or provide pause controls if it is introduced.
- Ensure text remains readable over imagery using overlays/solid surfaces.
- Forms have programmatic labels, clear validation, and error summaries.
- 3D content has a static accessible alternative.

---

# 13. Performance and reliability

## 13.1 Performance targets

Targets are engineering goals, not guaranteed results:
- Core Web Vitals in “good” range on representative mobile devices and real-user monitoring after launch.
- LCP target ≤ 2.5s.
- INP target ≤ 200ms.
- CLS target ≤ 0.1.
- Avoid shipping Three.js in the initial homepage bundle.
- Keep initial JavaScript lean; lazy-load animation and 3D code by section.
- Avoid loading all product gallery images eagerly.
- Use responsive image sizes and explicit aspect ratios.
- Preload only the critical hero image/font where justified.
- Avoid third-party image APIs as a runtime dependency for core catalogue content.

## 13.2 Image pipeline

- Use owner-supplied product photos as the source of truth.
- Prepare primary product images, transparent cutouts, detail crops, and lifestyle images as separate assets.
- Prefer AVIF/WebP with suitable fallbacks through Next.js image optimisation or a controlled asset pipeline.
- Store dimensions and alt text in data.
- Restrict remote image hosts using `remotePatterns`.
- Keep image licensing/source notes in the asset inventory.
- Avoid hotlinking stock images for production.
- Do not use the same generic image for multiple products if it creates the impression that each is a distinct real item.

## 13.3 Failure states

- If Supabase is unavailable, use JSON and log a warning.
- If a product image fails, show a branded neutral fallback and preserve the product information.
- If animation fails or JavaScript is disabled, all page content and links remain available.
- If WhatsApp destination is not configured, show contact fallback instead of a broken link.
- If a product slug is missing, show a not-found page.
- If contact submission fails, preserve entered data and show retry guidance.

---

# 14. Security and privacy

- Public environment variables contain only public Supabase URL and publishable/anon key.
- Service-role key is server-only and must never be prefixed with `NEXT_PUBLIC_`.
- Validate all form input on the server.
- Apply rate limiting and spam protection to public enquiry endpoints.
- Escape/sanitise user-provided content before rendering.
- RLS enabled on all exposed Supabase tables.
- Public read only for active product catalogue content.
- Restrict contact message access to authorised server/admin roles.
- Do not expose internal error traces or database credentials to visitors.
- Keep dependencies updated and audit before deployment.
- Publish an accurate privacy notice if personal data or analytics are collected.

---

# 15. Testing and quality assurance

## 15.1 Functional testing

- All navigation links resolve.
- Every active collection renders only its relevant active products.
- Product detail pages load by slug and show the correct product.
- Filters and sorting behave correctly and can be cleared.
- Product image gallery works with mouse, touch, and keyboard.
- Curated stage updates product image, title, category, price, and link consistently.
- WhatsApp links prefill the correct product context.
- Contact form validates and handles server errors.
- Footer credit URL is exact.
- Social links are platform-level placeholders until configured.
- Unknown product/collection slugs show a branded 404.

## 15.2 Data testing

- JSON records validate against schema.
- Supabase records normalise to the same shape as JSON.
- Missing Supabase config selects JSON.
- Configured and healthy Supabase selects Supabase.
- Supabase query failure falls back to JSON.
- Anonymous visitors can read only active public catalogue rows.
- Anonymous visitors cannot mutate catalogue tables.
- Contact endpoint rejects invalid/spam input.
- Demo content is distinguishable from production content.

## 15.3 Animation testing

- Hero reveal runs once and does not block interaction.
- Reduced-motion users receive final static state.
- GSAP timelines and ScrollTriggers clean up on route changes/unmount.
- No transform ownership conflicts between GSAP and Motion.
- Pinned sections do not overlap content or create scroll traps.
- ScrollTrigger refreshes correctly after image/layout changes.
- Mobile has no pinned scenes.
- Carousels support keyboard and touch.
- Route transitions do not break back/forward navigation.
- Animation remains smooth on a mid-range mobile device.

## 15.4 Browser/device coverage

Test current stable Chrome, Safari, Firefox, and Edge on desktop; iOS Safari and Android Chrome on mobile. Include narrow viewport, tablet, wide desktop, reduced motion, keyboard-only, and screen-reader spot checks.

---

# 16. Milestones and implementation sequence

## Phase 0 — Asset and content readiness

- Confirm business name, logo, real contact details, and address.
- Collect product list and product photography.
- Decide actual category taxonomy.
- Verify which product specifications can be stated.
- Confirm image rights and model releases if people appear.
- Establish which products are featured/new/available.

**Exit condition:** approved brand/content inventory and asset map.

## Phase 1 — Foundation and data

- Create Next.js App Router project with TypeScript.
- Establish design tokens and typography.
- Define TypeScript/Zod schemas.
- Implement JSON provider and repository interface.
- Add sample data with explicit demo status.
- Build global layout, header, footer, and route shells.

**Exit condition:** all routes render with JSON data and consistent layout.

## Phase 2 — Core showroom and catalogue

- Implement homepage sections.
- Implement collection listing and category-specific presentation.
- Implement product detail page and image gallery.
- Implement contact/WhatsApp flow.
- Validate women's/student merchandising balance.

**Exit condition:** visitors can navigate from homepage to a relevant product and enquire.

## Phase 3 — Motion design

- Implement hero reveal.
- Implement collection chapter reveals.
- Implement curated product stage.
- Implement material detail interactions.
- Add route transitions.
- Test reduced motion and mobile fallbacks.

**Exit condition:** animations enhance the experience without blocking product discovery or harming performance.

## Phase 4 — Supabase integration

- Create SQL migration and seed script.
- Configure environment variables.
- Implement server-side Supabase provider.
- Add fallback and logging.
- Add RLS policies and policy tests.
- Verify JSON/Supabase parity.

**Exit condition:** data source can switch without changing page components.

## Phase 5 — Polish and launch readiness

- Responsive QA.
- Accessibility checks.
- Performance profiling.
- SEO metadata and sitemap.
- Real contact/social details.
- Replace demo products and imagery.
- Verify privacy and security.
- Production deployment.

**Exit condition:** launch checklist passes and no demo placeholders remain.

## Phase 6 — Optional enhancements

- 3D product viewer for selected products.
- Admin/CMS for product management.
- Search if catalogue size warrants it.
- Wishlist or saved products.
- E-commerce checkout only if business requirements are confirmed.
- Analytics dashboard for collection/product/enquiry performance.

---

# 17. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Too much motion | Slower, confusing, inaccessible site | Motion budget, reduced-motion, mobile simplification |
| Weak/inconsistent product photos | Website looks like a generic template | Asset checklist, consistent image art direction, real products |
| Student range underrepresented | Misses a meaningful audience and misrepresents catalogue | Explicit 35% planning share, dedicated homepage spotlight, top-level navigation |
| Fake/demo product data mistaken as real | Loss of customer trust | `contentStatus: demo`, pre-launch content audit |
| Supabase login used as provider switch | Public visitors may not see database content | Separate data availability from auth session |
| Supabase policy misconfiguration | Data exposure or broken reads | RLS tests and least-privilege grants |
| Locomotive/ScrollTrigger conflicts | Scroll bugs and fragile implementation | Proof of concept; fallback to native scroll |
| 3D assets unavailable | Time spent on inaccurate model | Gate 3D on real licensed model; use product photography |
| Too many libraries | Bundle size and maintenance burden | Assign clear responsibilities; add optional libraries only when justified |
| Placeholder address/contact goes live | Misinformation | Launch blocker checklist; demo labels |
| Unsupported product claims | Misleading marketing | Owner verification of all specs and claims |

---

# 18. Acceptance criteria

Release 1 is accepted when:

1. CARRYFORM brand system is configurable and clearly marked provisional until approved.
2. Homepage presents both women's bags and school/student bags, with a planning emphasis around 65/35.
3. School & Student is a top-level navigation item and has a dedicated homepage spotlight and collection page.
4. Visitors can browse collections, filter/sort where supported, open product detail pages, and return to collections.
5. Product pages show only verified product specifications and do not fabricate missing data.
6. Primary conversion actions work and do not use invented contact details.
7. Footer includes the exact centred credit “Created by chrysa” linked to `https://chrysaaa.vercel.app/`.
8. JSON is the working default and can run without Supabase configuration.
9. Supabase can be enabled by environment variables and used without requiring a visitor login session.
10. Supabase query failure falls back to JSON with development diagnostics.
11. SQL schema and RLS policies are included and tested.
12. GSAP, Motion, and Swiper have distinct responsibilities and no conflicting transform ownership.
13. Locomotive Scroll is optional and only included after a successful proof of compatibility.
14. 3D is optional and has a static accessible fallback.
15. Reduced-motion and mobile experiences remain fully usable.
16. Main routes have metadata, semantic structure, and responsive layouts.
17. No fake testimonials, fake scarcity, fake product specs, or unmarked demo address/contact data appear in production.
18. Keyboard navigation, basic screen-reader behaviour, and contrast are checked.
19. Performance is profiled on a representative mobile device.
20. No demo placeholders remain in the production launch configuration.

---

# 19. Open questions / owner inputs before production

These are not blockers for the prototype, but must be resolved before launch:

1. Final shop/business name and logo.
2. Actual product inventory, category names, and product photos.
3. Real prices and currency.
4. Product specifications and which fields are safe to publish.
5. Actual phone/WhatsApp number, email, address, and opening hours.
6. Real social profile URLs.
7. Whether contact forms should send email, store enquiries in Supabase, or both.
8. Whether a password-protected admin/catalogue editor is required.
9. Whether the business expects to add checkout later.
10. Whether real 3D models exist and whether the owner wants a 3D viewer.

---

# 20. References and implementation notes

The following are official or primary technical references used to shape the implementation decisions. Verify current package versions and APIs again when the build begins.

## Next.js
- App Router: https://nextjs.org/docs/app
- Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Image component: https://nextjs.org/docs/app/api-reference/components/image

## GSAP
- ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- ScrollTrigger scrollerProxy: https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.scrollerProxy/
- @gsap/react: https://www.npmjs.com/package/@gsap/react

## Motion for React
- Getting started: https://motion.dev/docs/react
- AnimatePresence: https://motion.dev/docs/react-animate-presence

## Swiper
- React integration: https://swiperjs.com/react

## Locomotive Scroll
- Official v5 documentation: https://scroll.locomotive.ca/
- v5 introduction: https://github.com/locomotivemtl/locomotive-scroll/blob/main/packages/docs/docs/intro.md

## Supabase
- SSR: https://supabase.com/docs/guides/auth/server-side
- @supabase/ssr: https://github.com/supabase/ssr
- Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security

## UX research / reference inspiration
- Baymard luxury goods UX research: https://baymard.com/research/luxury-goods
- VPloss: https://vploss.com/
- The Tiebreak: https://thetiebreak.merci-michel.com/eu/en/
- Enigma Sculpt: https://www.enigmascult.com/
- Strathberry: https://www.strathberry.com/

Reference websites are inspiration for interaction quality and editorial presentation only. Do not copy their code, copywriting, imagery, layout identity, or branding. Reproduce interaction mechanisms in an original CARRYFORM visual language.

---

# Appendix A — Suggested homepage copy

**Hero eyebrow:** THE ART OF CARRYING  
**H1:** Carry a little more of who you are.  
**Body:** Thoughtfully chosen bags for school days, city days, and everything in between.  
**Primary CTA:** Explore the collection  
**Secondary CTA:** Find a school or student bag

**Women's collection:** A little detail. A different feeling.  
**Women's body:** Explore handbags, totes, shoulder bags, and everyday styles that bring something personal to the way you carry.

**School/student collection:** Ready for every new beginning.  
**School/student body:** Discover bags for school, study, and daily routines, with practical details that help you find the right fit.

**Product detail prompt:** The details that make it yours.  
**Enquiry CTA:** Ask about this bag

**Contact CTA:** Found your kind of carry? Let's help you find the right one.

# Appendix B — Handoff note for the build agent

Treat this PRD as the source of truth. Before coding, inspect the supplied project UI/motion decision guide and the matching component/motion kits. Choose one base component system and do not mix shadcn/Radix and daisyUI paradigms. Build the MVP in phases. Do not add extra animation libraries just because they are available. Verify current library APIs and version compatibility. Keep all product content behind the repository interface. Keep demo data clearly marked. Prioritise real product imagery, school/student visibility, and a working enquiry journey over decorative complexity.

At implementation handoff, use the supplied `MCP-SETUP-PROMPT.md` if the coding agent needs UI registry/MCP setup. The agent must not assume ChatGPT has installed or configured MCP servers.
