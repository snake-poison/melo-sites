# Property Claims Consulting

Property Claims Consulting website for propertyclaimsconsulting.net, offering insurance appraisal,
umpire services, claims consulting, and expert witness support in North Carolina.

The app extends the unchanged UI layer. It uses Melo’s Roboto/PT Sans typography,
rounded service cards, a mobile navigation disclosure, and a structured footer.
The palette and motifs come from the logo (`public/logo-mark.svg`, also the
favicon): its navy field, the metallic streak of its gradient (`--pcc-sheen`) on
dark surfaces, and the 40° slant of its stroke in eyebrows and the hero. The consulting practice
has its own shell so public-adjusting advocacy and contingency-fee messaging do
not carry into impartial umpire or expert engagements.

- Development: `pnpm dev:consulting`
- Static build: `pnpm generate:consulting`
- Output: `sites/consulting/.output/public`
- Content: `app/data/practice.ts` and `app/pages/index.vue`
- Contact: info@propertyclaimsconsulting.net and 704-305-2338, set once in `app/data/practice.ts`
- Services: `/insurance-appraisal/`, `/umpire-services/`, `/claims-consulting/`,
  and `/expert-witness/`

FAQ disclosures and mobile navigation use native HTML. Production pages ship
without a Vue runtime. Native assignment forms post to `/api/claim-review` through
the same Pages worker used by the public-adjuster sites. Each service page
preselects its service. Email remains an alternative contact method.

## Inquiry delivery

The build includes the shared worker, routing file, and consent-aware attribution
script through Nitro public assets; it does not inherit the public-adjuster shell.
The worker recognizes `propertyclaimsconsulting.net`, `www.propertyclaimsconsulting.net`,
and `propertyclaimsconsulting.pages.dev`. If the Pages project uses another name,
update the host allowlist before deployment.

Configure `PIPEDRIVE_API_TOKEN`, `TURNSTILE_SECRET_KEY`, and `TURNSTILE_SITE_KEY`
in the new Pages project, and allow these hostnames in Turnstile. Tokens stay
server-side. The local static preview does not execute the worker or inject the
CAPTCHA; complete submission requires a configured Cloudflare deployment.

Inquiries create a new contact and lead owned by Ramon using the existing owner
ID. The lead title includes Property Claims Consulting, the requested service,
and the contact name. A linked note preserves property location, parties, timing,
and review questions for follow-up. No public-adjuster website label or lead-source
option is reused: a dedicated CRM label/source has not been provisioned. Website
and landing-page fields identify the consulting site. This site always uses
Pipedrive delivery, even if the shared worker has a Twenty outbox binding.

A successful save redirects to `/thank-you-page/`; `/contact/` provides a separate
inquiry page, and `/privacy-policy/` explains form handling. No automatic email or
appointment is created. Before launch, verify the disclosure against actual
operations and test CAPTCHA, CRM delivery, and the thank-you redirect on Cloudflare.

Homepage motion uses CSS view timelines: section entrances, a drawn property
review illustration, and a connecting line through the engagement steps. It adds
no JavaScript. Browsers without view-timeline support show the complete static
content; reduced-motion preferences disable entrance, scroll, and hover motion.
The graphic is an explanatory illustration, not an assessment of a real claim.

## Content evidence

All four service categories were confirmed by the owner in this session. Ramon
Melo’s association with the firm and general insurance-adjusting/property-claims
background are supported by the existing Melo site content, including
`sites/charlotte/content/pages/about-our-adjuster-firm-charlotte.md` and
`sites/national/content/pages/index.md`. The live Charlotte homepage also names
Ramon and describes his property-claims background:
https://publicadjusterscharlotte.com/

No specific appraisal certifications, testimony history, case results, or expert
qualifications have been added. The portrait in the Ramon Melo panel was supplied by
the owner (`public/images/ramon-melo.jpg`). The property inspection photograph is illustrative, not a
photograph of Ramon or the firm's staff; provenance is in photo-credits.json.

General appraisal-role explanations were informed by the NC DOI homeowners
appraisal explanation and the search research in
`docs/property-claims-consulting-search-research.md`:
https://www.ncdoi.gov/documents/agent-services/information-about-adjuster-motor-vehicle-damage-appraisers-and-public-adjusters/open

Before production launch, confirm the info@propertyclaimsconsulting.net inbox receives mail, current practitioner
credentials, accepted expert subject matter/deliverables, actual conflict-review
procedure, fees, and geographic availability. Add verified CV and professional
background when supplied.

CI deploys this app from `main` to the `propertyclaimsconsulting` Pages project
(https://propertyclaimsconsulting.pages.dev). The Pages project needs its own
secrets, and `propertyclaimsconsulting.net` still has to be added as its custom domain.
