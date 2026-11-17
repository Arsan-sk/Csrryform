---
name: webgl-particle-canvas-kit
description: >
  Pattern-replication guide for animmasterlib.dev (Animmaster Lib — a premium WebGL +
  GSAP micro-interaction marketplace with no public MCP) and particles.casberry.in (a
  free browser-based AI/WebGL particle-swarm generator with a code-export panel, also
  not an installable registry). Use this skill whenever a build calls for a particle
  field, a generative WebGL background, a premium hover/border-reveal micro-
  interaction, or a drone-swarm/3D-particle-formation effect, and no MCP server exists
  for the source you're drawing from.
---

# WebGL / Particle / Canvas Kit

## Why these two have no MCP path

Neither site is a component registry an agent can install from:

- **animmasterlib.dev** is a paid/premium marketplace (~300 "PRO" components) sold as
  copy-paste code blocks behind its own storefront, not published as an open shadcn-
  style registry — there's nothing for an MCP server to index for free. Treat every
  component on it as a *pattern to study and reimplement*, not code to fetch.
- **particles.casberry.in** isn't a component library at all — it's a live, in-browser
  generative tool (Three.js-based, 20,000+ particle swarms driven by a small
  user-supplied JavaScript function). It has its own export panel (Vanilla JS / React /
  Three.js code, PNG/JPEG/WEBP wallpaper stills, PLY/GLB/OBJ 3D exports) and its own
  embedded prompt template for asking an AI (Gemini or Claude, per the page's own
  recommendation) to write the particle-behavior function. There is no install
  surface here either — the right way to use it is to use the tool itself.

Given both, this skill is about *doing the work by hand*, safely, rather than fetching.

## Animmaster Lib — how to study and reproduce its pattern (not its exact code)

Its public demo pages describe a dark, futuristic, glowing-gradient aesthetic with:
subtle border-reveal effects on hover, real-time interactive component previews, and a
combination of WebGL and GSAP for "complex mouse effects, custom scroll transitions,
and WebGL particle shaders," deliberately kept lightweight (optimized vanilla JS + GSAP,
avoiding heavy external assets, targeting a steady 60fps). To reproduce a specific
effect you've seen there:
1. Open the live public demo for that component and watch it closely — note what
   triggers it (hover, scroll, load), what property changes (border, glow, position),
   and its rough timing.
2. Reimplement using **only `transform`/`opacity`/`filter`(sparingly)/a shader uniform**
   — never layout properties — exactly the discipline in `scroll-choreography` Section
   4.1's "animate only transform/opacity/clip-path" rule, extended here to allow a
   `filter: blur()`/`drop-shadow()` for glow effects since those are the standard way to
   fake bloom without a real WebGL post-process pass.
3. For a **border-reveal-on-hover** effect specifically: animate a `background`
   conic/linear-gradient's rotation or position (via a CSS custom property tweened by
   GSAP) masked to a thin border-width area (`padding-box`/`border-box` background-clip
   trick), rather than literally animating `border-width` or `border-color` (which is
   cheap enough that it's actually fine here since it's a single small element, but the
   gradient-rotation version reads as much more premium and is what the "glowing
   gradient" aesthetic actually is).
4. Never buy or scrape the paid source — reimplementing the *visual grammar* from a
   public demo is legitimate reference-based design work; copying purchased source code
   without a license is not, regardless of what an agent is asked to do.

## particles.casberry.in — how to actually use it

This one has a real, intended workflow — use it rather than reverse-engineering it:
1. If the user wants *this exact kind of effect* (a 3D particle swarm/formation,
   optionally shaped like an uploaded image, video, 3D model, or blueprint, with preset
   local formations — Sphere, Cube, Helix, Donut — or a fully custom particle-behavior
   function), the fastest path is to open the tool itself and use its **Export
   Formation** panel: choose Vanilla JS / React / Three.js as the target, pick a PLY
   export mode (Point Cloud vs. Solid Mesh) if a 3D asset is needed, and take the
   generated code directly — this is exactly what the tool exists to produce.
2. To get a *specific* particle-behavior shape (not one of the built-in presets), reuse
   the tool's own embedded prompt template (visible in its "AI Educational Simulator"
   panel) rather than writing an ad hoc one: it already encodes the tool's exact
   constraints (write only to the provided `target`/`color` objects, zero garbage
   collection inside the per-frame loop, no `document`/`window`/`fetch`/timers/eval,
   all variables explicitly declared, finite-number safety guards) — reusing it means
   the generated function will actually pass the simulator's validator on the first try.
3. If the user wants the *effect* but not the *tool* (i.e., a standalone Three.js
   particle system embedded directly in their own project, no dependency on Casberry's
   site), take the exported Vanilla JS/React/Three.js code from step 1 as the starting
   implementation and adapt it — it's already written to the performance discipline in
   the next section.

## Performance and accessibility discipline for anything in this bucket

Both of these produce genuinely expensive visuals (WebGL shaders, thousands of
particles, blur/glow filters). Apply all of the following, without exception:
- **One heavy WebGL/canvas effect per page, ever.** Never stack a particle background
  under a shader-based hover effect under another canvas element.
- **Pause when off-screen.** Use an `IntersectionObserver` to stop the render loop
  (`cancelAnimationFrame`) the moment the canvas scrolls out of the viewport, and resume
  only when it re-enters.
- **Respect `prefers-reduced-motion` totally** — render a single static frame (or a
  plain gradient/image fallback) instead of the animated loop, not a slowed-down version
  of it.
- **Gate particle count / resolution by device.** Detect a rough performance tier
  (e.g., `navigator.hardwareConcurrency`, or simply `matchMedia('(pointer: coarse)')` as
  a mobile proxy) and scale particle count/resolution down substantially on mobile —
  20,000 particles at 60fps is a desktop-GPU assumption, not a universal one.
- **Never allocate inside the per-frame loop** (no `new THREE.Vector3()`, no array
  allocation, no object literals) — this is the single biggest cause of jank in these
  effects and is exactly the rule the Casberry tool's own validator enforces; apply it
  even when hand-writing a Three.js/WebGL effect from scratch.
