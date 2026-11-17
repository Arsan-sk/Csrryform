---
name: unlumen-vengeance-kit
description: >
  Component catalog and decision notes for ui.unlumen.com (motion-that-responds-to-
  the-page flourishes: scroll reveals, count-ups, cursor trails, aurora/liquid
  backgrounds, an animated sidebar/nav) and vengenceui.com (Vengeance UI — Next.js
  components built on Radix primitives and Tailwind CSS). Use this skill for
  scroll-driven decorative moments and for accessible structural components inside a
  Next.js/Radix project specifically.
---

# Unlumen + Vengeance Kit

## Why these two are paired

Neither is large enough to be a whole design system on its own, and each covers a gap
the other leaves. Unlumen UI (per its own author's framing) is deliberately small and
built around one idea — motion that reacts to scroll position rather than motion that
plays on a timer — so it's a second/third source layered on top of a base, never the
foundation. Vengeance UI supplies the kind of Radix-primitive-backed, Next.js-shaped
structural components (the accessible dialog, the real form control) that a scroll-
flourish library like Unlumen doesn't attempt. Use Unlumen for the moments that make a
page feel responsive to the reader; use Vengeance for the components that make the page
actually work as an app.

## Unlumen UI catalog (published as its own shadcn registry at ui.unlumen.com, 132
components; the curated set below are its own author's "start here" 12–22)

- **Scroll-reactive:** Scroll Reveal Image, Side By Side Slide, Scroll Progress,
  Horizontal Depth Fade — the core thesis of this library. Implement these as an
  IntersectionObserver-driven reveal, not a scroll-position listener recalculated every
  frame (this is the library's own documented design rule — cheaper and jankless).
- **Ambient/backgrounds:** Aurora Bars, Aurora Blur, Pixel Liquid Background (a WebGL
  fluid sim that reacts to cursor movement, depends on `three`).
- **Cursor/pointer:** Cursor Image Trail, Floating Tooltip.
- **Navigation:** Expand Menu, Animated Sidebar (spring hover highlight, animated
  active-indicator bar, collapsible groups, drag-to-resize).
- **Feedback/微:** Glow Button, Highlight, LED Dot Matrix Display ("Matrix").
- **Counting/stats:** Count Up — the library's own documented rule: put the *final*
  value in the DOM from the start (so it's correct even before JS runs / for
  accessibility/SEO), and don't let it re-trigger every time the element scrolls back
  into view — count once, like the `scroll-choreography` skill's own counting-numbers
  primitive.
- **Its wider 132-component registry** also includes: an AI chat component, a
  Stripe-Radar-style live push feed, an animated toggle switch, aurora-blur pricing
  cards, a ⌘K command palette with theme switcher, animated dock (Gaussian
  magnification), animated file-tree, a favicon-fetching search input, and several
  animated grid-reorder icon components. Verify current contents via its MCP/registry
  before assuming this list is exhaustive — it grows.

## Vengeance UI

Next.js-targeted components built on Radix UI primitives with Tailwind CSS — the same
general shape as shadcn/ui itself (copy-paste distribution, Radix accessibility
underneath, Tailwind styling on top). Treat it as a candidate structural base layer
specifically for Next.js projects, alongside or instead of stock shadcn/ui, when the
project wants Radix-backed primitives without adopting shadcn's own CLI/conventions.
Confirm its current component catalog and install method directly from vengenceui.com
before use — check specifically for a shadcn-registry or `llms.txt`/MCP entry point the
same way you would for any library in `mcp-ui-registry-setup` Section 2 step 5, since
its exact current surface wasn't independently verifiable at the time this skill was
written.

## Decision notes

- **Scroll-reveal image vs. `scroll-choreography`'s own image-reveal primitives**: if
  you're already building a whole page with the `scroll-choreography` skill, use *that*
  skill's clip-path-based reveal variants (Section 3.3) for consistency across the
  page's whole choreography, rather than mixing in Unlumen's separate implementation of
  the same idea — reserve Unlumen's Scroll Reveal Image for projects that aren't
  already running the full choreography system.
- **Cursor Image Trail is a page-wide, image-based cursor effect** — heavier and more
  attention-grabbing than SmoothUI's local "Cursor Follow" (`componentry-smoothui-
  motion-kit`). Use Cursor Image Trail only where the cursor trail *is* the point
  (an art/photography portfolio); use SmoothUI's version for a subtle, localized touch
  near one interactive element.
- **Pixel Liquid Background is expensive** (WebGL fluid simulation). Apply the same
  discipline as `webgl-particle-canvas-kit`: one instance per page maximum, paused when
  scrolled out of view, disabled under `prefers-reduced-motion` and on low-power/mobile
  devices.
- **Prefer Vengeance's primitives over Unlumen's for anything the user must operate
  correctly** (forms, real navigation, dialogs) — Unlumen's components are optimized
  for visual flourish, not for being the only implementation of a critical control.

## Installation

Unlumen: its own shadcn-compatible registry (`shadcn add @unlumen/ui` per its own docs,
or register `https://ui.unlumen.com/r/{name}.json` in `components.json`) or its own MCP
server ("Your AI editor gets unlumen UI's full docs and patterns via our MCP server" —
confirm the current connection method on ui.unlumen.com), or via 21st MCP under the
author handle `unlumen`. Vengeance: verify current install method on vengenceui.com
directly (see the decision note above).
