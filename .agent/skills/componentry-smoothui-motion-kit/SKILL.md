---
name: componentry-smoothui-motion-kit
description: >
  Component catalog and decision notes for componentry.dev and smoothui.dev — two
  shadcn-CLI-installable, Framer Motion (Motion) + Tailwind CSS React libraries built
  for micro-interactions rather than page-level flourish. Use this skill when a build
  needs a small, polished animated primitive (accordion, modal, input, progress bar,
  cursor-follow effect, a spring-driven interaction) rather than a landing-page
  set-piece, or whenever componentry.dev or smoothui.dev are named directly.
---

# Componentry + SmoothUI Motion Kit

## Why these two are one skill

Both libraries share a tech stack (React + TypeScript + Tailwind CSS + Motion/Framer
Motion), a distribution model (copy-paste source, installable via the shadcn CLI or
their own registry, indexed on 21st.dev with MCP pull-through), and a design register:
small, spring-driven micro-interactions rather than big marketing set-pieces. Where
Magic UI (`magicui-effects-kit`) is the library to reach for when you want a landing
page to feel alive, these two are the library to reach for when you want an individual
control — an input, a modal, an accordion, a progress indicator — to feel considered.

## Known catalog (verify current contents via MCP/docs before assuming completeness)

**componentry.dev** (Componentry, by Harsh Jadhav, MIT-licensed, ~40+ components in the
full repo, 9 indexed on 21st at time of writing):
- Animated Gradient, Circuit Board, Eye Tracking, Infinite Image Field, Magnet Lines,
  Particle Galaxy, Pixel Canvas, Silk Aurora, Testimonial Marquee.
- Two components (`image-trail`, `layered-stack`) depend on GSAP specifically, not
  Motion — note this before installing if the project wants to avoid a second animation
  runtime; everything else in this library needs only Motion.

**smoothui.dev** (SmoothUI, by Edu Calvo, 50+ components, 14–15 indexed on 21st at time
of writing, explicitly built to extend shadcn/ui with motion rather than replace it):
- Accordion (two variants — a plain "Basic Accordion" and an animated one), Animated
  Input, Animated Progress Bar, Apple Invites, Basic Modal / Modal, Contribution Graph,
  Cursor Follow, Dynamic Island, Job Listing, Otp Input, Pricing Blocks, Siri Orb.
- SmoothUI explicitly shares shadcn's `cn()` utility and CSS variable theming (`
  --primary`, `--background`, etc.), so it slots into an existing shadcn project without
  a restyle pass — this is the strongest reason to prefer it over a from-scratch
  animated component when the project already uses shadcn/ui.

## When to reach for this kit vs. a sibling

| Need | Use this kit when… | Use a sibling instead when… |
|---|---|---|
| Accordion/modal/input that needs to *feel* alive | the base primitive already exists (shadcn/daisyUI) and you're layering motion onto it | you need the primitive itself first — get that from `skiper-daisyui-foundation-kit` |
| Ambient background (Silk Aurora, Particle Galaxy, Pixel Canvas) | it's a **secondary** decorative layer behind real content | it's the *entire point* of the section (a generative art piece) — then use `webgl-particle-canvas-kit`, which is built for that performance profile |
| Cursor-follow effect | a small, local cursor reaction near one element (SmoothUI's Cursor Follow) | a page-wide, trailing image-cursor effect — that's `unlumen-vengeance-kit`'s Cursor Image Trail instead |
| A status widget with personality (Dynamic Island, Siri Orb) | the project wants a specific, recognizable "OS-level" affordance | a generic toast/notification — plainer libraries (daisyUI) suit that better and won't fight your own notification system's semantics |

## Installation notes

- Both are shadcn-CLI compatible: `npx shadcn@latest add "<registry-url>"` once
  registered in `components.json` (see `mcp-ui-registry-setup`), or reachable via 21st
  MCP under their respective author handles.
- SmoothUI additionally ships its own `smoothui-cli` for scaffolding — prefer the
  shadcn-CLI path anyway if the project is otherwise a stock shadcn project, so every
  component in the codebase came in through the same tool and the same
  `components.json` registry list.
- After install, restyle immediately to the project's own token set per
  `ui-component-decision-guide` Section 3 — these libraries demo well in their own
  palette but are built to be re-themed, not kept as-shipped.

## Fallback if no MCP/CLI access exists

Both are small enough to hand-write the equivalent from first principles: a spring
timeline (Motion's `animate`/`useAnimation`, or a CSS-transition approximation if Motion
isn't installed) driving `transform`/`opacity` only, matching the shape described above
(e.g. "Dynamic Island" = a pill that morphs width/height and cross-fades content on
state change; "Cursor Follow" = a small element whose position is lerped toward the
pointer on `pointermove` inside a `requestAnimationFrame` loop, exactly like the cursor
primitive documented in the `scroll-choreography` skill's Chrome/Cursor pattern).
