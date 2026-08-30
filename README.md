# GetMeBrands

A request-based service for creators: find brands with real social proof —
brands already engaging with creators, and brands whose own site shows
they're set up for it. Tell us your niche, we send back a human-verified
list: brand name, niche, location, why it's worth pitching, and a LinkedIn
contact.

**Live site (once DNS is configured):** [getmebrands.com](https://getmebrands.com)

## Status

This is a marketing/request site, not a live database tool. The "Sample
list" section on the page is a small hardcoded prototype (5 rows) showing
what a real request comes back looking like — there's no filtering or
export-yourself flow. All pricing CTAs link out to **Bento Marketplace**
(onbento.com/marketplace) rather than a direct-contact flow, per Bento's
policy against directing marketplace buyers off-platform.

## What's here

No build step, no framework, no dependencies, no JS — a fully static site
you can open directly or serve from anywhere:

- `index.html` — the GetMeBrands landing/request page
- `portfolio.html` — a separate, self-contained personal portfolio page (own
  fonts/colors). Intentionally **not linked** anywhere on the GetMeBrands
  site and marked `noindex, nofollow` — reachable only by whoever has the
  direct URL (`getmebrands.com/portfolio.html`). Also links out to Bento
  Marketplace rather than a direct-contact flow, for the same reason.
- `l.html` — a private, self-contained curated brand list built for one
  creator. Same pattern as `portfolio.html`: intentionally **not linked**
  anywhere on the site, not in `sitemap.xml`, and marked `noindex, nofollow`
  — reachable only by whoever has the direct URL
  (`getmebrands.com/l.html`). This is obscurity, not access control — see
  the note below before treating it as private.
- `assets/css/style.css` — styling for `index.html`
- `assets/img/og-image.png` — Open Graph / Twitter Card preview image
- `robots.txt` / `sitemap.xml` — basic SEO/crawling config
- `CNAME` — GitHub Pages custom domain config for `getmebrands.com`

## Unlisted pages ("hidden" pages)

`portfolio.html` and `l.html` are **unlisted, not access-controlled**.
This is a static site with no backend, login, or auth of any kind, so
"hidden" here means: not linked from `index.html`, not in `sitemap.xml`,
and marked `noindex, nofollow` so search engines won't crawl or list it.
Anyone who has the exact URL — because it was shared with them, guessed,
found in server logs/analytics, or found via a browser history/cache — can
open it; there's nothing on the page or server enforcing that only one
person can view it. Treat the URL itself as the secret, the same way you'd
treat an unlisted Google Doc link, and don't share it anywhere public. If
real per-person access control is ever needed (e.g. a password gate or
login), that requires adding server-side logic GitHub Pages alone can't do.

## SEO

`index.html` carries Organization/Service/FAQPage JSON-LD structured data,
Open Graph/Twitter Card tags, and a canonical URL. Getting indexed and
ranking for competitive terms still takes time (weeks to months) and depends
on backlinks and ongoing content — none of that is instant just from adding
meta tags.

## Running locally

```bash
open index.html
```

or serve it so you're on a real URL instead of `file://`:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

Deployed via **GitHub Pages** from the `main` branch, with the `CNAME` file
pointing the custom domain (`getmebrands.com`) at the GitHub Pages host. See
the DNS setup notes provided alongside this project for the exact records to
add at your registrar.
