# Deployment and claim intake

## Claim intake

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
The browser supplies bounded attribution to the worker; cached forms fall back to the same-origin
referrer. Earlier touches and ad click IDs require measurement consent. These tracking values are
visitor supplied; the website source and legacy Pipedrive owner are server controlled. See
[attribution and Twenty delivery](attribution.md) for the consent panel, optional durable queue and rollout.

Pipedrive's existing Insurance Company field links to a person. Only one exact name match with
the INSURANCE label is linked automatically. The new Insurance Company (intake) text field always
preserves the entered carrier name. Foremost Insurance resolves to the existing Foremost Insurance Group contact. An unmatched or ambiguous carrier can be resolved by the team.

Same-origin checks, bounded input and managed Turnstile protect the endpoint. Details are also
preserved in a note, and successful saves redirect to `/thank-you-page/`. This gathers the data for
contract preparation; it does not prepare or send a contract, or assign a commission.

The local Nuxt dev server and static preview do not execute the Pages worker or inject
the Turnstile widget. Test the complete form on a configured Cloudflare deployment.
`test/unit/claim-intake.spec.ts` mocks the external APIs; passing it does not confirm
production credentials, CRM delivery or live CAPTCHA behavior.

## Configuration

| Setting | Where | Purpose |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | GitHub Actions secret | Deploy permission: Cloudflare Pages Edit |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions secret | Account containing the three projects |
| `PIPEDRIVE_API_TOKEN` | Each Pages project | Server-side CRM writes |
| `TURNSTILE_SECRET_KEY` | Each Pages project | Server-side CAPTCHA verification |
| `TURNSTILE_SITE_KEY` | Each Pages project | Public widget key injected into HTML |
| `GA4_MEASUREMENT_ID` | Each Pages project, optional | Public GA4 ID; tags load only after consent |
| `INTAKE_DB` | Each Pages project, opt-in D1 binding | Durable intake outbox instead of Pipedrive delivery |
| `INTAKE_OUTBOX_TOKEN` | Each Pages project, private secret | Authenticated agent import; required with D1 |
| `NUXT_SITE_URL` | Optional build environment | Override canonical origin for a build |
| `NUXT_APP_BASE_URL` | Optional build environment | Override the app’s base path |

Never put tokens in Markdown, `site.ts`, public assets or committed env files.
The Turnstile site key is public; the API token and CAPTCHA secret are private.

## Deployment

[CI](../.github/workflows/ci.yml) runs on pull requests, pushes to `main`, manual
runs and daily at 10:30 UTC. It installs the lockfile, lints, typechecks, runs
unit tests and builds/tests all three sites on separate runners in parallel.
Generated IPX image variants are reused from each site's `.image-cache`. Every
entry is checked against the source photo, encoder settings and encoded bytes;
changed or missing images are regenerated. HTML, share cards and all site tests
still run on every build. Actions restores the cache or seeds it from the last
successful `main` artifact. With neither available, the build encodes everything
normally, which takes longer. The daily cache key lets scheduled publications
save newly generated variants. Delete `.image-cache` to force a full image rebuild.
Deployment waits for every site to pass. Only `main` deploys. The deploy job
uploads the exact tested artifacts to these Direct Upload Pages projects:

| Site | Pages project |
| --- | --- |
| Charlotte | `publicadjusterscharlotte` |
| National | `melopropertyclaimsadjusting` |
| Atlanta | `publicadjustersofatlanta` |

Missing GitHub Cloudflare secrets skips deployment with a warning. Passing CI
alone therefore does not establish that a site deployed. Check all three deploy
jobs and production URLs after a merge. A manual run on `main` can publish a due
post or redeploy; a manual run on another branch cannot deploy.

For a new project, create the Direct Upload Pages project in Cloudflare, configure
the environment values above, deploy, and test its `pages.dev` hostname before
adding the canonical domain and `www`. Preserve MX, SPF and DKIM records when
changing DNS. Keep the old WordPress backup available for migration comparisons.

After a deploy, inspect the home page, a service page, a post, the thank-you page,
`/sitemap.xml`, `/robots.txt` and the form. A CRM delivery test creates real records;
coordinate it with staff and remove only the test records. Submit `/sitemap.xml`
in Search Console. The legacy `/sitemap_index.xml` address remains supported.

`scripts/indexnow.mjs` compares the previous live sitemap with the build and submits
new or updated URLs. A failed IndexNow ping does not undo deployment. To resend
all published URLs: `pnpm generate:<site>` then
`node scripts/indexnow.mjs <site> --all`. Google uses the sitemap, not IndexNow.

## Failures and rollback

- Build failure: inspect the first failed CI step; deployment depends on all checks passing.
- Form failure: verify Pages secrets, allowed Turnstile hostnames, CRM access and worker logs. The legacy Pipedrive path uses bounded requests and handles partial writes but has no durable retry queue. The opt-in D1 path preserves pending inquiries for Twenty import and deduplicates same-form retries; monitor importer errors and queue backlog. Neither path supplies automatic staff notifications.
- Bad release: revert the offending commit on `main` and let CI rebuild/deploy. For an urgent incident, restore a previous production deployment in Cloudflare, then reconcile `main` before its next scheduled deploy. Rollback does not undo CRM records or configuration changes.
