# Melo websites

Three websites from one codebase, all static Nuxt 4 + Nuxt Content sites on the same stack and
design system as the [Avow app](https://github.com/snake-poison/Avow), served by Cloudflare Pages:

| Site | Directory | Old WordPress site |
|---|---|---|
| Melo Public Adjusters Charlotte, the local site | `sites/charlotte` | [publicadjusterscharlotte.com](https://publicadjusterscharlotte.com) |
| Melo Property Claims, the national site | `sites/national` | [melopropertyclaimsadjusting.com](https://melopropertyclaimsadjusting.com) |
| Melo Public Adjusters Atlanta, the Atlanta local site | `sites/atlanta` | [publicadjustersofatlanta.com](https://publicadjustersofatlanta.com) |

Each replaces its WordPress site page for page: every URL, title, heading, photo and post the
old site had is there, at the same address. The three share their code (`layers/melo`) and
nothing else: each has its own business details, menus, pages, posts and photos.

## Keeping search rankings

The site was rebuilt to keep everything search engines had indexed. Changing any of these can
cost rankings, so do it on purpose:

- **URLs.** Every page is at the URL WordPress gave it, ending in a slash. A page's file
  under the site's `content/pages/` is its URL: `sites/charlotte/content/pages/claims-adjuster/index.md`
  is `/claims-adjuster/`. Posts are `content/blog/<slug>.md` at `/blog/<slug>/`.
  `test/fixtures/<site>/wordpress-pages.json` lists every URL in the old sitemap, and
  `test/site/pages.spec.ts` fails if one stops being built. Old URLs WordPress redirected are
  in the site's `public/_redirects`.
- **Titles.** `metaTitle` in the frontmatter is the whole `<title>`, as Yoast had it. The test
  above checks each against the old site's.
- **Business details.** The name, address and phone in the site's `site.ts` match the
  Google Business Profile character for character. They feed the header, the footer and the
  `LocalBusiness` structured data on every page.
- **Photos** stay at their WordPress paths (`sites/<site>/public/wp-content/uploads/...`), so image search
  and old links keep working.

## Editing a page

Each page is Markdown with frontmatter, validated by `layers/melo/content.ts`:

```md
---
title: The h1, in the hero
metaTitle: The <title>, 10 to 100 characters
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
services: true         # the adjuster services in the claim types' place (site.ts)
claimTypesIntro:       # optional; that block's own heading and intro on this page
  title: …
  text: One sentence with one [link](/insurance-claim-type/).
secondOpinion: true    # the "Get a Second Opinion" band
noindex: false         # true keeps the page out of search results and the sitemap
---
```

Blocks for the body, from `layers/melo/app/components/content`:

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
`@source inline` line of `layers/melo/app/assets/css/main.css`; add new ones there.

## Writing a post

Add `sites/<site>/content/blog/<slug>.md`. It is published at `/blog/<slug>/` on that site.

```md
---
title: The h1
metaTitle: The <title>
description: 50 to 160 characters.
date: 2026-10-02             # the day it goes live; a future date schedules it
updated: 2026-11-01          # optional
category: insurance-adjusters   # one of the site's categoryIds (site.ts)
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
`::post-pullquote`) work as in the Avow blog. Photos go in the site's `public/images/blog/<slug>/` as
JPEGs about 2000px wide; the build makes AVIF and WebP copies at the sizes the page needs.

**Scheduling.** A post dated after today (in North Carolina) is left out of the build like a
draft. CI rebuilds and deploys `main` every morning at 10:30 UTC, so a post goes live early on
the day it is dated. To publish what is due right away, run the CI workflow by hand from the
Actions tab.

Posts are credited to the business. Insurance is a "Your Money or Your Life" topic, so naming
the licensed adjuster who wrote or reviewed a post would help search engines trust it.

## The claim form

All three sites post their compact HTML form to `/api/claim-review`. The shared Pages worker
in `layers/melo/public/_worker.js` is included by `meloSite()` in every generated site.
Each Pages project needs `PIPEDRIVE_API_TOKEN`, `TURNSTILE_SECRET_KEY`, and `TURNSTILE_SITE_KEY`
as production secrets. Its Turnstile widget must allow the project's `pages.dev` hostname and
its canonical domain (with and without `www`). Never commit secret values.

The initial form requires only name and phone. Email and a short description are optional.
An initially collapsed section offers optional insured property address, carrier name, policy
number, claim number, date and cause of loss. Unanswered CRM fields stay unset, and the team
collects any missing contract details during follow-up. Older first/last-name form submissions
remain supported during deployment. It creates a person and lead owned by Ramon,
and maps insurance/loss details into the existing Pipedrive custom fields. Commission Percent is
intentionally left unset for team review. Existing contacts are never overwritten by this public
form. Each submission gets its own policyholder contact and claim lead; the team can merge repeat
contacts after reviewing the claim.

The server derives source from the request hostname: `Website: Charlotte`, `Website: Atlanta`,
or `Website: Melo Property Claims` lead labels, the Web forms marketing channel, and a structured
Website source field. Charlotte/Atlanta use Lead Gen Site; the national site uses MPC Website.
The same-origin referrer supplies the structured Website landing page and any UTM/click IDs in
the note. These tracking values are visitor supplied; the website source and owner are server controlled.

Pipedrive's existing Insurance Company field links to a person. Only one exact name match with
the INSURANCE label is linked automatically. The new Insurance Company (intake) text field always
preserves the entered carrier name. Foremost Insurance resolves to the existing Foremost Insurance Group contact. An unmatched or ambiguous carrier can be resolved by the team.

Same-origin checks, bounded input and managed Turnstile protect the endpoint. Details are also
preserved in a note, and successful saves redirect to `/thank-you-page/`. This gathers the data for
contract preparation; it does not prepare or send a contract, or assign a commission.

## Commands

```sh
pnpm dev                 # Charlotte at http://localhost:3000, drafts included
pnpm dev:national        # the national site (dev:atlanta for Atlanta)
pnpm generate            # every static site, in sites/<site>/.output/public
pnpm generate:charlotte  # or one (generate:national, generate:atlanta)
pnpm preview             # serve Charlotte's build (preview:national, preview:atlanta)
pnpm lint --fix
pnpm typecheck
pnpm test:unit           # fast
pnpm test                # unit, then builds each site and checks it (pnpm test:site)
pnpm ds:diff             # compare the design system with ~/Code/Avow
```

## How it is built

- **One layer, three sites.** `layers/melo` is the whole site: pages, components, styles and
  config. Each `sites/<site>/nuxt.config.ts` extends it and says which business it is with
  `meloSite()` (`layers/melo/site-config.ts`), from its `site.ts`. The layer's code reads the
  site's details by importing `#site`, which each build points at its own `site.ts`. Content,
  photos and the favicon are the site's own, in `sites/<site>/content` and `sites/<site>/public`.
- **Static, with no JS runtime.** Every route is prerendered HTML with its CSS inlined, and
  ships no Nuxt runtime (`routeRules` in `layers/melo/nuxt.config.ts`). The only script is the
  theme's (`layers/melo/app/constants/themeScript.ts`). `test/site/budget.spec.ts` holds each
  page to two round trips on a fresh connection, with no script or stylesheet requests.
- **SEO.** Canonical URLs, Open Graph and Twitter tags, a generated share image per page
  (`layers/melo/components/OgImage`), schema.org (`LocalBusiness` with address, hours and
  service area, `WebPage`, `BlogPosting`, `BreadcrumbList`, `FAQPage`), `sitemap.xml` (and
  `sitemap_index.xml`, the address Yoast used, pointing to it), `robots.txt` and `llms.txt`.
  The category archives and the thank-you page are kept out of search, as they were.
- **Design system.** `layers/ui` is Avow's tokens, fonts and atoms, kept byte for byte.
  `layers/melo/app/assets/css/brand.css` sets its faces and colours to Melo's: Roboto and PT
  Sans, charcoal and cyan.
- **URLs end in a slash**: each page is `index.html` in its own directory, which is how
  Cloudflare Pages serves without a redirect.

## Project layout

```
layers/
  ui/                   Avow's design system
  melo/                 everything the sites share
    nuxt.config.ts      modules, routes, styles; site-config.ts adds a site's identity
    content.ts          the page and post schemas
    app/
      pages/            [...slug].vue renders content/pages; blog/ the posts and categories
      components/       molecules and organisms built from the layer's atoms; content/ for Markdown blocks
      constants/        the theme script
      utils/            post queries, formatting, reading time
      assets/css/       the Tailwind entry, brand colours, Markdown body styles
    components/OgImage  the share card
    public/fonts        the brand's web fonts
sites/
  charlotte/, national/, atlanta/
    site.ts             the business, menus, claim types, categories and page texts
    nuxt.config.ts      the layer, plus meloSite()
    content/pages/      every page but the blog, at its WordPress URL
    content/blog/       posts
    public/             photos at their WordPress paths, the logo, favicons, the IndexNow key
test/
  unit/                 pure functions
  site/                 a built site (run once per site)
  fixtures/             each old site's URLs and titles; a draft and a scheduled post the test build adds
```

## Going live

Pushing to `main` runs `.github/workflows/ci.yml`: lint, typecheck, tests, every build and its
checks, then a deploy of each build to its own Cloudflare Pages project. Until the two secrets
below are set, the deploy is skipped with a warning. Once, in Cloudflare:

1. **Workers & Pages > Create > Pages > Upload assets**: create a project named
   `publicadjusterscharlotte`, one named `melopropertyclaimsadjusting` and one named
   `publicadjustersofatlanta` (the names the workflow deploys to). Upload anything to finish creating them; CI replaces it.
2. **My Profile > API Tokens**: create a token with *Account > Cloudflare Pages > Edit*. In the
   GitHub repository's *Settings > Secrets and variables > Actions*, add it as
   `CLOUDFLARE_API_TOKEN`, and the account ID (on the Workers & Pages overview) as
   `CLOUDFLARE_ACCOUNT_ID`.
3. Push to `main`, or run the workflow by hand, and check each `*.pages.dev` address.
4. In each project, **Custom domains**: add the domain and `www`. A bare domain needs its DNS
   on Cloudflare: add the domain to the account first (*Add a domain*, free plan) and change its
   nameservers at the registrar to the two Cloudflare gives. Copy over any email (MX, SPF, DKIM)
   records before switching. This is the step that takes the domain from WordPress.

Then, in Google Search Console, submit each site's `/sitemap.xml` and use URL Inspection on the
home page and a few service pages. Keep the WordPress hosts running for a few days after the
switch in case anything needs to be compared.

After each deploy, `scripts/indexnow.mjs` sends IndexNow (Bing, Yandex, Seznam and others) the
pages that are new or have a newer `lastmod` than the sitemap that was live before. A site's key
is `sites/<site>/public/<key>.txt`, a file holding its own name. To resend every page, run
`pnpm generate:<site> && node scripts/indexnow.mjs <site> --all`. Google does not use IndexNow;
it reads the sitemap.
