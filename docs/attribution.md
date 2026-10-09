# Website attribution and CRM delivery

The Pages worker adds `/melo-attribution.js` to recognized site HTML. It is a small plain
script; Vue hydration remains off. A consent panel offers equally accessible allow/decline
choices and the footer reopens preferences. No Google tag loads before permission, or at
all until `GA4_MEASUREMENT_ID` is configured. Customer form values never enter analytics.

With permission, the site remembers first touch, the latest non-direct touch, and the
submission session. Internal browsing retains its acquisition session; 30 minutes of
inactivity starts a new one. Choices expire 90 days after they are made. Withdrawal clears
attribution and disables the configured GA tag.

Safari (and every iPhone browser) erases storage written by page scripts after 7 days without
a visit, so the choice and the first/last touches live in a `__Host-melo_measurement` cookie
that only the worker sets: the script posts them to `POST /api/measurement`, which validates
them like an intake and replies with `Set-Cookie`. Server-set cookies keep their full lifetime.
The script reads the cookie but never writes it, and posts only when the choice or a long-lived
touch changes. `localStorage` holds just the 30-minute session. Choices saved by the earlier
`localStorage`-only version move into the cookie on the next visit, keeping their original date. Without permission, only current-page source
and campaign tags accompany a submitted inquiry; ad click IDs and earlier touches are omitted.
Storage failures must not stop the form. Each domain has independent consent and history;
cross-device and cross-domain visitor matching are not implemented.

Sources are visitor-supplied evidence, not verified identities. URLs exclude query strings
and fragments; external referrers retain only their origin. Google click IDs establish
Google paid traffic; UTMs classify other campaigns. `fbclid` alone does not establish a paid
Facebook campaign. Use consistent `utm_source`, `utm_medium`, `utm_campaign` labels for partner,
social, email and QR links. Do not put customer names, emails or claim details in campaign tags.

## Delivery modes

Without `INTAKE_DB`, existing Pipedrive delivery continues, with structured attribution JSON
in the intake note. That legacy path does not guarantee deduplication or durable retries.

With `INTAKE_DB` and `INTAKE_OUTBOX_TOKEN`, the worker saves the validated inquiry to Cloudflare
D1 before showing success. The queue is the delivery destination; Pipedrive is not also written.
A browser-generated UUID deduplicates retries of the same form. Reusing that UUID with changed
answers returns 409. A new form/reload can create another inquiry; contact merging remains staff work.

`GET /api/intake-outbox` returns up to 50 pending intakes for the current site. Both reads and
`POST` acknowledgements require the private bearer token. The token is never sent to the browser.
Acknowledgements are site scoped and idempotent. The database retains delivered intake payloads;
browser retention does not delete CRM or queue records. Review operational retention separately.

MPC Agent's `pnpm mpc twenty intake` imports each inquiry as one new person, opportunity, note
and note link using stable UUIDs. It preserves staff edits, verifies the attribution identity,
and acknowledges only after CRM verification. Qualification, signing and collected-fee fields
are explicitly recorded by staff; opportunity stages do not prove those outcomes.

## Activate the queue

1. Deploy MPC20's independent `apps/website-attribution` app (`twenty apply --no-delete`).
2. Deploy MPC Agent's intake commands to its primary checkout and configure private source tokens.
3. Create a D1 database and run `migrations/0001_intake.sql`. Bind it as `INTAKE_DB` on each
   Pages project's **production** deployment, preserving existing settings and secrets.
4. Add `INTAKE_OUTBOX_TOKEN` to each project's production secrets (at least 32 random characters).
   Use separate tokens per site. Leave preview deployments on the legacy flow unless separately configured.
5. Deploy this website change. Exercise a clearly labelled test inquiry and check queue → Twenty → ack.
6. Enable the opt-in agent import after that check. Its existing hourly Twenty refresh can run it;
   leads remain queued while the Mac sleeps. See the agent's `docs/website-intake-attribution.md`.

Do not bind a live queue before the receiving importer and credentials are ready. Removing the
binding reverts new submissions to Pipedrive; drain existing pending queue records before retirement.
No changes to outbound calling or prepared-action publication are required.

## Google account setup later

Create a GA4 property and Google Ads account, then set the public `GA4_MEASUREMENT_ID` on each
Pages project and redeploy. Link GA4 and Ads, enable Ads auto-tagging, and mark `generate_lead`
as a key event. Only backend-saved inquiries receive the short-lived confirmation receipt;
ordinary thank-you visits/refreshes do not fire it. Browser delivery remains best effort, not
an exactly-once accounting ledger. Phone clicks are engagement, not verified phone calls.

MPC Agent's `report` produces local, stable-ID conversion rows from recorded outcomes; ad uploads
are off. No account IDs, API upload credentials, customer-data consent or signed-client conversion
actions are configured yet. Actual inbound phone attribution needs a separately selected provider.
