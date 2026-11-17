---
name: mcp-ui-registry-setup
description: >
  How to detect, connect to, and prioritize between the MCP servers available for the
  UI component libraries componentry.dev, smoothui.dev, magicui.design,
  ui.unlumen.com, skiper-ui.com, and daisyui.com, plus what to do when no MCP server
  is available (vengenceui.com, animmasterlib.dev, particles.casberry.in, and
  reference-only sites like Awwwards or a portfolio). Use this skill before fetching
  or installing any component from this library set, and whenever the user asks about
  connecting MCP servers, agentic IDE setup, or "how do I get these components into
  my editor."
---

# MCP UI Registry Setup

## 1. Check before you configure anything

Before running any install command, check what's already available in this session:
list the currently connected tools/MCP servers. Do not re-run setup for a server that's
already connected — verify it works with one cheap read call instead (e.g. "list
components") and move on.

## 2. The priority order, and why

When more than one server could supply the same component, prefer them in this order:

1. **shadcn MCP** (`npx shadcn@latest mcp init --client <x>`) — official, free,
   unlimited, works with *any* registry that publishes a `registry.json`, including
   componentry, smoothui, unlumen, and magicui (all four explicitly document shadcn-CLI
   installability). This is the highest-value single server because one connection
   covers four of the nine reference libraries, with no rate limit and no API key.
   Register each library's registry URL in the project's `components.json` under
   `"registries"` — see `MCP-SETUP-PROMPT.md` at the root of this skill folder for the
   exact block. Verify each URL against that library's own docs before relying on it;
   registry paths can move.

2. **Magic UI's own MCP** (`@magicuidesign/mcp`, free, no API key) — use this *instead
   of* the shadcn bridge for Magic UI specifically when you need more than "install
   component X": its tools are categorized (`getSpecialEffects`, `getTextAnimations`,
   `getButtons`, `getBackgrounds`, `getDeviceMocks`, `getComponents`, `getAnimations`,
   `getLayout`, `getMedia`, `getMotion`, `getTextReveal`), which makes *browsing by
   category* — "what special effects exist" — a single call instead of a guess.

3. **21st MCP** (`https://21st.dev/api/mcp`, free tier, needs a free API key from
   21st.dev/mcp) — the broadest net. It indexes componentry, smoothui, unlumen, and
   Skiper UI (published there under the author handle `reuno-ui`) alongside thousands
   of other shadcn-shaped libraries, with inline live previews before you install
   anything. Reach for this when: (a) you don't know which library has the component
   you want and need to search across all of them at once, or (b) you specifically
   need a Skiper UI component, since Skiper UI has no other documented MCP path.
   Free-tier installs are rate-limited per day — use search/preview freely, but spend
   actual installs deliberately.

4. **daisyUI** (free either way):
   - Preferred: the GitMCP proxy, `npx -y mcp-remote https://gitmcp.io/saadeghi/daisyui`
     — genuinely free, no signup, no rate limit beyond GitMCP's own.
   - Fallback: daisyUI's `llms.txt` (`https://daisyui.com/llms.txt`) fetched directly
     and kept in context — use this if the MCP proxy isn't reachable in this
     environment (e.g. no arbitrary command execution allowed) or if you only need a
     quick answer and don't want to spend a tool round-trip.
   - There is also an official paid server ("Blueprint") — don't reach for it; nothing
     in this skill set requires it, and the free routes above cover the same ground
     for reading component docs and generating code.

5. **Vengeance UI** — check its own docs site first for a shadcn-registry or MCP
   section (the ecosystem convention is common enough that it may have one even though
   it wasn't confirmed at the time this skill was written). If none exists, treat it
   like daisyUI's fallback: read its docs/any `llms.txt` it publishes directly, or fall
   through to `reverse-engineering-playbook`.

6. **No MCP exists, and none is expected to appear:**
   - **Animmaster Lib** (animmasterlib.dev) — a premium/PRO marketplace of WebGL+GSAP
     components sold as copy-paste code blocks, not a public registry. Treat as
     reference-only: read its public demo pages for the *pattern*, then reimplement
     using the discipline in `webgl-particle-canvas-kit`. Never assume you can "install"
     from it.
   - **particles.casberry.in** — not a component registry at all; it's a generative
     tool with an in-browser export panel (Vanilla JS / React / Three.js code, PLY/GLB/
     OBJ 3D exports, image/wallpaper exports). There is nothing to connect an MCP
     server *to* here. If the user wants this exact tool's output, the right move is
     to use its own embedded "AI Educational Simulator" prompt template (visible on
     the page) to generate a particle-behavior function, or to open the page and use
     its export panel directly — not to search for an MCP integration that doesn't
     exist for it.
   - **Awwwards showcase pages and individual portfolios** (e.g. sarahzaheer.site) —
     these are inspiration references, never installable component sources. Route to
     `reverse-engineering-playbook`.

## 3. What "connected" actually unlocks — and what it doesn't

An MCP connection gets you real source code, a real dependency list, and (for 21st) a
live preview — better than reconstructing a component from memory. It does **not**
replace Section 3 of `ui-component-decision-guide` (the consistency rules): a
component fetched via MCP still needs its colors/easing/motion budget brought in line
with the rest of the page. Installing via MCP is a research/fetch step, not a
finished, reviewed feature.

## 4. If nothing connects at all

If this environment can't run arbitrary CLI commands or add MCP servers (a locked-down
agent, a pure chat interface with no tool access), don't block the request. Fall back
immediately to the documented component knowledge in the matching sibling skill
(`componentry-smoothui-motion-kit`, `magicui-effects-kit`, `unlumen-vengeance-kit`,
`skiper-daisyui-foundation-kit`) and build the equivalent by hand, saying plainly that
you're doing so from documented patterns rather than a live fetch.
