# GetMeBrands

A brand-discovery tool for outreach teams: filter brands by niche and signal —
**actively running ads**, **social-first**, or **small/emerging** — build a
list, then export it as a plain CSV or a Bento-ready CSV.

**Live site (once DNS is configured):** [getmebrands.com](https://getmebrands.com)

## Status: demo dataset

This is a v1 working prototype. The brand explorer runs on **`assets/js/data.js`**,
a hand-written set of ~44 fictional sample brands across 8 niches. Every name,
contact, website and follower count in that file is made up — it exists so you
can try the full filter → select → export flow end to end before wiring up a
real data source.

To go live, replace `assets/js/data.js` with brands sourced from wherever you
want (a scraped/licensed ad-library feed, social APIs, manual research, a
spreadsheet export) — the app only expects an array of objects shaped like:

```js
{
  name: "Brand Name",
  niche: "Beauty & Skincare",
  size: "Small" | "Medium",
  adStatus: "Running" | "Not running",
  adPlatforms: ["Meta", "Google", "TikTok"],
  hasSocial: true,
  instagram: 8400,
  tiktok: 21000,
  website: "example.com",
  contactEmail: "hello@example.com",
  contactName: "Jane D.",
  location: "Austin, TX",
  tags: ["clean-beauty", "vegan"],
}
```

## What's here

No build step, no framework, no dependencies — a static site you can open
directly or serve from anywhere:

- `index.html` — landing page + the brand explorer UI
- `assets/css/style.css` — all styling
- `assets/js/data.js` — the sample brand dataset (swap this for real data)
- `assets/js/app.js` — filtering, list-building (saved to `localStorage`), and CSV/Bento export
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

## Exporting to Bento

The "Export for Bento" button downloads a minimal CSV with just three
columns: `email` (Bento's only auto-matched field), `brand_name`, and
`website`.

## Deployment

Deployed via **GitHub Pages** from the `main` branch, with the `CNAME` file
pointing the custom domain (`getmebrands.com`) at the GitHub Pages host. See
the DNS setup notes provided alongside this project for the exact records to
add at your registrar.
