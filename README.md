# Melo Public Adjusters Charlotte

The website of Melo Public Adjusters Charlotte, at
[publicadjusterscharlotte.com](https://publicadjusterscharlotte.com). It replaces the old
WordPress site page for page: every URL, title, heading, photo and post the old site had is
here, at the same address. It is a static site built with Nuxt 4 and Nuxt Content, on the same
stack and design system as the [Avow app](https://github.com/snake-poison/Avow), served from
GitHub Pages.

## Keeping search rankings

The site was rebuilt to keep everything search engines had indexed. Changing any of these can
cost rankings, so do it on purpose:

- **URLs.** Every page is at the URL WordPress gave it, ending in a slash. A page's file
  under `content/pages/` is its URL: `content/pages/claims-adjuster/index.md` is
  `/claims-adjuster/`. Posts are `content/blog/<slug>.md` at `/blog/<slug>/`.
  `test/fixtures/wordpress-pages.json` lists every URL in the old sitemap, and
  `test/site/pages.spec.ts` fails if one stops being built.
- **Titles.** `metaTitle` in the frontmatter is the whole `<title>`, as Yoast had it. The test
  above checks each against the old site's.
- **Business details.** The name, address and phone in `app/constants/site.ts` match the
  Google Business Profile character for character. They feed the header, the footer and the
  `LocalBusiness` structured data on every page.
- **Photos** stay at their WordPress paths (`public/wp-content/uploads/...`), so image search
  and old links keep working.

## Editing a page

Each page is Markdown with frontmatter, validated by `content.config.ts`:

```md
---
title: The h1, in the hero
metaTitle: The <title>, 10 to 70 characters
description: 50 to 160 characters. Search results show this under the title.
kicker: optional, small text over the h1
lead: optional, under the h1
image:
  src: /wp-content/uploads/2020/02/Header-15.jpg   # the hero's background photo
date: 2020-02-17
updated: 2021-01-14
testimonial: true      # a client review beside the claim form
claimForm: true        # the free claims review block
claimTypes: true       # the four claim types, each linking to its page
claimTypesIntro:       # optional; that block's own heading and intro on this page
  title: …
  text: One sentence with one [link](/insurance-claim-type/).
secondOpinion: true    # the "Get a Second Opinion" band
noindex: false         # true keeps the page out of search results and the sitemap
---
```

Blocks for the body, from `app/components/content`:

```md
::page-section{image="/wp-content/uploads/…jpg" alt="…" reverse}   text beside a photo
## Heading
Text.
::

::page-grid{cols="3"}                                  cards in columns
:::page-feature{title="…" icon="carbon--money" to="/…/"}
Text.
:::
::

:page-cta{kind="call" label="Call (704) 286-0707"}     a button: call, or "review" for the form
::page-quote{name="…" source="Google"}                 a client review with five stars
```

An icon is any [Carbon](https://icones.js.org/collection/carbon) icon listed in the
`@source inline` line of `app/assets/css/main.css`; add new ones there.

## Writing a post

Add `content/blog/<slug>.md`. It is published at `/blog/<slug>/`.

```md
---
title: The h1
metaTitle: The <title>
description: 50 to 160 characters.
date: 2026-10-02             # the day it goes live; a future date schedules it
updated: 2026-11-01          # optional
category: insurance-adjusters   # or local-news-activities, things-to-do
image:
  src: /images/blog/<slug>/lead.jpg
  alt: What the photo shows, for someone who cannot see it.
summary: optional; the answer in two or three plain sentences, shown first.
faq:                         # optional; a FAQ section and schema.org FAQPage
  - question: …
    answer: …
draft: true                  # shown in `pnpm dev`, never built
---
```

The post blocks (`::post-photo`, `::post-callout`, `::post-steps`, `::post-checklist`,
`::post-pullquote`) work as in the Avow blog. Photos go in `public/images/blog/<slug>/` as
JPEGs about 2000px wide; the build makes AVIF and WebP copies at the sizes the page needs.

**Scheduling.** A post dated after today (in North Carolina) is left out of the build like a
draft. CI rebuilds and deploys `main` every morning at 10:30 UTC, so a post goes live early on
the day it is dated. To publish what is due right away, run the CI workflow by hand from the
Actions tab.

Posts are credited to the business. Insurance is a "Your Money or Your Life" topic, so naming
the licensed adjuster who wrote or reviewed a post would help search engines trust it.

## The claim form

The site is static, so the free claims review form posts to a form service, which emails the
lead and sends the visitor on to `/thank-you-page/`. Until one is set up, the block shows
the phone and email buttons instead of the form.

To turn it on, sign up with a form service (Web3Forms, Formspree or Basin all work without
JavaScript), then fill in `claimForm` in `app/constants/site.ts`: `action` is the URL the
service gives you, and `hidden` holds any fields it needs with every submission, such as an
access key and a redirect to `https://publicadjusterscharlotte.com/thank-you-page/`.

## Commands

```sh
pnpm dev          # http://localhost:3000, drafts included
pnpm generate     # the static site in .output/public
pnpm preview      # serve that build
pnpm lint --fix
pnpm typecheck
pnpm test:unit    # fast
pnpm test         # unit, then builds the site and checks it (pnpm test:site)
pnpm ds:diff      # compare the design system with ~/Code/Avow
```

## How it is built

- **Static, with no JS runtime.** Every route is prerendered HTML with its CSS inlined, and
  ships no Nuxt runtime (`routeRules` in `nuxt.config.ts`). The only script is the theme's
  (`app/constants/themeScript.ts`). `test/site/budget.spec.ts` holds each page to two round
  trips on a fresh connection, with no script or stylesheet requests.
- **SEO.** Canonical URLs, Open Graph and Twitter tags, a generated share image per page
  (`components/OgImage`), schema.org (`LocalBusiness` with address, hours and service area,
  `WebPage`, `BlogPosting`, `BreadcrumbList`, `FAQPage`), `sitemap.xml` (and
  `sitemap_index.xml`, the address Yoast used, pointing to it), `robots.txt` and `llms.txt`.
  The category archives and the thank-you page are kept out of search, as they were.
- **Design system.** `layers/ui` is Avow's tokens, fonts and atoms, kept byte for byte.
  `app/assets/css/brand.css` sets its faces and colours to Melo's: Roboto and PT Sans, charcoal and cyan.
- **URLs end in a slash**: each page is `index.html` in its own directory, which is how GitHub
  Pages serves without a redirect.

## Project layout

```
app/
  pages/           [...slug].vue renders content/pages; blog/ the posts and categories
  components/      molecules and organisms built from the layer's atoms; content/ for Markdown blocks
  constants/       the business, menus, claim types and categories (site.ts), the theme script
  utils/           post queries, formatting, reading time
  assets/css/      the Tailwind entry, brand colours, Markdown body styles
components/OgImage the share card
content/
  pages/           every page but the blog, at its WordPress URL
  blog/            posts
public/
  wp-content/uploads/   photos, at their WordPress paths
  images/brand/    the logo
layers/ui/         Avow's design system
test/
  unit/            pure functions
  site/            the built site
  fixtures/        the old site's URLs and titles; a draft and a scheduled post the test build adds
```

## Going live

Pushing to `main` runs `.github/workflows/ci.yml`: lint, typecheck, tests, the build and its
checks, then a deploy to GitHub Pages. In the repository settings, set Pages > Source to
"GitHub Actions", and Pages > Custom domain to `publicadjusterscharlotte.com` (`public/CNAME`
holds it too), with Enforce HTTPS on once the certificate is issued.

DNS moves the domain from WordPress to GitHub Pages. At the domain's DNS host:

- `A` records for the apex: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
  `185.199.111.153` (and `AAAA` `2606:50c0:8000::153` to `8003::153` for IPv6).
- A `CNAME` record from `www` to `<github-user>.github.io`.

Then, in Google Search Console, submit `https://publicadjusterscharlotte.com/sitemap.xml` and
use URL Inspection on the home page and a few service pages. Keep the WordPress host running
for a few days after the switch in case anything needs to be compared.

After each deploy, `scripts/indexnow.mjs` sends IndexNow (Bing, Yandex, Seznam and others) the
pages that are new or have a newer `lastmod` than the sitemap that was live before. The key is
`public/<key>.txt`, a file holding its own name. To resend every page, run
`pnpm generate && node scripts/indexnow.mjs --all`. Google does not use IndexNow; it reads the
sitemap.
