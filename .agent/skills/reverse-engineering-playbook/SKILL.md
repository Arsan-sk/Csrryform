---
name: reverse-engineering-playbook
description: >
  The general method for learning a specific UI component, transition, or interaction
  pattern from any live website when no MCP server, registry, or documentation exists
  for it — including browsing Awwwards' interactive-site showcase for a reference
  effect, and studying an individual portfolio site. Worked example throughout:
  sarahzaheer.site. Use this skill whenever the user points at a specific site or
  Awwwards entry and asks for "that effect," and none of the other skill folders in
  this set cover it.
---

# Reverse-Engineering Playbook

## When to use this instead of a library skill

Use this skill when the need doesn't match any of: `componentry-smoothui-motion-kit`,
`magicui-effects-kit`, `unlumen-vengeance-kit`, `skiper-daisyui-foundation-kit`,
`webgl-particle-canvas-kit`. That's most often: a specific effect on a specific
reference site the user names or links, an Awwwards entry, or "make it feel like
[site]" with no component library implied.

## The method, in order

1. **Fetch and read the live page**, not a screenshot or your prior memory of it. Note
   structure (landmarks, repeated section shapes), what's animated vs. static, and
   what triggers each animation (load, scroll, hover, click). If the page is JS-heavy
   and the fetched HTML looks sparse, that's itself informative — it tells you the
   effect is client-rendered and you're reading the pre-hydration skeleton, not the
   final DOM; describe what you can still infer (class name patterns, repeated
   structural markers, meta tags) rather than guessing content that isn't there.
2. **Name the pattern, don't just describe the pixels.** "Text that slides up" is not
   as useful as "a line-mask reveal, the same primitive documented in
   `scroll-choreography` Section 3.2" — naming the pattern tells you which existing
   skill's implementation notes to reuse instead of inventing a new one.
3. **Check whether a sibling skill in this set already documents the exact primitive**
   before writing new implementation notes — line-mask headlines, pinned scroll scenes,
   sticky cross-fades, and horizontal galleries are already fully specified in the
   `scroll-choreography` skill; counting numbers and scroll-reveal images are covered in
   `unlumen-vengeance-kit`; a glow/border-hover is covered in
   `webgl-particle-canvas-kit`. Reuse those specs rather than re-deriving them each time
   a new reference site happens to use the same idea.
4. **Only when the pattern is genuinely new**, write down: the trigger, the properties
   animated (transform/opacity/clip-path only, per the universal rule), the easing
   family, and the DOM shape needed to support it (e.g. "each line needs its own
   overflow-hidden wrapper"). This is the artifact worth keeping — a short, reusable
   pattern note, not a line-by-line copy of the source site's code.
5. **Never copy the source site's actual code, copy, images, or exact visual identity**
   — reference-based learning means reproducing the *mechanism*, in your own project's
   content, palette, and copy. This applies doubly to a named individual's portfolio
   (see the worked example below) and to any Awwwards entry, which is someone's
   client work.

## Worked example: sarahzaheer.site

Fetching this portfolio's homepage surfaces a specific, nameable set of patterns —
here's how to read them the way step 2–4 above describe, rather than just noting "it's
a nice portfolio":

- **A live, ticking local-time readout in the header** ("01:30 AM PST") — a plain
  `setInterval`-driven clock, timezone-formatted, updating once a minute or once a
  second. Pattern name: **live micro-status readout**. Use it (in any project) to add a
  small sense of "a real person/place is behind this," not as a functional feature —
  keep the update interval cheap (once a minute is usually enough; don't re-render a
  whole component every second for a display most users glance at once).
- **A persistently-repeated "Let's Talk" call-to-action**, appearing far more times in
  the fetched content than a single nav link would — this is a **sticky/duplicated CTA
  pattern**: the same button rendered in a fixed header, a mobile menu, and inline in
  copy, so it's always one click away regardless of scroll position. Reproduce as one
  real sticky-positioned CTA plus repeated inline mentions in copy, not by literally
  duplicating the DOM node many times.
- **A duplicated, looping skill/tag list** ("Human-Centered Design / Product Strategy /
  Design Systems / …" repeated three times back-to-back in the fetched text) — this is
  a **CSS/JS marquee**: the list is duplicated in the DOM specifically so a
  `transform: translateX` loop can scroll seamlessly with no visible seam, then paused
  on hover. This is the exact mechanism behind Magic UI's `marquee` and Unlumen's
  vertical-marquee component (`magicui-effects-kit`, `unlumen-vengeance-kit`) — if the
  project already has one of those installed, reuse it instead of hand-rolling a new
  marquee.
- **A numbered, sequential process list** ("01 Understand / 02 Make Sense of It / 03
  Imagine / 04 Shape the Direction / 05 Create / 06 Evolve", each with a short verb-led
  title and one sentence) — this is an **editorial numbered-step pattern**, best paired
  with the `scroll-choreography` skill's "alternating editorial rows" primitive
  (Section 3.8) if the surrounding page is otherwise a scroll-choreographed build, or
  with `step_card`-style stepper UI if it's a plain app screen.
- **Case-study entries that repeat** (each shown with a role, client, and duration,
  appearing multiple times in sequence) — this is a **horizontal or carousel case-study
  list**, the same functional shape as `scroll-choreography`'s horizontal-gallery pin
  (Section 3.6) but scaled down to cards-with-metadata rather than bare images; reuse
  that pin's exact-distance-from-rendered-width calculation if you build it as a scroll
  gallery, or a plain carousel component (daisyUI has one — `skiper-daisyui-foundation-
  kit`) if a full pin isn't warranted for this project's register.
- **A split, bracket-styled headline treatment** (`[I believe great design isn't just
  seen. It's felt.]`) — a **typographic framing device**: square brackets or similar
  punctuation used as a recurring visual motif around key statements throughout the
  page, not just once in the hero. If you adopt this, pick one framing device and reuse
  it consistently everywhere the page wants to mark a "key statement," the same
  consistency discipline as `ui-component-decision-guide` Section 3.

## Using Awwwards' interactive-site showcase specifically

`awwwards.com/websites/web-interactive/` is a curated feed of sites, not a library —
treat every entry as its own reverse-engineering target via the method above. Two extra
notes specific to this source:
- Awwwards entries are frequently agency/client work with heavier custom builds (WebGL,
  bespoke shaders, elaborate loaders) than most component-library output — expect to
  spend more of steps 1–4 above per entry, and expect that some effects are genuinely
  bespoke enough that no existing skill in this set names the pattern yet. When that
  happens, write the new pattern note (step 4) rather than forcing it into an
  ill-fitting existing category.
- If an Awwwards entry turns out to already be documented elsewhere in this skill set
  (e.g., it's the Era Residence site covered by `scroll-choreography`), use that
  dedicated skill instead of re-deriving it from scratch here.
