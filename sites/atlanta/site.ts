/**
 * Who the business is, how to reach it and how the site is laid out: what makes this site
 * publicadjustersofatlanta.com and not another Melo site. The layer's code imports it as #site;
 * nuxt.config.ts and content.config.ts read it at build time, so it imports nothing from the app.
 *
 * The name, address and phone are written exactly as the old WordPress site's header, footer and
 * schema had them: local search matches them character for character across the web.
 */
export const siteUrl = 'https://publicadjustersofatlanta.com'
export const siteName = 'Melo Public Adjusters Atlanta'
export const siteDescription = 'Melo Public Adjusters Atlanta is a team of certified, independent public adjusters in Atlanta, GA, open 24/7 with no up-front cost.'

export const business = {
  name: siteName,
  // What WordPress called the site, in its page titles and footer.
  shortName: 'Melo Public Adjusters Atlanta',
  description: 'Melo Public Adjusters Atlanta is a team of loss adjusters that specialize in property damage claim types that include, but are not limited to water damage, smoke & fire damage, mold damage, wind & storm damage, roof damage, and more. Our certified public adjusters keep our clients\' best interest at heart and we fight in the public arena for those we serve. If you are interested in learning what a public adjuster in Atlanta can do for you, give us a call.',
  phone: '(404) 467-5755',
  phoneHref: 'tel:404-467-5755',
  email: 'atlanta@melopropertyclaims.com',
  address: {
    street: '691 John Wesley Dobbs Ave NE V22',
    city: 'Atlanta',
    region: 'GA',
    postalCode: '30312',
    country: 'US',
  },
  // The street address's own point (OpenStreetMap). The old schema's sat some 5 km to the west.
  geo: { latitude: 33.759316, longitude: -84.3646791 },
  // The Google Business Profile the old site's header linked to, with the reviews.
  mapUrl: 'https://www.google.com/maps?cid=8798277323873076393',
  hours: 'Open 24/7',
  logo: '/wp-content/uploads/2020/04/Melo-Public-Adjusters-Atlanta-Square.png',
  image: '/wp-content/uploads/2020/02/insurance-claim-adjusters-Atlanta.jpg',
  areaServed: ['Atlanta', 'Alpharetta', 'Sandy Springs', 'Marietta', 'Roswell', 'Mableton'].map(name => ({ '@type': 'City', 'name': `${name}, GA` })),
  sameAs: [
    'https://www.facebook.com/pg/melopublicadjustersatlanta',
    'https://twitter.com/adjusteratlanta',
    'https://www.youtube.com/channel/UC4Lu2Mk_HLvbOsizMavZKCQ',
    'https://www.pinterest.com/melopublicadjustersatlanta/',
  ],
} as const

/** The profiles the old site's footer linked to (the schema's sameAs also names X and Pinterest). */
export const footerSocial = business.sameAs.filter(profile => /facebook|youtube/.test(profile))

export const addressLine = `${business.address.street}, ${business.address.city}, ${business.address.region} ${business.address.postalCode}`

/** public/images/brand/logo.png's size, for its shape. */
export const logoSize = { width: 843, height: 260 }

/** The towns the firm serves, in the order the old site's footer listed them. */
export const serviceAreas = ['Greater Atlanta', 'Alpharetta', 'Sandy Springs', 'Marietta', 'Roswell', 'Mableton'] as const

export interface NavLink { label: string, to: string, children?: NavLink[] }

/** The main menu, as WordPress had it. */
export const mainNav: NavLink[] = [
  { label: 'Home', to: '/' },
  {
    label: 'About Us',
    to: '/about-our-adjuster-firm-atlanta/',
    children: [
      { label: 'Our Company', to: '/about-our-adjuster-firm-atlanta/' },
      { label: 'Partnering Contractors', to: '/our-independent-adjusters-contractors-atlanta/' },
      { label: 'Our Blog', to: '/blog/' },
    ],
  },
  {
    label: 'Need An Adjuster?',
    to: '/claims-adjuster/',
    children: [
      { label: 'Insurance Adjusters', to: '/claims-adjuster/insurance-adjuster-atlanta/' },
      { label: 'Appraisals & Mediations', to: '/claims-adjuster/property-damage-appraisers-atlanta/' },
      { label: 'Pre-Loss & Disaster Planning', to: '/claims-adjuster/pre-loss-disaster-planning-insurance-adjuster-atlanta/' },
    ],
  },
  {
    label: 'Claim Types',
    to: '/insurance-claim-type/',
    children: [
      { label: 'Water Damage', to: '/insurance-claim-type/adjuster-water-damage-atlanta/' },
      { label: 'Smoke & Fire Damage', to: '/insurance-claim-type/adjuster-smoke-fire-damage-atlanta/' },
      { label: 'Storm & Wind Damage', to: '/insurance-claim-type/adjuster-wind-storm-damage-atlanta/' },
      { label: 'Mold Damage', to: '/insurance-claim-type/adjuster-mold-damage-atlanta/' },
      { label: 'Roof Damage', to: '/insurance-claim-type/adjuster-hail-roof-damage-atlanta/' },
    ],
  },
  { label: 'Contact', to: '/contact/' },
]

/** The five claim types, each with its own page: the claim-types grid. */
export const claimTypes = [
  {
    label: 'Water Damage',
    to: '/insurance-claim-type/adjuster-water-damage-atlanta/',
    icon: 'icon-[carbon--rain-drop]',
    summary: 'Leaking pipes, failed water heaters, overflowing appliances and flooded basements.',
  },
  {
    label: 'Mold Damage',
    to: '/insurance-claim-type/adjuster-mold-damage-atlanta/',
    icon: 'icon-[carbon--warning-alt]',
    summary: 'Mold growth after a leak or a humid Georgia summer, and what the policy owes for it.',
  },
  {
    label: 'Storm & Wind Damage',
    to: '/insurance-claim-type/adjuster-wind-storm-damage-atlanta/',
    icon: 'icon-[carbon--rain-heavy]',
    summary: 'Thunderstorms, tornadoes, downed trees and siding torn loose by the wind.',
  },
  {
    label: 'Hail & Roof Damage',
    to: '/insurance-claim-type/adjuster-hail-roof-damage-atlanta/',
    icon: 'icon-[carbon--home]',
    summary: 'Dented shingles, cracked flashing and leaks the insurer calls wear and tear.',
  },
  {
    label: 'Smoke & Fire Damage',
    to: '/insurance-claim-type/adjuster-smoke-fire-damage-atlanta/',
    icon: 'icon-[carbon--fire]',
    summary: 'Burned structure and contents, smoke odour, soot and the water damage from putting it out.',
  },
] as const

/** The adjuster services, for a page that shows them in the claim types' place (services: true). */
export const services = [
  {
    label: 'Insurance Adjusters',
    to: '/claims-adjuster/insurance-adjuster-atlanta/',
    icon: 'icon-[carbon--scales]',
    summary: 'Your own licensed adjuster to assess the damage, prepare the claim and negotiate it.',
  },
  {
    label: 'Appraisals & Mediations',
    to: '/claims-adjuster/property-damage-appraisers-atlanta/',
    icon: 'icon-[carbon--search]',
    summary: 'An independent appraisal of the loss, and someone at the table when the claim is disputed.',
  },
  {
    label: 'Pre-Loss & Disaster Planning',
    to: '/claims-adjuster/pre-loss-disaster-planning-insurance-adjuster-atlanta/',
    icon: 'icon-[carbon--calendar]',
    summary: 'A policy review and a record of your property, made before anything goes wrong.',
  },
] as const

/** The footer's "Getting Around" links, as WordPress had them. */
export const footerNav: NavLink[] = [
  { label: 'About Us', to: '/about-our-adjuster-firm-atlanta/' },
  { label: 'Our Services', to: '/claims-adjuster/' },
  { label: 'Service Areas', to: '/service-areas/' },
  { label: 'Our Blog', to: '/blog/' },
  { label: 'Contact Us', to: '/contact/' },
  { label: 'Sitemap', to: '/sitemap/' },
]

/**
 * The blog's WordPress categories. Each has an archive at /blog/category/<id>/, the URL WordPress
 * gave it, kept out of search results as Yoast had them.
 */
export const categoryIds = ['insurance-claim-adjusters', 'local-news', 'public-adjusters'] as const

export type Category = typeof categoryIds[number]

export const categories: Record<Category, { label: string, description: string }> = {
  'insurance-claim-adjusters': {
    label: 'Insurance Claim Adjusters',
    description: 'What insurance claim adjusters do, what they charge and what to expect once you have called one in Atlanta, GA.',
  },
  'local-news': {
    label: 'Local News',
    description: 'Hidden gems, weekend plans and other things to do around Atlanta, GA, from Melo Public Adjusters Atlanta.',
  },
  'public-adjusters': {
    label: 'Public Adjusters',
    description: 'How public adjusters in Atlanta get licensed and find their clients, from the team at Melo Public Adjusters Atlanta.',
  },
}

/**
 * The client review the claim-review band quotes. The old site quoted the Charlotte site's
 * review, and the sites share no copy, so until Atlanta has one of its own to quote the band
 * links to its Google reviews instead.
 */
export const featuredReview: { quote: string, name: string } | null = null

/**
 * The free-second-opinion band over the footer, in the old site's two wordings: the home page's
 * and every other page's. With no selling points, the text ends in a "Call us at" link.
 */
export const secondOpinion: Record<'home' | 'page', { title: string, text: string, points: readonly string[], cta: string }> = {
  home: {
    title: 'Receive a FREE Claims Estimate Today',
    text: 'When dealing with any insurance claim, getting a second opinion is worthwhile. Start now!',
    points: ['Certified Public Adjusters', 'Locally Owned & Operated', 'No Up-Front Cost'],
    cta: 'Submit an Inquiry',
  },
  page: {
    title: 'Receive a FREE Claims Estimate Today',
    text: 'When dealing with any insurance claim, getting a second opinion is worthwhile. Start now!',
    points: ['Certified Public Adjusters', 'Locally Owned & Operated', 'No Up-Front Cost'],
    cta: 'Get Help Now',
  },
}

/**
 * The free claim review form. The site is static, so the form posts to a form service, which
 * emails the lead and sends the visitor to /thank-you-page/. Until `action` is set, the form
 * is left out and the block offers the phone and email instead. README.md has the setup.
 */
export const claimForm: { action: string, hidden: Record<string, string>, lossTypes: readonly string[] } = {
  action: '/api/claim-review',
  // Fields the service needs with every submission, such as its access key.
  hidden: {},
  // The checkboxes of the old form's first step.
  lossTypes: ['Fire / Smoke Damage', 'Water Damage', 'Mold Remediation', 'Storm Damage', 'Other'],
}

/** The claim-types block's heading and intro, where a page does not give its own. */
export const claimTypesIntro = {
  title: 'We Handle All Insurance Claim Types in Atlanta!',
  text: 'There\'s no telling when disaster is going to strike and no way to predict what type of situation you\'re going to face when it comes to property damage in Atlanta. That\'s why we stay up-to-date and educated in all [insurance claim types](/insurance-claim-type/). Call us today, no matter what you\'re dealing with. We\'re here to assist you!',
}

/** The blog's index at /blog/, with the title and heading WordPress gave it. */
export const blogPage = {
  title: 'Blog',
  metaTitle: 'Our Blog - Melo Public Adjusters Atlanta',
  lead: 'Get the maximum valuation for your insurance claims. We work for you, so let\'s work together.',
  description: 'Articles on public adjusters, insurance claims and appraisals, plus weekend ideas around Atlanta, GA, from Melo Public Adjusters Atlanta.',
  image: '/wp-content/uploads/2020/02/Header-8.jpg',
}

/**
 * The page-by-page index WordPress had at /sitemap/: its pages in the order it listed them (by
 * title, and home under its WordPress name).
 */
export const sitemapPage: { description: string, order: string[], names: Record<string, string> } = {
  description: 'Every page and article on the Melo Public Adjusters Atlanta website: claim types, adjuster services, service areas and the blog.',
  order: [
    '/about-our-adjuster-firm-atlanta',
    '/blog',
    '/client-reviews',
    '/contact',
    '/our-independent-adjusters-contractors-atlanta',
    '/service-areas',
    '/',
    '/claims-adjuster',
    '/claims-adjuster/insurance-adjuster-atlanta',
    '/claims-adjuster/pre-loss-disaster-planning-insurance-adjuster-atlanta',
    '/claims-adjuster/property-damage-appraisers-atlanta',
    '/insurance-claim-type',
    '/insurance-claim-type/adjuster-wind-storm-damage-atlanta',
    '/insurance-claim-type/adjuster-smoke-fire-damage-atlanta',
    '/insurance-claim-type/adjuster-water-damage-atlanta',
    '/insurance-claim-type/adjuster-hail-roof-damage-atlanta',
    '/insurance-claim-type/adjuster-mold-damage-atlanta',
    '/privacy-policy',
    '/sitemap',
    '/terms-conditions',
    '/thank-you-page',
  ],
  names: {
    '/': 'Melo Public Adjusters Atlanta | Home',
    '/blog': 'Blog',
    '/sitemap': 'Sitemap',
  },
}
