---
name: magicui-effects-kit
description: >
  Component catalog and decision notes for magicui.design — 150+ React + Tailwind +
  Motion components organized into Special Effects, Text Animations, Buttons,
  Backgrounds, layout/media Components, and Device Mocks, with an official free MCP
  server. Use this skill for landing-page and marketing-surface flourish: heroes,
  feature sections, pricing, empty states, device-mockup screenshots — anywhere the
  page needs to visibly perform rather than just function.
---

# Magic UI Effects Kit

## What this library is for

Magic UI is built for the specific job of making a marketing/landing surface look
considered and well-funded — "the team behind this has their act together," in the
library's own framing. Reach for it whenever the UI need is decorative/persuasive
rather than structural: a hero, a features grid, a pricing section, a changelog, an
empty state, a device screenshot mock. Don't reach for it as the base layer for
application UI (dashboards, forms, data tables) — that's structural work, better served
by `skiper-daisyui-foundation-kit` or `unlumen-vengeance-kit`.

## The exact category map (from the official MCP's own tool schema)

Use this table to go straight to the right category instead of browsing 150+ components
blind. Each row is one MCP tool (`getX`) when the official Magic UI MCP is connected.

| Category (MCP tool) | Components | Reach for it when… |
|---|---|---|
| **Special Effects** (`getSpecialEffects`) | animated-beam, border-beam, shine-border, magic-card, meteors, neon-gradient-card, confetti, particles, cool-mode, scratch-to-reveal | you want one specific, celebratory or attention-directing moment (a connecting line between two nodes = animated-beam; a card that reveals under a scratch = scratch-to-reveal; a success moment = confetti) |
| **Text Animations** (`getTextAnimations`) | text-animate, line-shadow-text, aurora-text, number-ticker, animated-shiny-text, animated-gradient-text, text-reveal, hyper-text, word-rotate, typing-animation, scroll-based-velocity, flip-text, box-reveal, sparkles-text, morphing-text, spinning-text | any headline/stat/label needs to *arrive* rather than just render — a stat counting up = number-ticker; rotating value props = word-rotate/morphing-text |
| **Buttons** (`getButtons`) | rainbow-button, shimmer-button, shiny-button, interactive-hover-button, animated-subscribe-button, pulsating-button, ripple-button | the primary CTA needs to visually out-rank every other button on the page |
| **Backgrounds** (`getBackgrounds`) | warp-background, flickering-grid, animated-grid-pattern, retro-grid, dot-pattern, ripple, and more | the section needs ambient depth behind static content — pick **one**, not a stack (see the motion-budget rule in `ui-component-decision-guide`) |
| **Components / layout & media** (`getComponents`, `getLayout`, `getMedia`, `getMotion`, `getTextReveal`) | marquee, bento-grid, dock, orbiting-circles, animated-list, avatar-circles, icon-cloud, globe, tweet-card, file-tree, code-comparison, script-copy-btn, terminal, scroll-progress, lens, pointer, animated-circular-progress-bar, blur-fade | structural-but-decorative landing blocks — a logo wall = marquee; a feature grid with size variety = bento-grid; a nav dock = dock |
| **Device Mocks** (`getDeviceMocks`) | safari, iphone-15-pro, android | a screenshot needs a real device frame around it rather than a bare `<img>` |

## Decision notes worth calling out specifically

- **Text-animation choice should match what the text *is*, not just look cool**: a
  number that represents a real live metric → `number-ticker` (see the counting-numbers
  discipline in `scroll-choreography` Section 3.8: start from a nearby value, not zero,
  and only run it once). A rotating list of value props → `word-rotate` or
  `morphing-text`. A one-time hero headline → `text-reveal` or `blur-fade`, not a
  looping effect — a hero headline that keeps re-animating on every scroll-back reads
  as broken, not polished.
- **Backgrounds are mutually exclusive per section.** `warp-background`,
  `flickering-grid`, `animated-grid-pattern`, `retro-grid`, and `particles` are all
  answers to the same question ("what's behind this content") — pick the one that
  matches the brand's register (retro-grid/warp = more playful/retro; flickering-grid/
  particles = more technical/precise) and don't combine two.
- **Buttons: reserve the loud ones for the one CTA that matters.** `rainbow-button` /
  `shimmer-button` / `shiny-button` are for *the* primary action on a page (Subscribe,
  Buy, Get Started) — using one of these for every button on a page cancels the effect
  they're built to produce (drawing the eye to one thing).
- **`animated-beam`** is specifically for showing a connection/data-flow between two or
  more existing DOM nodes (e.g., "your data → our AI → your dashboard" style diagrams)
  — it needs real refs to the nodes it connects, it isn't a generic decorative line.

## Installation

Official MCP (`@magicuidesign/mcp`, free, no API key) is the preferred path — see
`mcp-ui-registry-setup` for the exact config. It gives implementation details per
category directly, which is faster than browsing the full 150+ list. Also installable
via the shadcn CLI once registered as a registry (`https://magicui.design/r/{name}.json`
— verify against current docs) or via 21st MCP under the author handle `dillionverma`.

## Fallback if no MCP/CLI access exists

Every component in the table above is documented well enough on magicui.design itself
(`https://magicui.design/docs/components/<name>`) to reconstruct by hand: they are all
Motion/Tailwind primitives with no exotic dependencies beyond Motion itself (and
`three`/`ogl` for a small number of WebGL-backed backgrounds — check the specific
component's docs page for its dependency list before assuming plain CSS/Motion is
enough).
