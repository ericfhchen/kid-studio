# Kid Studio — Shopify Theme

Custom Shopify theme for a children's book publisher. Pure CSS + vanilla JS, no build tools.

## Commands

- `shopify theme dev` — local dev server (`npm run watch`)
- `shopify theme push` — deploy (`npm run deploy`)

## Architecture

```
layout/theme.liquid     — Single layout; conditionally renders splash-page or main content
templates/              — index.liquid, cart.liquid (section-based routing)
sections/               — 12 Liquid sections (all markup, styles, and JS are self-contained)
assets/                 — application.css (global resets + utilities), application.js (shared cart/UI functions)
config/                 — settings_schema.json (theme settings), settings_data.json (current values)
locales/                — Translation strings
```

Sections are fully self-contained: each includes its own `<style>` and `<script>` blocks inline. `application.css` provides only resets, typography, utility classes, and iOS form fixes. `application.js` provides shared cart functions (addToCart, updateCartCount, quantity buttons).

## Key Sections by Size

| Section | Lines | Role |
|---|---|---|
| intro-text | 621 | Animated intro with cursor-tracking hover effects |
| spreads-gallery | 507 | Image gallery with preloading and navigation |
| cart-template | 468 | Full cart page with quantity controls and AJAX updates |
| product-grid | 426 | Product listing with add-to-cart and inline cart drawer |
| hero-video | 206 | Autoplaying hero video with multiple fallback strategies |
| splash-page | 130 | Password/splash gate (toggleable via theme settings) |

## Known Technical Debt

1. **Remaining `!important`** — A few instances remain where necessary: `intro-text.liquid` (responsive hover image sizing vs. inline JS), `product-grid.liquid` (Shopify rich text editor inline table styles), `product-hero.liquid` (responsive width vs. inline style), `theme.liquid` (splash page body lock).

2. **No lazy loading on some hero images** — Only spreads-gallery and product-grid use `loading="lazy"`.

## Conventions

- **No build step** — all CSS/JS is either in `application.css`/`application.js` or inline in sections. No Sass, no bundler.
- **Shopify Liquid** — use `{{ 'file' | asset_url }}` for assets, `{% section 'name' %}` for sections, `{% render 'snippet' %}` for snippets.
- **Font** — Panama Monospace (Bold) via `@font-face` with `font-display: swap`. Body uses Helvetica.
- **Cart** — AJAX-based via `/cart/add.js`, `/cart/update.js`, `/cart/change.js`, `/cart.js`. No full page reloads.
- **Metafields** — Products use `product.metafields.custom.book_cover_type` (check for blank before use).
- **Mobile** — 768px breakpoint for most responsive changes. Some sections use 480px for single-column.
