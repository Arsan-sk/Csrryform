---
name: ui-component-decision-guide
description: >
  The router and decision engine for choosing UI components, interactive widgets, and
  transitions from a specific known library set (componentry.dev, smoothui.dev,
  magicui.design, ui.unlumen.com, vengenceui.com, skiper-ui.com, daisyui.com,
  animmasterlib.dev, particles.casberry.in) rather than inventing components from
  scratch. Use this skill whenever a UI/frontend build needs a component, effect, or
  transition decision — a hero, a nav, a card, a background, a cursor effect, a
  marquee, a particle field, page/section transitions — and whenever the user asks
  "what component should I use for X" or "make this feel more interactive." This
  skill decides which sibling skill folder to open and which library wins for a given
  slot; it does not itself enumerate every component (the sibling skills do that).
---

# UI Component Decision Guide

## 0. How this skill fits with its siblings

This folder is one of several. Read this one first, always — it tells you which of the
others to open:

- `mcp-ui-registry-setup` — how to reach live component catalogs via MCP, and the
  fallback order when a server isn't connected.
- `componentry-smoothui-motion-kit` — Framer-Motion+Tailwind micro-interaction
  components (componentry.dev, smoothui.dev).
- `magicui-effects-kit` — backgrounds, text effects, buttons, special effects, device
  mocks (magicui.design).
- `unlumen-vengeance-kit` — scroll/motion-reactive flourishes (unlumen) + structural
  Radix/Next.js primitives (vengeance).
- `skiper-daisyui-foundation-kit` — themeable base layer (daisyUI) + uncommon shadcn
  extras (Skiper UI).
- `webgl-particle-canvas-kit` — WebGL/canvas/particle effects with no MCP available
  (animmasterlib.dev, particles.casberry.in).
- `reverse-engineering-playbook` — the general method for learning any component or
  transition from a live site (Awwwards, sarahzaheer.site, or anything else) when
  neither an MCP nor a docs page exists.

This skill's job: given a UI need, decide (a) which functional category it falls into,
(b) which library in that category is the right fit for *this* project's register, (c)
whether to fetch it live (MCP) or reconstruct it from documented knowledge, and (d) how
to keep it visually consistent with everything else on the page. Sections 1–3 below are
that decision process.

## 1. Classify the need first

Before picking a library, name what you're actually building. Every UI need on a modern
site falls into one of these buckets — match the user's request (or the gap in the
current design) to a bucket, then jump to the matching row's "go to" column:

| Bucket | Examples | Go to |
|---|---|---|
| **Structural primitive** | dialog, dropdown, tabs, form fields, accordion, data table, select, sidebar | `skiper-daisyui-foundation-kit` (daisyUI) or `unlumen-vengeance-kit` (Vengeance) — pick per Section 2 |
| **Micro-interaction on a primitive** | animated accordion open, spring modal, OTP input, animated progress bar, cursor-follow tooltip | `componentry-smoothui-motion-kit` |
| **Marketing/landing flourish** | marquee, bento grid, orbiting circles, animated beam, shine border, confetti, device mockup | `magicui-effects-kit` |
| **Text effect** | typing animation, number ticker, word rotate, gradient text, line-mask reveal | `magicui-effects-kit` first (widest catalog); `componentry-smoothui-motion-kit` for a subtler one |
| **Scroll/motion-reactive background or flourish** | aurora blur, pixel-liquid background, scroll-reveal image, cursor image trail, count-up stat | `unlumen-vengeance-kit` (unlumen half) |
| **Ambient/generative visual** | particle field, WebGL swarm, shader background, glow/border-reveal premium hover | `webgl-particle-canvas-kit` |
| **Theming/design-token system** | dark mode, multiple brand themes, consistent color system across many components | `skiper-daisyui-foundation-kit` (daisyUI's theme system) |
| **"Make my whole page feel alive"** | no single component named, just "more interactive" | Read Section 3 below first — resist the urge to sprinkle one of everything |
| **"How did site X do that effect"** | a specific Awwwards/portfolio effect with no matching library | `reverse-engineering-playbook` |
| **Whole-page cinematic scroll experience** | long-form scrollytelling, pinned scenes, Era-Residence-style page | the separate `scroll-choreography` skill (not in this folder) governs structure; this suite still supplies individual components inside it |

## 2. Decide which library wins when two overlap

Several libraries can technically produce the same component (e.g., both daisyUI and
Vengeance UI can give you a modal). Break the tie with these questions, in order:

1. **What's the project's existing stack?** If the project already has shadcn/ui +
   Radix installed, prefer libraries built the same way (componentry, smoothui,
   unlumen, magicui, Skiper UI, Vengeance UI — all Tailwind + Radix/shadcn-shaped)
   over daisyUI, which is a *different* styling paradigm (semantic class names over
   raw Tailwind utilities, framework-agnostic). Don't mix the two paradigms on one
   page — pick one base layer per project.
2. **Is the project framework-agnostic or plain HTML** (no React/Vue build step)?
   → daisyUI is the only library on this list built for that use case out of the box
   (pure CSS classes). Everything else assumes a React component model. If the project
   is plain HTML/CSS/JS, daisyUI is close to the only fit here without adapting code.
3. **Does the component need to be genuinely accessible** (keyboard nav, ARIA,
   screen-reader correctness) as a hard requirement (forms, nav, dialogs)? → prefer
   Vengeance UI or daisyUI (both Radix-primitive- or semantics-first) over a pure
   visual-effects library — magicui/componentry/unlumen components are optimized for
   visual flourish, not for being your accordion's only implementation.
4. **Is this a decorative/marketing moment** (hero, landing section, empty state) where
   visual impact matters more than exhaustive a11y coverage? → magicui or unlumen win;
   reach for their showier components without hesitation here.
5. **Still tied?** Prefer whichever library the project has *already* installed one
   component from — don't add a fourth dependency source for one more button when the
   project already has three components from Magic UI, use Magic UI's button too.

## 3. The consistency rule — read this before installing anything

The single biggest failure mode when combining components from many libraries is a
page that feels like a demo grid instead of one product. Enforce these rules on every
build that pulls from more than one library in this list:

- **One easing/timing vocabulary for the whole page.** Pick one entrance easing (e.g.
  `expo.out` or a spring with one damping/stiffness pair) and reuse it whether the
  component came from componentry, unlumen, or magicui. Every one of these libraries
  exposes animation props/variants — override their defaults to match your page's
  vocabulary rather than accepting each library's own default feel.
- **One set of design tokens.** Colors, radii, spacing, and type scale come from the
  project's own Tailwind theme / CSS variables, not from whatever each library ships
  as a demo default. Before installing any component, confirm it reads `--primary`,
  `--background`, `--radius` etc. rather than hardcoding its own palette — if it
  hardcodes, restyle it immediately after install, don't ship the demo colors.
- **A motion budget, not a motion buffet.** For any single screen, cap yourself at:
  one ambient/background effect (particles, aurora, grid) + one or two hover/micro-
  interactions per interactive element + one entrance-reveal style used consistently
  for every card/section on that screen. If a screen wants a particle background AND
  a shine-border AND a cursor trail AND a confetti burst, that's four different
  libraries' "hero" gestures stacked on one screen — cut it to the one or two that
  actually serve the content.
- **Reduced motion and performance are not optional** regardless of which library
  supplied the component. Every component you pull in must respect
  `prefers-reduced-motion` (most of magicui/componentry/unlumen's own components
  already do — verify, don't assume) and must not be a canvas/WebGL effect running at
  full framerate behind static content that doesn't need it (see
  `webgl-particle-canvas-kit` for the specific performance discipline that bucket
  needs).
- **Say what you chose and why, briefly**, when you install something non-obvious —
  future edits (yours or the user's) go faster when the reasoning is visible in a
  short comment near the install, not buried in this skill file.

## 4. The standard workflow for any UI request

1. Classify the need (Section 1).
2. Check `mcp-ui-registry-setup` — is a live MCP server already connected for the
   winning library? If yes, search/fetch the real component through it (get the real
   code, real dependency list, a live preview) rather than reconstructing from memory.
3. If no MCP is connected for that library, open the matching sibling skill
   (`componentry-smoothui-motion-kit`, `magicui-effects-kit`, etc.) and use its
   documented component list and implementation notes to build the equivalent by hand.
4. If the need doesn't match any library on this list at all (a bespoke effect seen on
   a reference site), go to `reverse-engineering-playbook`.
5. Apply Section 3's consistency rules before considering the component done.
6. If nothing in this list's install surface works in this environment at all (no
   network, no MCP tool support, no ability to run a CLI), say so plainly and build
   the closest hand-written equivalent using the pattern description in the relevant
   sibling skill — never block the user's request on tooling that isn't available.
