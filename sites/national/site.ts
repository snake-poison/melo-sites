/**
 * Who the business is, how to reach it and how the site is laid out: what makes this site
 * melopropertyclaimsadjusting.com, the national site, and not another Melo site. The layer's code
 * imports it as #site; nuxt.config.ts and content.config.ts read it at build time, so it imports
 * nothing from the app.
 *
 * The name, address and phone are written exactly as the old WordPress site's header and footer
 * had them: local search matches them character for character across the web.
 */
export const siteUrl = 'https://melopropertyclaimsadjusting.com'
export const siteName = 'Melo Property Claims'
export const siteDescription = 'Melo Property Claims is a team of licensed public adjusters for property damage insurance claims in NC, SC, GA and FL, available 24/7 with no up-front fees.'

export const business = {
  name: siteName,
  // What WordPress called the site, in its page titles.
  shortName: 'Melo Property Claims',
  description: 'Melo Property Claims is a public adjuster firm that specializes in loss adjusting for property damage claims of all types, including: fire, smoke, storm, wind, hail, water, and flood damage. Our pricing model is contingency based, so we only get paid when we win big for our clients. Our mission is to make sure our clients get the valuation they deserve by holding the insurance company accountable. Get in touch for a free, no-obligation claim review and estimate.',
  phone: '(704) 325-5525',
  phoneHref: 'tel:+17043255525',
  email: 'info@melopropertyclaims.com',
  address: {
    street: '5736 N Tryon St #232',
    city: 'Charlotte',
    region: 'NC',
    postalCode: '28213',
    country: 'US',
  },
  geo: { latitude: 35.2635565, longitude: -80.7693035 },
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Melo+Property+Claims+5736+N+Tryon+St+%23232+Charlotte+NC+28213',
  hours: 'Open 24/7',
  logo: '/wp-content/uploads/2020/04/melo-property-claims-logo-square@2x.png',
  image: '/wp-content/uploads/2020/03/insurance-claims-adjuster-charlotte.jpg',
  areaServed: ['North Carolina', 'South Carolina', 'Georgia', 'Florida', 'Tennessee', 'Texas', 'Louisiana', 'Maryland', 'Pennsylvania', 'Virginia', 'Kentucky', 'New Jersey']
    .map(name => ({ '@type': 'State', 'name': name })),
  sameAs: [
    'https://www.facebook.com/melopropertyclaims/',
    'https://twitter.com/MeloClaims',
    'https://www.youtube.com/channel/UCt7n791AIZDKmLwuJNAHxbw',
    'https://www.pinterest.com/melopropertyclaims/',
    'https://www.instagram.com/melopropertyclaims/',
  ],
} as const

/** The profiles the old site's footer linked to (the schema's sameAs also names X and Pinterest). */
export const footerSocial = business.sameAs.filter(profile => /facebook|instagram|youtube/.test(profile))

export const addressLine = `${business.address.street}, ${business.address.city}, ${business.address.region} ${business.address.postalCode}`

/** public/images/brand/logo.png's size, for its shape. */
export const logoSize = { width: 500, height: 177 }

/** The states the firm serves, in the order the old site's footer listed them. */
export const serviceAreas = ['South Carolina', 'North Carolina', 'Georgia', 'Tennessee', 'Texas', 'Louisiana', 'Maryland', 'Pennsylvania', 'Virginia', 'Kentucky', 'New Jersey'] as const

export interface NavLink { label: string, to: string, children?: NavLink[] }

/** The main menu, as WordPress had it. */
export const mainNav: NavLink[] = [
  { label: 'Home', to: '/' },
  {
    label: 'Need An Adjuster?',
    to: '/claim-adjusters/',
    children: [
      { label: 'Our Insurance Adjusters', to: '/claim-adjusters/our-insurance-adjusters/' },
      { label: 'Property Damage Appraisal', to: '/claim-adjusters/property-damage-appraisers-mediation/' },
      { label: 'Pre-Loss & Disaster Planning', to: '/claim-adjusters/disaster-insurance-adjuster/' },
      { label: 'Builders Risk Insurance', to: '/claim-adjusters/builders-risk-insurance-adjusters/' },
    ],
  },
  {
    label: 'Claim Types',
    to: '/insurance-claim-type/',
    children: [
      { label: 'Water Damage', to: '/insurance-claim-type/water-damage-claims-adjuster/' },
      { label: 'Mold Remediation', to: '/insurance-claim-type/public-adjuster-mold-remediation-claim/' },
      { label: 'Storm & Wind Damage', to: '/insurance-claim-type/public-adjuster-wind-storm-damage-claim/' },
      { label: 'Fire & Smoke Damage', to: '/insurance-claim-type/public-adjuster-smoke-fire-damage-claim/' },
      { label: 'Roof Damage', to: '/insurance-claim-type/public-adjuster-roof-damage/' },
      { label: 'Commercial Property Damage', to: '/insurance-claim-type/commercial-property-damage-claims/' },
    ],
  },
  {
    label: 'About Us',
    to: '/about-our-public-adjuster-firm/',
    children: [
      { label: 'Our Company', to: '/about-our-public-adjuster-firm/' },
      { label: 'Partnering Contractors', to: '/our-independent-adjusters-and-partnering-contractors/' },
      { label: 'Blog & Resources', to: '/blog/' },
    ],
  },
  { label: 'Contact', to: '/contact/' },
]

/** The claim types the claim-types grid shows, as the old site's service pages set them. */
export const claimTypes = [
  {
    label: 'Water & Mold Damage Claims',
    to: '/insurance-claim-type/water-damage-claims-adjuster/',
    icon: 'icon-[carbon--rain-drop]',
    summary: 'Burst pipes, roof and appliance leaks, flooding and the mold that follows.',
  },
  {
    label: 'Storm & Wind Damage Claims',
    to: '/insurance-claim-type/public-adjuster-wind-storm-damage-claim/',
    icon: 'icon-[carbon--rain-heavy]',
    summary: 'Hurricanes, tornadoes, fallen trees and wind-driven rain.',
  },
  {
    label: 'Smoke & Fire Damage Claims',
    to: '/insurance-claim-type/public-adjuster-smoke-fire-damage-claim/',
    icon: 'icon-[carbon--fire]',
    summary: 'Fire, smoke and soot, and the water used to put the fire out.',
  },
  {
    label: 'Hail & Roof Damage Claims',
    to: '/insurance-claim-type/public-adjuster-roof-damage/',
    icon: 'icon-[carbon--home]',
    summary: 'Hail strikes, missing shingles and roofs the insurer would rather patch.',
  },
] as const

/** The adjuster services, which the adjuster pages show in the claim types' place (services: true). */
export const services = [
  {
    label: 'Property Damage Appraisers',
    to: '/claim-adjusters/property-damage-appraisers-mediation/',
    icon: 'icon-[carbon--search]',
    summary: 'An honest, documented valuation of your loss to set against the insurer\'s.',
  },
  {
    label: 'Insurance Claim Mediators',
    to: '/claim-adjusters/our-insurance-adjusters/',
    icon: 'icon-[carbon--scales]',
    summary: 'A licensed adjuster to argue your side when the claim is stuck in a dispute.',
  },
  {
    label: 'Pre-Loss & Disaster Planning',
    to: '/claim-adjusters/disaster-insurance-adjuster/',
    icon: 'icon-[carbon--calendar]',
    summary: 'Your property and inventory on record before a disaster, so a claim is ready.',
  },
  {
    label: 'Builders Risk Insurance Adjuster',
    to: '/claim-adjusters/builders-risk-insurance-adjusters/',
    icon: 'icon-[carbon--building]',
    summary: 'Claims on buildings under construction, under policies that are hard to read.',
  },
] as const

/** The footer's "Getting Around" links, as WordPress had them. */
export const footerNav: NavLink[] = [
  { label: 'About Us', to: '/about-our-public-adjuster-firm/' },
  // WordPress linked /claims-adjuster/, which the national site never had.
  { label: 'Our Adjusters', to: '/claim-adjusters/' },
  { label: 'Service Areas', to: '/service-areas/' },
  { label: 'Our Blog', to: '/blog/' },
  { label: 'Contact Us', to: '/contact/' },
  { label: 'Sitemap', to: '/sitemap/' },
]

/**
 * The blog's WordPress categories. Each has an archive at /blog/category/<id>/, the URL WordPress
 * gave it, kept out of search results as Yoast had them.
 */
export const categoryIds = ['public-adjusters', 'roof-damage-claim', 'uncategorized', 'water-damage-claim'] as const

export type Category = typeof categoryIds[number]

export const categories: Record<Category, { label: string, description: string }> = {
  'public-adjusters': {
    label: 'Public Adjusters',
    description: 'How public adjusters work and how to get a fair settlement on a property damage insurance claim, from the team at Melo Property Claims.',
  },
  'roof-damage-claim': {
    label: 'Roof Damage Claim',
    description: 'Roof, hail and storm damage insurance claims, and how a public adjuster gets them paid in full, from the team at Melo Property Claims.',
  },
  'uncategorized': {
    label: 'Uncategorized',
    description: 'Insurance claim advice and answers for property owners, from the licensed public adjusters at Melo Property Claims.',
  },
  'water-damage-claim': {
    label: 'Water Damage Claim',
    description: 'Water damage and mold insurance claims, and what to do before and after you file, from the team at Melo Property Claims.',
  },
}

/**
 * The client review the claim-review band quotes: the site's own, from its reviews page. (The old
 * site quoted Trey Edwards, as the Charlotte and Atlanta sites did; the sites share no copy now.)
 */
export const featuredReview: { quote: string, name: string } | null = {
  quote: 'Excellent customer service and a great team to work with. I sent them an urgent issue and they got back to me instantly. Highly recommended.',
  name: 'Ryan Taclibon',
}

/**
 * The free-second-opinion band over the footer, in the old site's two wordings: the home page's
 * and every other page's. With no selling points, the text ends in a "Call us at" link.
 */
export const secondOpinion: Record<'home' | 'page', { title: string, text: string, points: readonly string[], cta: string }> = {
  home: {
    title: 'Get a FREE claims review & second opinion',
    text: 'When dealing with any insurance claim, getting a second opinion is worthwhile.',
    points: ['Licensed Public Adjusters', 'Contingency pricing', 'No Up-Front Cost'],
    cta: 'Speak to an Adjuster',
  },
  page: {
    title: 'Receive a FREE Claims Estimate Now',
    text: 'When dealing with any insurance claim, getting a second opinion is worthwhile. Start now!',
    points: ['Certified Public Adjusters', 'Locally Owned & Operated', 'No Up-Front Cost'],
    cta: 'Start Your Claims Estimate',
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
  title: 'Discover Our Multitude of Insurance Claim Types',
  text: 'There are plenty of public adjuster firms out there, but not all of them are as comprehensive as we are when it comes to the [types of insurance claims](/insurance-claim-type/) they handle. We do them all, so feel free to call us back whenever you have a need for dealing with an unresponsive insurance company.',
}

/** The blog's index at /blog/, with the title and heading WordPress gave it. */
export const blogPage = {
  title: 'Our Public Adjuster Blog & Other Resources',
  metaTitle: 'Insurance Adjuster Blog | Melo Property Claims',
  lead: 'Ready to truly hold your insurance company accountable and get the valuation you deserve? We work for you, so let\'s work together.',
  description: 'Learn more about public adjusting and getting the most out of your property damage insurance claim. Experienced & licensed in every state.',
  image: '/wp-content/uploads/2020/03/Header-10.jpg',
}

/**
 * The page-by-page index WordPress had at /sitemap/: its pages in the order it listed them (by
 * title, and home under its WordPress name).
 */
export const sitemapPage: { description: string, order: string[], names: Record<string, string> } = {
  description: 'Check out our sitemap and find all information you need on our public adjuster services.',
  order: [
    '/about-our-public-adjuster-firm',
    '/insurance-claim-type',
    '/insurance-claim-type/public-adjuster-mold-remediation-claim',
    '/insurance-claim-type/public-adjuster-smoke-fire-damage-claim',
    '/insurance-claim-type/water-damage-claims-adjuster',
    '/insurance-claim-type/public-adjuster-roof-damage',
    '/insurance-claim-type/commercial-property-damage-claims',
    '/insurance-claim-type/public-adjuster-wind-storm-damage-claim',
    '/contact',
    '/claim-adjusters',
    '/claim-adjusters/builders-risk-insurance-adjusters',
    '/claim-adjusters/disaster-insurance-adjuster',
    '/claim-adjusters/our-insurance-adjusters',
    '/claim-adjusters/property-damage-appraisers-mediation',
    '/our-independent-adjusters-and-partnering-contractors',
    '/',
    '/service-areas',
    '/service-areas/public-adjuster-south-carolina',
    '/service-areas/public-adjuster-georgia',
    '/service-areas/nc-public-adjusters',
    '/service-areas/public-adjuster-florida',
    '/blog',
    '/privacy-policy',
    '/claims-adjuster-reviews',
    '/sitemap',
    '/terms-conditions',
    '/thank-you-page',
  ],
  names: {
    '/': 'Melo Property Claims - We\'re Committed To Excellence',
    '/blog': 'Our Public Adjuster Blog & Other Resources',
    '/sitemap': 'Sitemap',
  },
}
