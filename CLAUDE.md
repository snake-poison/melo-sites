# Melo Public Adjusters Charlotte

publicadjusterscharlotte.com: a static Nuxt 4 + Nuxt Content site on GitHub Pages, rebuilt from
the old WordPress site on the Avow app's stack and design system (`~/Code/Avow`). README.md has
the layout, the page and post formats and the commands.

## Rules

- `layers/ui` is copied from Avow byte for byte. Never edit it here: change Avow, then
  `pnpm ds:diff --sync`. Lint skips it.
- Colour with the theme's names (`text-ink`, `bg-panel`, `border-rule-soft`); lint fails
  palette classes. Build pages from the layer's atoms (`UIText`, `UIHeading`, `UICard`, …).
- Pages ship no JS runtime (`routeRules` `noScripts`). Anything interactive must work as
  plain HTML or as part of `app/constants/themeScript.ts`. Do not turn the runtime back on
  for a route without saying why; `test/site/budget.spec.ts` will fail.
- Internal links end in a slash (`/blog/<slug>/`). NuxtLink appends it; write it in Markdown.
- Page and post frontmatter is validated by `content.config.ts`; extend the schema there.
- Search rankings carry over from WordPress: never change a page's URL, `metaTitle` or the
  business name, address and phone (`app/constants/site.ts`) without being asked.
  `test/fixtures/wordpress-pages.json` is the old site's URLs and titles.

## Git

- Branches: `feat|fix|chore|refactor|docs/<kebab-case>`. Commits: `type: imperative summary`.
- No AI attribution in commits or PRs.

## Checks

`pnpm lint --fix` · `pnpm typecheck` · `pnpm test:unit` · `pnpm test` (builds the site)
