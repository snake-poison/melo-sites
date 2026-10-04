/**
 * Who the business is, how to reach it and how the site is laid out: what makes this site
 * publicadjusterscharlotte.com and not another Melo site. The layer's code imports it as #site;
 * nuxt.config.ts and content.config.ts read it at build time, so it imports nothing from the app.
 *
 * The name, address and phone are written exactly as on the Google Business Profile and the old
 * WordPress site: local search matches them character for character across the web.
 */
export const siteUrl = 'https://publicadjusterscharlotte.com'
export const siteName = 'Melo Public Adjusters Charlotte'
export const siteDescription = 'Melo Public Adjusters Charlotte is a team of independent, licensed public adjusters in Charlotte, NC, available 24/7 with no up-front fees.'

export const business = {
  name: siteName,
  // What WordPress called the site, still in some page titles.
  shortName: 'Public Adjusters of Charlotte',
  description: 'Melo Public Adjusters Charlotte is a team of independent, private insurance claim adjusters in Charlotte, NC. We offer claim adjusting, property damage appraisal and mediation, pre-loss and disaster planning, and builders risk policy adjusting, 24/7 with no up-front fees.',
  phone: '(704) 286-0707',
  phoneHref: 'tel:704-286-0707',
  email: 'charlotte@melopropertyclaims.com',
  address: {
    street: '2128 Remount Rd STE B',
    city: 'Charlotte',
    region: 'NC',
    postalCode: '28208',
    country: 'US',
  },
  geo: { latitude: 35.2251296, longitude: -80.8851499 },
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Melo+Public+Adjusters+Charlotte+2128+Remount+Rd+STE+B+Charlotte+NC+28208',
  hours: 'Open 24/7',
  logo: '/wp-content/uploads/2020/04/Melo-Public-Adjusters-Charlotte-square.png',
  image: '/images/photos/charlotte-skyline-spring.jpg',
  areaServed: ['Charlotte', 'Huntersville', 'Concord', 'Gastonia', 'Monroe', 'Matthews'].map(name => ({ '@type': 'City', 'name': `${name}, NC` })),
  sameAs: [
    'https://www.facebook.com/melopublicadjusterscharlotte/',
    'https://twitter.com/MPAcharlotte',
    'https://www.youtube.com/channel/UCMlZmXiHaZQgIlR7j5nVQsQ',
    'https://www.pinterest.com/melopublicadjusterscharlotte/',
  ],
} as const

/** The profiles the old site's footer linked to (the schema's sameAs also names Pinterest). */
export const footerSocial = business.sameAs.filter(profile => !profile.includes('pinterest'))

export const addressLine = `${business.address.street}, ${business.address.city}, ${business.address.region} ${business.address.postalCode}`

/** public/images/brand/logo.png's size, for its shape. */
export const logoSize = { width: 901, height: 260 }

/** The towns the firm serves, in the order the old site listed them. */
export const serviceAreas = ['Greater Charlotte', 'Huntersville', 'Concord', 'Gastonia', 'Monroe', 'Matthews'] as const

export interface NavLink { label: string, to: string, children?: NavLink[] }

/** The main menu, as WordPress had it. */
export const mainNav: NavLink[] = [
  { label: 'Home', to: '/' },
  {
    label: 'About Us',
    to: '/about-our-adjuster-firm-charlotte/',
    children: [
      { label: 'Our Firm', to: '/about-our-adjuster-firm-charlotte/' },
      { label: 'Partnering Contractors', to: '/our-independent-adjusters-contractors-charlotte/' },
      { label: 'Our Blog', to: '/blog/' },
    ],
  },
  {
    label: 'Need An Adjuster?',
    to: '/claims-adjuster/',
    children: [
      { label: 'Insurance Claims Adjusters', to: '/claims-adjuster/insurance-adjuster-charlotte/' },
      { label: 'Property Damage Appraisers', to: '/claims-adjuster/property-damage-appraisers-charlotte/' },
      { label: 'Pre-Loss & Disaster Planning', to: '/claims-adjuster/pre-loss-disaster-planning-insurance-adjuster-charlotte/' },
    ],
  },
  {
    label: 'Claim Types',
    to: '/insurance-claim-type/',
    children: [
      { label: 'Mold & Water Damage', to: '/insurance-claim-type/adjuster-mold-water-damage-charlotte/' },
      { label: 'Smoke & Fire Damage', to: '/insurance-claim-type/adjuster-smoke-fire-damage-charlotte/' },
      { label: 'Storm & Wind Damage', to: '/insurance-claim-type/adjuster-wind-storm-damage-charlotte/' },
      { label: 'Roof Damage', to: '/insurance-claim-type/adjuster-hail-roof-damage-charlotte/' },
    ],
  },
  { label: 'Contact', to: '/contact/' },
]

/** The four claim types, each with its own page: the menu, the footer and the claim-types grid. */
export const claimTypes = [
  {
    label: 'Mold & Water Damage',
    to: '/insurance-claim-type/adjuster-mold-water-damage-charlotte/',
    icon: 'icon-[carbon--rain-drop]',
    summary: 'Pipes that burst in a hard freeze, roof and appliance leaks, creek flooding and the mold that follows.',
  },
  {
    label: 'Storm & Wind Damage',
    to: '/insurance-claim-type/adjuster-wind-storm-damage-charlotte/',
    icon: 'icon-[carbon--rain-heavy]',
    summary: 'Hurricane remnants, tornadoes, ice storms, fallen trees and wind-driven rain.',
  },
  {
    label: 'Hail & Roof Damage',
    to: '/insurance-claim-type/adjuster-hail-roof-damage-charlotte/',
    icon: 'icon-[carbon--home]',
    summary: 'Spring hailstorms, missing shingles and roofs the insurer would rather patch than replace.',
  },
  {
    label: 'Smoke & Fire Damage',
    to: '/insurance-claim-type/adjuster-smoke-fire-damage-charlotte/',
    icon: 'icon-[carbon--fire]',
    summary: 'Fire, smoke and soot, and the water used to put the fire out.',
  },
] as const

/** The adjuster services, for a page that shows them in the claim types' place (services: true). */
export const services = [
  {
    label: 'Insurance Claims Adjusters',
    to: '/claims-adjuster/insurance-adjuster-charlotte/',
    icon: 'icon-[carbon--scales]',
    summary: 'A licensed adjuster on your side, from the first call to the settlement.',
  },
  {
    label: 'Property Damage Appraisers',
    to: '/claims-adjuster/property-damage-appraisers-charlotte/',
    icon: 'icon-[carbon--search]',
    summary: 'An honest, documented valuation of your loss to set against the insurer\'s.',
  },
  {
    label: 'Pre-Loss & Disaster Planning',
    to: '/claims-adjuster/pre-loss-disaster-planning-insurance-adjuster-charlotte/',
    icon: 'icon-[carbon--calendar]',
    summary: 'Your property and inventory on record before a disaster, so a claim is ready.',
  },
] as const

/** The footer's "Getting Around" links, as WordPress had them. */
export const footerNav: NavLink[] = [
  { label: 'About Us', to: '/about-our-adjuster-firm-charlotte/' },
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
export const categoryIds = ['insurance-adjusters', 'local-news-activities', 'things-to-do'] as const

export type Category = typeof categoryIds[number]

export const categories: Record<Category, { label: string, description: string }> = {
  'insurance-adjusters': {
    label: 'Insurance Adjusters',
    description: 'How public adjusters, loss adjusters and claims adjusters work, and how to get a fair insurance settlement in Charlotte, NC.',
  },
  'local-news-activities': {
    label: 'Local News & Activities',
    description: 'News and things going on around Charlotte, NC, from the team at Melo Public Adjusters Charlotte.',
  },
  'things-to-do': {
    label: 'Things to Do',
    description: 'Things to do in and around Charlotte and Huntersville, NC, from the team at Melo Public Adjusters Charlotte.',
  },
}

/** Clients' reviews, as the old site quoted them: the band under the steps shows them. */
export const reviews: readonly { quote: string, name: string, source?: string }[] = [
  {
    quote: 'Fast, professional, and highly informed. I was happy with all aspects of the job. Would absolutely recommend to any friends and family.',
    name: 'Trey Edwards',
  },
  {
    quote: 'These guys are the BEST! Totally saved my life after a water line in my home got busted. They go above and beyond and really care. Thank you so much!!',
    name: 'Bethany Simonetti',
  },
]

/**
 * What the site sells with, in its own words: the header's top line, the three promises under the
 * hero's heading, the credentials strip under the hero and the steps of a claim.
 */
export const promise = 'Licensed public adjusters in Charlotte · Free claim reviews, 24/7'

export const heroPoints: readonly string[] = ['Free claim review', 'No up-front fees', 'Our fee comes only from the extra we recover']

export const credentials: readonly { icon: string, title: string, text: string }[] = [
  { icon: 'icon-[carbon--certificate-check]', title: 'Licensed in North Carolina', text: 'Public adjuster license #8627837, held by Ramon Melo' },
  { icon: 'icon-[carbon--user-multiple]', title: 'For policyholders only', text: 'We never work for an insurance company' },
  { icon: 'icon-[carbon--time]', title: 'Licensed since 2011', text: 'Ramon Melo has been a licensed adjuster since 2011 and a public adjuster since 2019' },
  { icon: 'icon-[carbon--phone]', title: 'Open 24/7', text: 'A local Charlotte office, answered day and night' },
]

/** Ramon Melo's public adjuster licenses, as the state certificates give them, for the footer. */
export const licenses: readonly string[] = ['North Carolina public adjuster license #8627837']

/**
 * The star rating on the business's own Google listing, read off Google Maps on `checked`; null
 * shows no rating. Update it by hand: the sites never claim a rating Google does not show.
 */
export const googleRating: { value: number, checked: string } | null = null

export const howItWorks: { title: string, steps: readonly { title: string, text: string }[] } = {
  title: 'How we get your claim paid',
  steps: [
    { title: 'Tell us what happened', text: 'Call or send the form. The review is free and there is no obligation.' },
    { title: 'We document the whole loss', text: 'We inspect the damage, read your policy and price every line of the repair.' },
    { title: 'We negotiate with your insurer', text: 'You stop chasing the adjuster. Our fee is a share of what we add to the settlement.' },
  ],
}

/**
 * The free-second-opinion band over the footer, in the old site's two wordings: the home page's
 * and every other page's. With no selling points, the text ends in a "Call us at" link.
 */
export const secondOpinion: Record<'home' | 'page', { title: string, text: string, points: readonly string[], cta: string }> = {
  home: {
    title: 'Get a Second Opinion on Your Claim, for FREE!',
    text: 'It never hurts to have another expert on your side, especially with large insurance claims.',
    points: ['Licensed in North Carolina', 'Based in Charlotte', 'No Up-Front Fees'],
    cta: 'Get Started Now',
  },
  page: {
    title: 'Get a Second Opinion on Your Claim, for FREE!',
    text: `${siteName} will do all that they can to ensure the insurance companies are treating you fairly!`,
    points: [],
    cta: 'Get A Claims Review',
  },
}

/**
 * The free claim review form posts to the Charlotte Pages Worker, which verifies Turnstile,
 * saves the intake in Pipedrive, and redirects to /thank-you-page/. README.md has the setup.
 */
export const claimForm: { action: string, hidden: Record<string, string>, lossTypes: readonly string[], statePlaceholder?: string } = {
  action: '/api/claim-review',
  // Fields the service needs with every submission, such as its access key.
  hidden: {},
  // The checkboxes of the old form's first step.
  lossTypes: ['Fire / Smoke Damage', 'Water Damage', 'Mold Remediation', 'Storm Damage', 'Other'],
  // The State field's example: this market's state.
  statePlaceholder: 'e.g. NC',
}

/** The claim-types block's heading and intro, where a page does not give its own. */
export const claimTypesIntro = {
  title: 'Insurance Adjuster for Many Types of Claims',
  text: 'Do you have a property loss claim to file but your insurance policy makes no sense? No worries! Melo Public Adjusters Charlotte helps homeowners and businesses across Charlotte and the nearby towns with many [insurance claim types](/insurance-claim-type/), from storm & wind damage to losses from house fires. Call us today to get the compensation you\'re paying for.',
}

/** The blog's index at /blog/, with the title and heading WordPress gave it. */
export const blogPage = {
  title: 'Our Blog & Other Resources',
  metaTitle: 'Our Blog - Public Adjusters of Charlotte',
  lead: 'Claim tips for Charlotte homeowners and business owners, and news and things to do around the Queen City.',
  description: 'Tips on insurance claims and public adjusters, and news and things to do around Charlotte, NC, from Melo Public Adjusters Charlotte.',
  image: '/images/photos/charlotte-park-road-park-pond.jpg',
}

/**
 * The page-by-page index WordPress had at /sitemap/: its pages in the order it listed them (by
 * title, and home under its WordPress name).
 */
export const sitemapPage: { description: string, order: string[], names: Record<string, string> } = {
  description: 'Every page and blog post on the Melo Public Adjusters Charlotte website, from our claim types and services to our service areas.',
  order: [
    '/about-our-adjuster-firm-charlotte',
    '/client-reviews',
    '/contact',
    '/service-areas',
    '/',
    '/claims-adjuster',
    '/claims-adjuster/insurance-adjuster-charlotte',
    '/claims-adjuster/pre-loss-disaster-planning-insurance-adjuster-charlotte',
    '/claims-adjuster/property-damage-appraisers-charlotte',
    '/insurance-claim-type',
    '/insurance-claim-type/adjuster-wind-storm-damage-charlotte',
    '/insurance-claim-type/adjuster-smoke-fire-damage-charlotte',
    '/insurance-claim-type/adjuster-hail-roof-damage-charlotte',
    '/insurance-claim-type/adjuster-mold-water-damage-charlotte',
    '/blog',
    '/our-independent-adjusters-contractors-charlotte',
    '/privacy-policy',
    '/sitemap',
    '/terms-conditions',
    '/thank-you-page',
  ],
  names: {
    '/': 'Melo Public Adjusters Charlotte - Home',
    '/blog': 'Our Blog & Other Resources',
    '/sitemap': 'Sitemap',
  },
}
