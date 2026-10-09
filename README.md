# Melo websites

Three independent public-adjusting websites built with **Nuxt 4, Nuxt Content and
Cloudflare Pages**. They share application code and a design system; each site
owns its business details, Markdown content and public assets.

| Site | App directory | Domain |
| --- | --- | --- |
| Charlotte | `sites/charlotte` | [publicadjusterscharlotte.com](https://publicadjusterscharlotte.com) |
| National | `sites/national` | [melopropertyclaimsadjusting.com](https://melopropertyclaimsadjusting.com) |
| Atlanta | `sites/atlanta` | [publicadjustersofatlanta.com](https://publicadjustersofatlanta.com) |

The WordPress migration retains the URLs and titles recorded in the migration
fixtures. It does not reproduce the WordPress dashboard or every plugin feature.
See the [WordPress feature assessment](docs/wordpress-parity.md) for gaps and priorities.

## Start locally

Use **Node 24** (`.node-version`) and **pnpm 12.5.1** (`packageManager` in `package.json`).
Install pnpm if needed, then:

```sh
pnpm install --frozen-lockfile  # also prepares all three Nuxt apps
pnpm dev                      # Charlotte; localhost:3000 by default
pnpm dev:national             # national site
pnpm dev:atlanta               # Atlanta
```

Run one dev server at a time to use the default port. Development includes draft
and future-dated posts. The Cloudflare claim endpoint and CAPTCHA injection need
a configured Pages deployment; local static preview does not provide them.

## Common tasks

| Task | Command or location |
| --- | --- |
| Edit page or post | `sites/<site>/content/`; [content guide](docs/content.md) |
| Change business details, navigation or categories | `sites/<site>/site.ts` |
| Change shared presentation | `layers/melo/app/` |
| Lint, typecheck and unit tests | `pnpm check` (stops on failure; does not fix files) |
| Apply lint fixes | `pnpm lint --fix` |
| Build and test all sites | `pnpm test:site` |
| Run all tests | `pnpm test` |
| Generate production output | `pnpm generate` or `pnpm generate:<site>` |
| Serve generated output | `pnpm preview`, `pnpm preview:national`, `pnpm preview:atlanta` |
| Compare shared UI against Avow | `pnpm ds:diff` (`AVOW_DIR` overrides `~/Code/Avow`) |
| List untracked/ignored cleanup candidates | `pnpm clean:dry-run` (deletes nothing) |

Generated files live in `sites/<site>/.output/public`; `.nuxt`, `.output`, `.data`
and `node_modules` are ignored build/dependency directories. Do not edit generated
files. Before merging, run `pnpm check` and `pnpm test:site`.

## Where things belong

```text
layers/
  ui/                       Avow design system; sync from upstream, do not fork here
  melo/
    nuxt.config.ts          shared modules, styles and static build configuration
    site-config.ts          site identity, #site alias and prerender routes
    content.ts              shared page/post schemas
    app/
      pages/                content pages, blog routes and HTML sitemap
      layouts/              shared site shell
      components/           site, claim and blog components
        content/            globally registered Markdown/MDC blocks
      composables/          shared reactive helpers and claim-form injection key
      utils/                post queries, dates, formatting and reading time
      assets/css/           brand, prose and form styles
    components/OgImage/     build-time share cards
    public/                 shared fonts and Cloudflare _worker.js
    server/plugins/         prerender output processing
sites/<site>/
  nuxt.config.ts            extends the Melo layer and supplies site identity
  content.config.ts         supplies the site's categories to the shared schemas
  site.ts                   business details, navigation and presentation copy
  content/pages/, blog/     site-owned Markdown
  public/                   site-owned images, redirects, icons and OG fonts
  photo-credits.json        photo provenance and licences
scripts/                    UI comparison and IndexNow submission
test/unit/                  utilities and mocked worker behavior
test/site/                  generated HTML, SEO, URLs, drafts and page budgets
test/fixtures/              WordPress URL/title baselines and publication fixtures
docs/                       content, operations and migration feature assessment
```

Each app explicitly extends `layers/melo`, which extends `layers/ui`. Shared code
imports business data through `#site`; it must not import a particular site's
files. Keep the small per-site Nuxt and Content entry points: they establish each
app's root, assets and category schema. This follows [Nuxt's layer model](https://nuxt.com/docs/4.x/guide/going-further/layers).

Pages are prerendered HTML with inline CSS and no Vue/Nuxt client runtime.
The inline theme script provides dark-mode controls; Cloudflare adds the
Turnstile loader to form pages. Interactive Vue code will need an explicit
change to the `noScripts` route rules and performance checks.

The shared SEO setup supplies canonical URLs, social tags, share images,
structured data, sitemap, robots and `llms.txt`. Site tests protect the recorded
WordPress paths/titles, internal links, publication exclusions and page budgets;
they do not verify live DNS, credentials, search rankings or CRM delivery.

## Further guidance

- [Content editing, frontmatter, photos and scheduling](docs/content.md)
- [Deployment, environment settings, claim intake and rollback](docs/operations.md)
- [Consent, campaign attribution and durable Twenty intake](docs/attribution.md)
- [WordPress parity and recommended follow-up work](docs/wordpress-parity.md)
- [Repository conventions](CLAUDE.md)
- [Upstream UI sync rules](layers/ui/README.md) — upstream notes refer to a root app;
  this repository's sites extend the layers explicitly and keep OG fonts per site.
