# WordPress feature assessment

This is a source audit of the Nuxt replacement, not an inventory of the old
WordPress plugins or settings. The migration fixtures establish URL/title parity;
they do not establish dashboard, integration, analytics or operational parity.
Check an old WordPress backup/admin export before deciding a formerly used feature
can be retired. No new product features are implemented by this cleanup.

## What the replacement covers

| Capability | Implementation and limits |
| --- | --- |
| Pages, posts and categories | Markdown collections in `layers/melo/content.ts`; content routes and category archives keep recorded WordPress paths. Categories are explicit in each `site.ts`; there are no tag or author archives. |
| SEO metadata | Frontmatter and page components render titles, descriptions, canonicals, social cards, structured data and noindex. Generated-site tests check the migration fixtures. Search ranking retention still needs Search Console monitoring. |
| Redirects and sitemaps | Per-site `public/_redirects`, generated sitemap, legacy sitemap index and HTML sitemap. Live redirect behavior depends on Pages and is not established by static HTML tests. |
| Images | Per-site assets and credits; Nuxt Image builds responsive AVIF/WebP. Assets have no browser media-library management. |
| Drafts and scheduled publishing | Dev shows drafts/future posts; builds exclude them. CI attempts publication daily at 10:30 UTC in the America/New_York calendar. Failed or delayed builds delay publication. |
| Lead capture and spam protection | Shared Pages worker, Turnstile and Pipedrive; only name and phone required. Structured attribution and optional details are retained. Form code is separate from the Nuxt runtime. |
| Content history | Git commits and PR review provide history and rollback, with repository access required. There is no editor autosave or WordPress revision UI. |

## Gaps worth addressing first

| Priority | Gap | Practical next step |
| --- | --- | --- |
| High | Intake failure visibility and recovery | The worker has timeouts and partial-write handling, but no durable submission queue, retry mechanism, idempotency key or staff failure alert. Add failure metrics/alerts first; design queued recovery and duplicate handling before automatic retries. Do not log sensitive intake bodies. Keep phone contact available during outages. |
| High | Conversion reporting | No analytics/tag-manager or conversion-event integration was found in the tracked app. CRM notes preserve some referrer/UTM data, but that is not traffic, call or abandonment reporting. Verify any Cloudflare/dashboard-side analytics, then define successful lead and phone-click metrics before adding a small integration. |
| High if staff edit | Browser editing, media uploads and editorial permissions | Editing currently requires Markdown and Git. WordPress has [roles/capabilities](https://wordpress.org/documentation/article/roles-and-capabilities/) and [revisions](https://wordpress.org/documentation/article/revisions/). Evaluate a Git-backed editor with draft preview, media support and PR approval if nontechnical staff publish regularly. Repository permissions are coarser than author/editor roles. |
| Medium | Post authorship and review records | Posts credit the business in `BlogPosting`; the schema has no individual author/reviewer fields. Add verified names, credentials and review dates when an actual editorial process exists. Do not manufacture review attribution. |
| Medium | Complete migration archive and recovery drill | Git holds current content and code, not the old plugin settings, comments, media database, production secrets or CRM records. Retain a WordPress database/media backup and [content export](https://wordpress.org/documentation/article/tools-export-screen/), record configuration securely, and test a restore/deploy. |

## Features to add only when needed

| WordPress capability | Replacement status | Decision |
| --- | --- | --- |
| RSS/Atom subscriptions | No feed route or feed generator found. WordPress provides [feeds](https://developer.wordpress.org/advanced-administration/wordpress/feeds/). | Check old feed subscribers/backlinks. Add a static feed using the same draft/date filters if needed; otherwise intentionally retire the endpoint. |
| On-site search | No search UI or index found. | Useful as the blog grows; use a build-time index and progressively enhanced search when readers need it. |
| Comments and moderation | No comments store or moderation UI found. | Usually optional for these service sites. Preserve any old discussion archive before removing it; add moderation capacity before enabling comments. |
| Tags, author/date archives and pagination | Category archives exist; the blog currently lists all published posts. No other archive routes or pagination found. | Preserve any previously indexed/archive URLs found in the old export or access logs. Add pagination when list size warrants it. |
| Form file attachments and email receipts | Intake accepts text fields; no claim-document upload or submission-receipt email was found. | Use a secure staff-managed document flow if required. Define access, retention and delivery behavior before adding uploads. Check CRM automations separately. |
| Reusable page-builder editing | MDC blocks and typed frontmatter provide reusable layouts; no visual drag-and-drop editor. | The current approach suits developer-managed content. A browser CMS should preserve these blocks instead of introducing a parallel rendering system. |
| Plugin integrations | No WordPress runtime or plugin system. | Audit old plugins for call tracking, CRM/email automation, consent controls, translations, redirects and embeds. Repository inspection cannot establish whether these existed or still run outside the app. |

## Before retiring WordPress permanently

1. Inventory the old plugins, users, comments, feeds and custom redirects from a backup or admin export.
2. Compare Search Console landing URLs and access-log 404s against the migration fixtures and deployed redirects.
3. Verify a minimal submission on each production hostname, its CRM source/owner and the staff notification process. Code tests mock Pipedrive and Turnstile.
4. Verify analytics and conversion reporting with the site owner, including dashboard-side services absent from this repository.
5. Confirm who will edit content and whether Git/PR publishing is workable for them.

The existing Nuxt layers are a good fit for sharing code between these three apps.
[Nuxt's layer guidance](https://nuxt.com/docs/4.x/guide/going-further/layers) supports
shared components/configuration and layer-relative paths. Keep site content and
identity separate; extracting more packages or collapsing the sites into one app
would add coordination without solving the editorial and operational gaps above.
