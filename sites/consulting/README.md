# Property Claims Consulting

Dedicated Melo-brand appraisal umpire website for propertyclaimsconsulting.net.
It extends the unchanged UI layer rather than the public-adjusting marketing shell,
so the umpire role has its own copy, navigation, and contact flow.

- Development: `pnpm dev:consulting`
- Static build: `pnpm generate:consulting`
- Output: `sites/consulting/.output/public`

FAQ disclosure and navigation use native HTML; production pages ship without a
Vue runtime. Inquiry buttons open an email draft to the existing Melo inbox;
they do not submit a form or create a CRM record. The photograph is illustrative,
not a photograph of the firm's staff (provenance in photo-credits.json).

Before production launch, confirm the intended contact inbox, practitioner
biography/credentials, actual conflict-review procedure, fees, and geographic
availability with the business. No credentials, results, testimonials, or
specific service territory have been invented. General appraisal copy was
informed by NAIC Consumer Liaison Committee materials (November 30, 2023):
https://content.naic.org/sites/default/files/national_meeting/Materials%20-%20Consumer%20113023%20Attmts%201_2.pdf

This app is not added to the existing three-site Cloudflare deployment matrix.
Provision its Pages project and custom domain separately after confirming hosting.
