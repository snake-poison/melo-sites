# Editing content

Edit only the intended site under `sites/<site>/content`. Run that site’s dev server
to preview, then run `pnpm check` and `pnpm test:site` before merging.

## Editing a page

Each page is Markdown with frontmatter, validated by `layers/melo/content.ts`:

```md
---
title: The h1, in the hero
metaTitle: The <title>, 10 to 100 characters
description: 50 to 160 characters. Search results show this under the title.
kicker: Optional, small text over the h1
lead: optional, under the h1
image:
  src: /images/photos/charlotte-brick-house-wraparound-porch.jpg   # use an existing photo from this site
  alt: A description of the house
date: 2020-02-17
updated: 2021-01-14
testimonial: true      # the how-it-works steps and client reviews band
claimForm: true        # the free claim review form, in the hero
claimTypes: true       # the four claim types, each linking to its page
services: true         # the adjuster services in the claim types' place (site.ts)
claimTypesIntro:       # optional; that block's own heading and intro on this page
  title: …
  text: One sentence with one [link](/insurance-claim-type/).
secondOpinion: true    # the "Get a Second Opinion" band
noindex: false         # true keeps the page out of search results and the sitemap
---
```

These examples use a Charlotte photo; choose a photo owned by the site you are editing.
Available body blocks live in `layers/melo/app/components/content`:

```md
::page-section{image="/images/photos/charlotte-brick-house-wraparound-porch.jpg" alt="A brick house with a wraparound porch" reverse}
## Heading
Text beside a photo.
::

::page-grid{cols="3"}
:::page-feature{title="Claim support" icon="carbon--money" to="/contact/"}
Text for a card.
:::
::

:page-cta{kind="review" label="Get a claim review"}

::page-quote{name="Client name"}
An approved client quotation.
::
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
updated: 2026-10-03          # optional; actual last revision date
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

Available post blocks are `::post-photo`, `::post-callout`, `::post-steps`,
`::post-checklist`, `::post-pullquote` and `::post-when`. Their props and examples live
in [the content components](../layers/melo/app/components/content/). Photos go in the site's `public/images/blog/<slug>/` as
JPEGs about 2000px wide; the build makes AVIF and WebP copies at the sizes the page needs.

**Scheduling.** A post dated after today (in North Carolina) is left out of the build like a
draft. CI rebuilds and deploys `main` every morning at 10:30 UTC, so a post goes live early on
the day it is dated. Scheduling requires a successful build and deployment; it is not an
exact-time publisher. To publish what is due right away, run the CI workflow by hand
on `main` from the Actions tab.

Posts are credited to the business. If individual author/reviewer attribution is needed,
add schema and template support alongside a verified editorial process.

## Content and URL safeguards

- Keep existing paths, `metaTitle` values and business name/address/phone unless the change is intentional. The WordPress URL/title fixtures in `test/fixtures/<site>/wordpress-pages.json` protect the migration baseline, not every historical plugin feature or asset.
- Use trailing slashes in internal links. `content/pages/index.md` is `/`; `content/pages/contact.md` is `/contact/`; a nested `index.md` represents that directory.
- Change schemas in `layers/melo/content.ts`; each site’s `content.config.ts` supplies its own category IDs. New categories also need entries in `site.ts`.
- Photos belong to the individual site. Keep source, author and licence in its `photo-credits.json`; use assets with verified public-domain or CC0 licences. Retain legacy `/wp-content/uploads/` files and `_redirects` where existing links depend on them.
- `draft: true` is a blog field. Drafts and future posts appear locally but must be absent from built routes, lists, sitemap and `llms.txt`. Page `noindex: true` hides a page from indexing and sitemap; it is still publicly accessible.
- Never name an author or licensed reviewer who has not actually written or reviewed the article. Posts currently credit the business.
