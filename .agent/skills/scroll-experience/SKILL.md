---
name: scroll-choreography
description: >
  Build long-form, cinematic scroll-driven websites — the "award site" experience
  (Awwwards/FWA-style): line-masked headline reveals, images that uncover rather than
  fade in, two or three PINNED scroll scenes (never more), a sticky image column that
  cross-fades against scrolling text, a vertical-scroll-becomes-horizontal gallery, and a
  page that hands chapters to one another instead of stacking blocks. Use this skill
  whenever the user asks for a "scrolling experience," a "scrollytelling site," a site
  "like an Awwwards site," an experience-based / immersive / cinematic landing page, a
  GSAP or ScrollTrigger site, a portfolio/brand/real-estate/product one-pager with
  scroll animation, or reacts to a reference site by describing scroll effects even
  without naming them. This skill decides — not just describes: it tells the agent which
  content block earns a pin, which earns a scrub, which earns a plain reveal, in what
  order chapters should run, and what imagery to source or generate. Theme, palette,
  copy and subject matter change every time; the choreography grammar in this file does
  not.
---

# Scroll Choreography

## 0. What this is, and how to use it

This skill is reverse-engineered from two reference builds: **Era Residence**
(thefirstthelast.pro, Awwwards Site of the Day — real estate, Webflow + GSAP) and
**KHURE Residence**, a portfolio recreation of the same choreography in React + GSAP
ScrollTrigger. Both share one underlying grammar: a **long, continuous scroll** that
reads as a sequence of *chapters handing over to one another*, built almost entirely
from five to seven repeatable motion primitives, applied with restraint.

You are not copying Era Residence or KHURE Residence. You are building a **new** site —
different subject, different palette, different copy, different imagery — using the
same *decision process* that produced them. Read this whole document before writing any
code. It is organized as a decision engine, not a component library: Section 2 tells you
*how to decide* what happens in each part of the page; Section 3 gives you the exact
motion primitives to implement each decision; Section 4 gives you the technical
substrate (GSAP + ScrollTrigger patterns, vanilla-JS and React versions); Section 5
covers imagery; Section 6 is the responsive/accessibility contract that is not optional;
Section 7 is a pre-ship checklist.

**The one rule that matters most:** *restraint is what makes this read as premium.*
The single biggest failure mode when copying this style is pinning everything and
scrubbing everything. The reference sites work because most of the page is ordinary
document flow with quiet entry reveals, and only two or three moments — the ones that
have earned it — take over the viewport. If every section pins, nothing feels special
and the page feels broken/sticky instead of cinematic.

---

## 1. Before writing code: gather what you need

1. **Subject.** What is this site for? (real estate, product launch, restaurant, studio
   portfolio, event, fund, app, person.) This drives the chapter list in Section 2.1 and
   the imagery brief in Section 5.
2. **Tone.** Luxury/editorial and quiet (Era Residence register) is the default this
   skill produces. If the user wants something louder, energetic, or playful, keep the
   *mechanics* (masks, pins, scrub, handover) but loosen the *easing and pacing*
   (shorter durations, punchier eases like `back.out`, brighter palette) — see Section
   2.4.
3. **Stack.** If the user's project already has a stack (React, Vue, plain HTML/Vite,
   Next.js, Webflow), build in it. If nothing is specified, default to plain HTML + CSS
   + vanilla JS + GSAP (Section 4.2) — it is the most portable and the easiest for any
   agent or developer to drop into any project. Do not introduce a framework the project
   doesn't already use just to build this.
4. **Capabilities available to you.** Check whether you (the agent building this) have
   image generation, web/image search, or only a placeholder-image fallback. This
   changes the imagery decision in Section 5. Check whether the project already has a
   design-system or frontend-styling skill loaded — if so, let it set the *visual*
   language (colors, type choices) while this skill still governs the *motion and
   structure* language. This skill is additive to any design-taste/frontend skill you
   already have, never a replacement for it.

---

## 2. The Decision Engine

### 2.1 Decide the chapter list and its order

A scroll-choreography page is a sequence of **8–12 chapters**, each a full-bleed or
full-width `<section>`, in this recurring shape (adapt names to the subject, don't skip
the *function* of each slot):

| # | Function | Almost always present? |
|---|----------|------------------------|
| 1 | **Hero** — one image or one idea fills the screen, headline masks in | always |
| 2 | **Premise / philosophy** — the "why," editorial two-column, one supporting image | usually |
| 3 | **The centerpiece pin** — the one chapter that most deserves a pinned, scrubbed sequence (product detail, architecture, a process) | pick one |
| 4 | **Context** — where/who/when this exists in the world (map-like diagram, timeline, comparison) | often, lighter treatment |
| 5 | **The offering** — the sticky-column chapter: 2–4 variants/options/products, text scrolls, one image column cross-fades between them | if there are 2+ comparable items |
| 6 | **Specification / detail** — a technical or drawn-on-scroll diagram (floor plan, spec sheet, ingredient/materials list) | if the subject has technical detail worth dwelling on |
| 7 | **Feature rows** — alternating full-bleed editorial rows, image/copy swapping sides each row | for 3–6 features/amenities/benefits |
| 8 | **Gallery** — the horizontal-scroll chapter | if there are 6+ images worth lingering on |
| 9 | **Numbers / facts** — counting stats, design/scope facts not sales claims | optional, good closer-before-closer |
| 10 | **Closing / CTA** — mirrors the hero: full-bleed image, headline, one or two actions | always |

Decide which of 3, 5, 8 actually **earn** a pin (Section 2.2) before writing anything.
Not every project needs all ten; a product launch might collapse 4 and 6, a portfolio
might drop 9. What must not change: **chapter 1 and the closer mirror each other**
(same visual grammar, different content), and **the page reads front-to-back as a
narrative**, not as an index of features.

### 2.2 Decide what gets pinned — the scarcity rule

Pin **at most three** sections on the whole page (reference sites use exactly three:
one drawing-overlay pin, one sticky-split, one horizontal-gallery pin). For every
candidate chapter, ask:

- **Does the content have an internal sequence** (a detail being revealed step by step,
  three images that are genuinely different views of one comparable thing, a strip of
  images meant to be traveled through)? If yes → it can earn a pin.
- **Is this chapter just "text next to an image"?** → it does not earn a pin. Give it a
  quiet entry reveal (Section 3.2/3.3) instead.
- **Would pinning it make the user feel stuck** (nothing changes for several screens of
  scroll)? → don't pin it, or shorten the pinned distance drastically.

Assign the three pin *types* by content shape, not by chapter number:

1. **Drawing-overlay pin** (Section 3.4) → give this to the chapter with genuine
   technical/behind-the-scenes detail: architecture, materials, ingredients, an
   engineering diagram, "how it's made."
2. **Sticky-split cross-fade** (Section 3.5) → give this to the chapter with 2–4
   directly comparable options: room types, product variants, pricing tiers, team
   roles.
3. **Horizontal-gallery pin** (Section 3.6) → give this to the chapter that is
   genuinely just "more images to look at" — a portfolio, a photo set, a lineup.

If the subject only has one strong pin-worthy moment, use **one** pin, not three for
the sake of it. A thin site with three forced pins is worse than a thin site with one
honest one.

### 2.3 Decide the hero entrance

Two options; pick based on whether the subject is best expressed by *one* strong image
or by *several*:

- **Full-bleed single image** (Section 3.1, the Era/KHURE hero): image settles from a
  slight zoom while the headline masks in line by line. Choose this when there is one
  hero photograph/render/shot that carries the whole brand mood (architecture, a
  product beauty shot, a portrait, a landscape).
- **Fragment-assembly / quadrant merge**: four (or a grid of) images occupy quadrants
  of the viewport, scroll or time drives them converging/scaling until one expands to
  fill the screen and becomes the hero image, headline then reveals over it. Choose
  this when the subject is inherently plural (a gallery, a collection, a team, a set of
  products) and no single image should be crowned before the story starts — the merge
  itself communicates "many things becoming one story." Implement the convergence with
  transform/opacity only (Section 3.7), same easing family as everything else, and
  respect reduced motion (jump straight to the merged state, Section 6.2).

Do not use both. Pick one per project.

### 2.4 Decide the palette, type, and easing — theme is free, structure is not

The reference sites use: a warm off-white paper, a near-black (not pure black)
charcoal, one muted accent (bronze), a serif display face for headlines, a grotesk/sans
for body and interface, a monospace for small "meta" labels (eyebrows, captions, index
numbers). **Keep this three-role type system and this "no pure black/pure white, one
accent" palette discipline — swap the actual colors and fonts freely per brand:**

- Pick a **display serif or a display sans** for headlines depending on brand register
  (serif = editorial/luxury, sans = tech/product/modern).
- Pick **one working body font** (system-ui/Inter-class is always safe).
- Pick **one monospace or condensed face** for meta labels — this is what makes index
  numbers ("01 / 06"), eyebrows, and captions read as *designed* rather than default.
- Base neutrals: one warm-or-cool light ground, one deep-but-not-black ink, one mid
  neutral for secondary text. Add **exactly one** accent color used sparingly (small
  labels, one line, hover states) — never as a background fill of a whole section.
- Easing: default to `expo.out` for entrances, `power2`/`power3` families for
  scrubbed/settling motion, `none` (linear) for anything directly driven by scroll
  position (scrub timelines must be linear — the scrollbar *is* the easing). Reserve
  bouncier eases (`back.out`, `elastic`) only if the user explicitly wants a playful,
  non-luxury register.
- A **day/night or before/after global state switch** (one click re-themes the whole
  page — background, image treatment, accent) is a strong optional differentiator for
  subjects with a natural binary (day/night for real estate & travel, before/after for
  renovation/fitness/transformation subjects, light/dark for tech products). Use it only
  when the subject supports a real binary; don't bolt it on generically.

### 2.5 Decide density and pacing

- One idea per screen. If a chapter needs two ideas, it's two chapters.
- Vertical rhythm: generous — `14–16vh` of vertical padding per chapter is typical;
  don't compress a premium-feeling page to save scroll distance.
- Reserve the longest, slowest pin for the *emotional* centerpiece, not necessarily the
  first pinned candidate you find.

---

## 3. The Motion Primitives

Implement every animated moment with **one of these seven primitives.** Do not invent
an eighth without a strong reason — the reason the reference sites feel coherent is
that the same small vocabulary repeats, varied only in *what* it's applied to.

Universal rule across all seven: **animate only `transform`, `opacity`, and
`clip-path`.** Never animate `width`, `height`, `top/left`, or trigger layout. This is
what keeps 60fps on a scroll-scrubbed page.

### 3.1 Hero settle + scrub departure

Image starts at `scale: 1.06`, settles to `1` over ~2s on load while the headline masks
in (3.2) with a stagger, starting partway through the image settle, not after it.
Supporting meta lines (location/date/eyebrow) fade up last. On scroll *away* from the
hero, run a second, scroll-scrubbed timeline (linked to the hero's own height, not a
fixed pixel range) that pushes image scale further (to ~1.14), drifts it a little,
raises a dark veil's opacity, and fades/lifts the copy — so the hero doesn't just get
scrolled over, it visibly *recedes* as the next chapter is revealed beneath it.

### 3.2 Line-mask headline reveal

Every multi-line headline: wrap each line in a clipping span (`overflow: hidden`) around
an inner span. Set the inner span to `yPercent: 108` at rest. On trigger, animate to
`yPercent: 0` with a short stagger (~0.06s) between lines, `expo.out`, ~0.8s duration.
This reads as the type being *uncovered*, not slid in. Trigger once, the first time the
element crosses roughly 85–93% up the viewport, scrolling downward, and never re-run it
on scroll-back. Guard against a headline that's already above the fold when
ScrollTrigger first measures (a refresh/resize/anchor-jump case) by snapping it to its
final state immediately in that case, rather than leaving it stuck off-screen forever —
this single edge case is the most common bug in this style.

### 3.3 Image reveal — three variants, rotate through them

Never reveal every image the same way; alternate between:

- **Uncover (vertical):** clip-path `inset(100% 0 0 0)` → `inset(0% 0 0 0)`, while the
  image itself counter-scales slightly (starts ~1.12, settles to 1, with a small
  vertical drift) so the reveal reads as a lens settling, not a curtain.
- **Wipe (horizontal):** clip-path `inset(0 100% 0 0)` → `inset(0 0% 0 0)`, same
  counter-scale idea on the image.
- **Frame/image counter-scale:** the *frame* grows from `scale: 0.93 → 1` while the
  *image inside it* shrinks from `scale: 1.14 → 1` at the same time — frame and picture
  move in opposite directions, reading as a camera racking into focus rather than a box
  simply growing.

Trigger each independently the first time it crosses ~90–92% up the viewport, same
once-only + refresh-snap logic as 3.2. Use plain supporting-copy fades (opacity + a
small y-rise, ~16px, `expo.out`, staggered when grouped) for paragraph text and stat
blocks — this is the plainest primitive and should be your default for anything that
isn't a headline or an image.

### 3.4 Pinned drawing-overlay scene (pin type 1)

One photograph fills the viewport and is **pinned** for a scrubbed distance (roughly
150–200% of viewport height of scroll). Across that pin: the photo very slowly
scales/pans (a slow camera move, driven the *entire* length of the pin so it answers
the first wheel notch, not just the overlay); an SVG line-drawing overlay (grid,
blueprint, diagram, exploded view — whatever fits the subject) draws itself on via
`stroke-dasharray`/`stroke-dashoffset` animated to 0; labels/callouts fade up one at a
time with a wide stagger so they read in sequence; then the overlay clears/reverses and
the labels fade down, leaving the clean photograph before handing to the next chapter.
Always provide a static, non-pinned fallback: the same photo with the labels listed as
plain text beneath it (see Section 6).

### 3.5 Sticky-split cross-fade (pin type 2)

Two-column layout. One column is **sticky** (`position: sticky`), holding an image that
fills it; the other column is ordinary flow containing 2–4 text panels (options,
variants, tiers). As each text panel's heading crosses roughly the vertical center of
the screen, cross-fade the sticky image to that panel's image (`autoAlpha` 0↔1 on a
short, normalized duration so the outgoing and incoming image always overlap instead of
the column ever going empty), with a small counter-scale-in on the incoming image.
Reverse on scroll back up. The sticky column's height must equal the *stacked* text
column's height (not the viewport height) or the sticky context ends before the last
panel is read. Below the mobile breakpoint, drop the sticky/pin entirely: stack each
panel with its own inline image instead (this is usually a *better* small-screen
layout, not a compromise).

### 3.6 Horizontal-gallery pin (pin type 3)

Desktop only, non-touch only. Pin the whole gallery section; a flex row of
varied-aspect images (mix portrait/square/landscape ratios so it doesn't look like a
grid) is translated on the X axis, driven by scroll, by a distance computed from the
strip's *actual* rendered width (`strip.scrollWidth - viewportWidth`) — never a guessed
constant — so the sequence always ends exactly as the last image arrives, no dead
scroll at either end. Scrub slightly faster than 1:1 (progress the strip ~0.8× the
wheel distance) so the section clears a touch sooner than a literal 1:1 mapping and
never feels like it's dragging. On touch devices or under reduced motion, this
*always* becomes an ordinary vertical stack — a horizontal pin fighting a touch
scroll gesture is the single worst interaction in this whole style; never ship it on
touch.

### 3.7 Fragment-assembly hero (optional alternative to 3.1)

Four (or N) images sit in a grid/quadrants at partial scale/offset. Driven by scroll or
by a timed intro sequence, they translate and scale toward the center and one is
selected to scale up and fill the viewport, the others fading out beneath it; the
headline then masks in (3.2) over the now-single hero image. Same easing family and
transform-only discipline as everything else. Use once, at the very top of the page,
never mid-page.

### 3.8 Supporting techniques used throughout

- **Counting numbers:** a plain JS/GSAP tween of a numeric object from a start value to
  the target, writing `textContent` on `onUpdate`, triggered once when the stat block
  enters. For a year, count from a nearby value (not zero) so it doesn't spin through
  centuries.
- **Slow scrub drift on otherwise-static chapters:** a diagram, plan, or map that
  finishes its main reveal early and then sits still for the rest of a tall chapter
  feels dead. Add a slow (`yPercent` ±5–8, linear, tied to the chapter's own scroll
  range) drift so it keeps answering the wheel for the whole chapter without adding new
  reveals.
- **Alternating editorial rows:** for feature/amenity lists, alternate which side the
  image sits on each row, and open each row's image-mask from the edge nearer the text
  (so a right-side image wipes in from the right, not always from the same side).
  Reveal on a **scrub** tied to the row's own entry (start ~88% up viewport, end ~42%
  up viewport), not a one-shot trigger — the reveal should be visibly happening at
  normal wheel speed as the row arrives, not already finished by the time it's readable.

---

## 4. Technical substrate

### 4.1 Core engineering rules (apply regardless of stack)

- **One global "motion" flag** (`prefers-reduced-motion` OR an explicit user reduced-
  motion toggle) gates *every* pin, every scrub, every mask, every cursor and drift, all
  together. Never leave the page half-animated — either the full choreography runs, or
  none of it does and content renders in its final position (Section 6.2).
- **One mobile-breakpoint flag** (~900px is what the reference sites use) gates pins,
  sticky-split, and horizontal-gallery specifically. Below it: pins drop, sticky splits
  become stacked blocks with their own images, horizontal galleries become vertical
  stacks. Don't just shrink the desktop layout — *change* the choreography.
- **A touch/pointer flag** additionally disables the horizontal-gallery pin and the
  custom cursor (a cursor-follow ring has no meaning on touch) even on a wide touch
  tablet where the mobile-width flag might not fire.
- **Scope every scene's animations** so remounts/re-renders/Strict-Mode double-invokes
  can't leave duplicate ScrollTriggers or duplicate pins fighting each other. In GSAP
  this is `gsap.context()` (Section 4.3/4.4); in a non-GSAP or vanilla setup, keep an
  explicit registry of created triggers/observers per section and tear them down before
  re-creating.
- **Refresh trigger measurements after fonts and images settle**, not just on initial
  load — a webfont swap or a lazy image finishing layout changes element heights, and
  every pin distance calculated before that moment is wrong. Re-measure once on a short
  delay, once when `document.fonts.ready` resolves, and once on window `load`.
- **Snap already-passed reveals to their end state on refresh** — anything that only
  fires "on enter, scrolling downward, once" must also handle the case where refresh
  finds it already past that point (anchor links, mid-page reloads, restored scroll
  position). Otherwise content can get stuck invisible/off-screen forever.
- Debounce viewport-resize-triggered re-measurement, and specifically **ignore height-
  only changes** (mobile browser chrome collapsing on scroll fires `resize` constantly)
  — only width changes should force a re-measure.

### 4.2 Vanilla HTML/CSS/JS + GSAP (most portable default)

Use this when the project has no framework opinion. Load GSAP + ScrollTrigger from a
CDN or npm, register the plugin once, then implement each primitive as a small function
that takes a root element and builds its own timeline/ScrollTrigger, e.g.:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script>
gsap.registerPlugin(ScrollTrigger);

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => matchMedia('(max-width: 900px)').matches;
const isTouch = () => matchMedia('(pointer: coarse)').matches;

function revealLines(root) {
  const spans = root.querySelectorAll('.line > span');
  if (!spans.length) return;
  gsap.set(spans, { yPercent: 108 });
  const tl = gsap.to(spans, {
    yPercent: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06, paused: true,
  });
  ScrollTrigger.create({
    trigger: root, start: 'top 90%', once: true,
    onEnter: () => tl.play(),
    onRefresh: self => { if (self.progress > 0) tl.progress(1); },
  });
}

function pinDrawingOverlay(root) {
  if (reducedMotion || isMobile()) return; // fallback markup already shows final state
  const image = root.querySelector('[data-scene-image]');
  const lines = root.querySelectorAll('[data-blueprint] path, [data-blueprint] line');
  const labels = root.querySelectorAll('[data-scene-label]');
  lines.forEach(line => {
    const len = line.getTotalLength();
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
  });
  gsap.set(labels, { opacity: 0, y: 10 });
  gsap.timeline({
    scrollTrigger: {
      trigger: root, start: 'top top', end: '+=180%', scrub: 0.35,
      pin: root.querySelector('[data-scene-stage]'), anticipatePin: 1, invalidateOnRefresh: true,
    },
    defaults: { ease: 'none' },
  })
    .to(image, { scale: 1.08, duration: 6 }, 0)
    .to(lines, { strokeDashoffset: 0, duration: 1.4, stagger: 0.03 }, 0.15)
    .to(labels, { opacity: 1, y: 0, duration: 0.5, stagger: 0.3 }, 1.1)
    .to(labels, { opacity: 0, y: -8, duration: 0.45, stagger: 0.08 }, 4.1)
    .to(image, { scale: 1, duration: 1.4 }, 4.6);
}

// Refresh once fonts/images settle so pin distances are measured correctly.
setTimeout(() => ScrollTrigger.refresh(), 260);
document.fonts?.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());

document.querySelectorAll('[data-reveal-lines]').forEach(revealLines);
document.querySelectorAll('[data-pin-drawing]').forEach(pinDrawingOverlay);
</script>
```

Follow the same pattern (a small, self-contained function per primitive, each building
its own `ScrollTrigger.create`/timeline, each checking the motion/mobile/touch flags
first) for the sticky-split cross-fade (3.5) and the horizontal-gallery pin (3.6) — see
Section 3 for their exact tween values.

### 4.3 React (if the project is already React)

Wrap each scene's setup in `gsap.context()` inside a layout-phase effect
(`useLayoutEffect`), scoped to a ref on the section root, and `revert()` it on cleanup.
This is what makes Strict Mode's double-mount safe and prevents duplicate pins:

```jsx
function useGsapScene(setup, deps = []) {
  const scope = useRef(null);
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const ctx = gsap.context(self => setup(root, self), scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return scope;
}
```

Build one small reusable component per primitive (`<LineHeadline>`, `<RevealImage
kind="up|wipe|scale">`, a `<PinnedDrawingScene>`, a `<StickySplit>`, a
`<HorizontalGallery>`), each accepting the motion/mobile/touch flags as props from a
single place at the top of the app — do not read `matchMedia` independently inside every
component.

### 4.4 Other frameworks (Vue, Svelte, Next app router, etc.)

Same primitives, same GSAP core. Translate the "layout-phase effect scoped to a ref,
torn down on unmount" pattern into the framework's idiom (`onMounted`/`onUnmounted` in
Vue, `onMount`/return-cleanup in Svelte, a `useEffect` in Next client components). The
motion grammar in Section 3 and the engineering rules in 4.1 are framework-agnostic;
only the wiring changes.

---

## 5. Imagery — decide, then source or generate; never leave a placeholder

Imagery carries as much of this style as the motion does — flat stock photography or
generic gradients will make the choreography look hollow no matter how correct the
GSAP is. Before writing a single `<img>` tag:

1. **Write an image brief per chapter first**, not per generic "hero image" — decide
   what each chapter's photograph needs to communicate (mood, subject, crop/aspect,
   light) as part of Section 2.1, the same way you decided its motion primitive.
2. **Check what capability you actually have, in this order of preference:**
   - **Image generation**, if available to you in this project/session → generate
     imagery *to the brief*, in one consistent visual style (same lighting logic, same
     color grade, same level of realism/render quality) across every chapter, so the
     set reads as one shoot rather than a stock grab-bag. Regenerate any image that
     breaks the set's consistency rather than keeping a mismatched one.
   - **Image/web search**, if you have no generation capability but can search → search
     per chapter brief (not one generic query for the whole site), prefer a single
     coherent source or license (e.g., Unsplash-licensed photography, one licensed
     stock library) so the *color grade and photographic style* stays consistent across
     the page, and check the license actually permits the intended use before using an
     image commercially.
   - **Neither** → say so plainly to the user rather than shipping gray boxes or
     "lorem picsum" placeholders as if they were final; ask whether they can supply
     photography, want you to proceed with an obvious placeholder treatment clearly
     marked as such, or want to enable generation/search.
3. **Never just replicate the reference sites' subject matter.** Real estate, materials,
   interiors etc. are only appropriate if the *user's* project is actually about those
   things. Generate/source imagery for what this project is actually about.
4. **Serve images responsibly:** two widths minimum (e.g., ~900px and ~1800px) via
   `srcset`/`sizes`, WebP where possible, only the hero/LCP image `eager`+
   `fetchPriority="high"`, everything else `loading="lazy"`, and always real `alt` text
   describing the photo's content (not the file name) — the drawing-overlay scene and
   any other decorative SVG should be `aria-hidden="true"` instead, with its meaning
   also present as plain text nearby (Section 6.3).

---

## 6. The non-optional contract: responsive, reduced motion, accessibility

These are not "nice to have" — the reference sites treat them as load-bearing parts of
the design, not an afterthought bolted on at the end. Build them in from the first
draft, driven by the same flags used everywhere in Section 4.1.

### 6.1 Responsive

- Test at minimum: ~1440, ~1280, ~1024, ~768, ~390, ~320px. No horizontal overflow at
  any width (this usually means `overflow-x: clip` on the scrolling root, not `body`,
  since clipping on `body` silently breaks `position: sticky` inside it).
- Below the mobile breakpoint the choreography *changes*, it doesn't just shrink: pins
  are dropped, the sticky split becomes stacked blocks with inline images, the
  horizontal gallery becomes a vertical stack. This is very often a *better* small-
  screen experience, not a compromise — say so if the user worries about it.

### 6.2 Reduced motion

`prefers-reduced-motion: reduce` (and any in-app equivalent toggle) must stand the
*entire* system down together: no pins, no scrubbed parallax/drift, no masks holding
content invisible, no custom cursor. Every heading and image must render immediately in
its **final** position — verify concretely that this means zero active pins, zero
headings stuck at `yPercent: 108`, zero images stuck fully clipped, when the flag is on.
This is a common, easy-to-miss bug: masks and clip-paths are "structural" (they should
stay in the CSS) but must never be the *only* thing preventing content from being seen.

### 6.3 Accessibility

- Semantic landmarks, exactly one `h1`, a skip link that is first in tab order, visible
  focus rings (not just a subtle outline suppression), `lang` set correctly, real `alt`
  text on every photograph.
- Decorative SVG (blueprint overlays, diagram chrome) is `aria-hidden="true"`; whatever
  information it conveys (labels, callouts) must also exist as ordinary readable text
  somewhere in the DOM (visually hidden on wide screens where the overlay already shows
  it is acceptable; shown plainly below the mobile breakpoint where the overlay itself
  is often dropped).
- Any tab/switcher control (floor-plan variants, day/night toggle, product tabs) is a
  real `role="tablist"`/`role="tab"` set with arrow-key/Home/End support, not a click-
  only div — a scroll-choreography site that only responds to a mouse fails a large
  share of its own audience.
- Don't rely on `mix-blend-mode` to make a fixed nav legible over arbitrary photography
  underneath it — it inverts unpredictably over mid-tone images. Track which chapter is
  under the nav (via each section's own light/dark tag) and switch the nav's explicit
  theme instead.

---

## 7. Pre-ship checklist

- [ ] Chapter list decided per Section 2.1, in narrative order, hero and closer mirror
      each other.
- [ ] At most 3 pinned sections total, each justified per Section 2.2 by genuine
      internal sequence — not pinned "because it looks cool."
- [ ] Hero entrance chosen deliberately (3.1 vs 3.7), not defaulted without thought.
- [ ] Palette: one light ground, one deep-not-black ink, one accent used sparingly, no
      section is a flat fill of the accent color.
- [ ] Type: exactly three roles (display, body, meta/mono) chosen for the brand, not
      copied verbatim from the reference.
- [ ] Every image reveal on the page isn't the same variant repeated — up/wipe/scale
      rotated per Section 3.3.
- [ ] Imagery sourced or generated to a written per-chapter brief, one consistent visual
      style across the set, correct license if sourced (Section 5).
- [ ] `prefers-reduced-motion` verified to fully stand down every pin/mask/drift/cursor,
      with content landing in final position (Section 6.2) — actually test this, don't
      assume it.
- [ ] Mobile breakpoint changes the choreography (drops pins, stacks the sticky split,
      verticalizes the gallery) rather than just shrinking it.
- [ ] Horizontal-gallery pin (if used) is disabled on touch, no exceptions.
- [ ] Only `transform`/`opacity`/`clip-path` are animated anywhere; nothing scrub-driven
      touches layout properties.
- [ ] ScrollTrigger measurements refreshed after fonts/images settle, and any
      already-passed one-shot reveal is snapped to its end state on that refresh.
- [ ] Every scene's animation setup is scoped/torn down cleanly (no duplicate
      pins/triggers surviving a re-render, remount, or hot reload).
- [ ] Accessibility contract in Section 6.3 met: landmarks, one h1, skip link, focus
      rings, alt text, decorative SVG hidden with its content duplicated as text, any
      tab/switcher is real tablist markup.
