---
name: skiper-daisyui-foundation-kit
description: >
  Component catalog and decision notes for daisyui.com (a free, framework-agnostic,
  semantic-class Tailwind CSS component + theming library covering the full range of
  standard UI primitives and its own theme system) and skiper-ui.com (Skiper UI — an
  "uncommon components for shadcn/ui" library of less-standard, more editorial
  interaction patterns). Use this skill for the base structural layer of a project
  and for consistent theming/dark-mode across many components.
---

# Skiper UI + daisyUI Foundation Kit

## Why these two are paired

daisyUI is the base: a complete, themeable set of ordinary UI primitives (button,
modal, table, navbar, form controls — the full standard component vocabulary) that
works in *any* Tailwind project, React or not, and comes with a real theming system
(dozens of built-in themes, a color-token system, dark-theme config) rather than a
single fixed look. Skiper UI is the un-common layer on top: components explicitly
positioned as *not* the standard shadcn set — the ones you reach for once the standard
primitives are in place and a specific section needs something more distinctive. Use
daisyUI to make the app work and look coherent everywhere; use Skiper UI to make one or
two specific moments stand out.

## daisyUI — what it actually is, and when it's the right call

- **Not a React component library** — it's pure Tailwind CSS: semantic class names
  (`btn`, `card`, `modal`, `menu`) that work in plain HTML, React, Vue, Svelte, Angular,
  Laravel Blade, Django templates, Rails, HTMX — anywhere Tailwind runs. This is the
  deciding factor from `ui-component-decision-guide` Section 2, point 2: if the project
  has no React build step, daisyUI is close to the only fit on this entire list without
  adapting code.
- **Full component coverage**, organized (per its own docs) as: Actions (Button,
  Dropdown, FAB/Speed Dial, Modal, Swap, Theme Controller), Data display (Accordion,
  Avatar, Badge, Card, Carousel, Chat bubble, Collapse, Countdown, Diff, Hover 3D card,
  Hover Gallery, Kbd, List, Stat, Status, Table, Text Rotate, Timeline), Navigation
  (Breadcrumbs, Dock, Link, Menu, and more), plus Layout & Typography utilities and a
  full form-control set. Treat this as the default answer for any *standard* structural
  need before reaching for a heavier animated library for the same primitive.
- **Theming is the headline feature**: dozens of named built-in themes plus a
  first-class custom-theme system (colors, base style, effects like depth/noise) driven
  by CSS variables/Tailwind v4 tokens — if a project needs a real day/night or
  multi-brand theme switch (see `scroll-choreography`'s optional "global state switch"
  pattern), daisyUI's theme-controller component is the ready-made mechanism rather
  than hand-rolling one.
- **Free and official skills/MCP exist**: an official free "daisyUI Skill" (installable
  agent skill, `daisyui-mcp skills install`), a free community MCP server
  (`daisyui-mcp` on PyPI, or the GitMCP proxy — see `mcp-ui-registry-setup`), and
  `llms.txt`/`llms-full.txt` for non-MCP agents. There is also a paid official
  "Blueprint" code-generator MCP and paid "Dashboard"/"Charts" skills for heavier admin-
  panel/chart work specifically — not needed for the component-selection use case this
  skill set covers, only worth mentioning if the user is building a data-heavy admin
  panel and wants that specialized generator.

## Skiper UI — what it's for

Positioned explicitly as *un-common* shadcn/ui components — i.e., not another button or
card, but the more editorial/interaction-forward pieces (its components are indexed on
21st.dev under the author handle `reuno-ui`, with names like "Scroll Fade Area" — a
scrollable panel that fades content at its top/bottom edges via pure CSS scroll-driven
animation, no JavaScript). Reach for Skiper UI specifically when:
- daisyUI/shadcn's standard version of a component (a plain scroll area, a plain
  dropdown) feels too generic for a section that's meant to be a design highlight.
- You want a component that leans on newer CSS scroll-driven-animation capabilities
  (no-JS scroll effects) rather than a JS scroll listener — check each component's docs
  for its actual browser-support floor before relying on this for a broad audience.

## Decision notes

- **Don't mix daisyUI's semantic classes with shadcn-style raw-utility components on
  the same element.** They're different theming paradigms (daisyUI's `btn btn-primary`
  vs. a shadcn `<Button variant="default">` built from raw Tailwind + `cva`) — pick one
  as the project's base per `ui-component-decision-guide` Section 2, point 1, and use
  the other library's components only for the specific slots that base can't fill,
  restyled to match rather than left in two visual languages.
- **daisyUI first, Skiper UI second, for any given screen.** Build the screen's
  ordinary structure in daisyUI, then identify the one or two moments (per the motion-
  budget rule) that deserve an un-common treatment, and only then reach for Skiper UI
  for those specific spots.
- **Skiper UI has no independent MCP of its own** — reach it through 21st MCP (author
  `reuno-ui`) or the shadcn CLI once its registry URL is confirmed; see
  `mcp-ui-registry-setup`.

## Installation

daisyUI: `npm i -D daisyui` + Tailwind plugin config (see daisyui.com/docs/install for
the current framework-specific steps — Next.js, Vite, SvelteKit, etc. each have a short
guide); MCP via GitMCP proxy or `daisyui-mcp`; `llms.txt` fallback always available.
Skiper UI: via 21st MCP (`reuno-ui` author handle) or shadcn CLI once its registry URL
is confirmed on skiper-ui.com's own install docs.
