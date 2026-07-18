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
export-yourself flow. Fulfillment is manual for now: a request comes in via
the pricing CTAs or the contact email, and a human puts the list together.

## What's here

No build step, no framework, no dependencies — a static site you can open
directly or serve from anywhere:

- `index.html` — the GetMeBrands landing/request page
- `portfolio.html` — a separate, self-contained personal portfolio page (own
  fonts/colors, linked from GetMeBrands' nav and footer)
- `assets/css/style.css` — styling for `index.html`
- `assets/js/app.js` — the CSV upload/preview widget (upload section) and the
  pricing "I'm interested" buttons (mailto + clipboard fallback, since mailto
  alone silently does nothing without a default mail app configured)
- `assets/img/og-image.png` — Open Graph / Twitter Card preview image
- `CNAME` — GitHub Pages custom domain config for `getmebrands.com`

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
