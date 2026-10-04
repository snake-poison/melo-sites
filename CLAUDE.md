# Melo websites

Two static Nuxt 4 + Nuxt Content sites on Cloudflare Pages, rebuilt from the old WordPress sites
on the Avow app's stack and design system (`~/Code/Avow`): `sites/charlotte`
(publicadjusterscharlotte.com, the local site) and `sites/national` (melopropertyclaimsadjusting.com).
Both are `layers/melo` with their own `site.ts`, content and public files. README.md has the
layout, the page and post formats and the commands.

## Rules

- `layers/ui` is copied from Avow byte for byte. Never edit it here: change Avow, then
  `pnpm ds:diff --sync`. Lint skips it.
- Shared code goes in `layers/melo` and reads a site's details from `#site` (its `site.ts`); a
  new export there goes in both sites' `site.ts`. Never import one site's files from the layer.
- The two sites are separate businesses to search engines: no copy, page or post is shared
  between them.
- Colour with the theme's names (`text-ink`, `bg-panel`, `border-rule-soft`); lint fails
  palette classes. Build pages from the layer's atoms (`UIText`, `UIHeading`, `UICard`, …).
- Pages ship no JS runtime (`routeRules` `noScripts`). Anything interactive must work as
  plain HTML or as part of `layers/melo/app/constants/themeScript.ts`. Do not turn the runtime
  back on for a route without saying why; `test/site/budget.spec.ts` will fail.
- Internal links end in a slash (`/blog/<slug>/`). NuxtLink appends it; write it in Markdown.
- Page and post frontmatter is validated by `layers/melo/content.ts`; extend the schema there.
- Search rankings carry over from WordPress: never change a page's URL, `metaTitle` or the
  business name, address and phone (`sites/<site>/site.ts`) without being asked.
  `test/fixtures/<site>/wordpress-pages.json` is each old site's URLs and titles.

## Git

- Branches: `feat|fix|chore|refactor|docs/<kebab-case>`. Commits: `type: imperative summary`.
- No AI attribution in commits or PRs.

## Checks

`pnpm lint --fix` · `pnpm typecheck` · `pnpm test:unit` · `pnpm test` (builds both sites)
