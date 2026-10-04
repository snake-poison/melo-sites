/**
 * Who the business is, how to reach it and how the site is laid out. nuxt.config.ts and
 * content.config.ts read these at build time, so this file imports nothing from the app.
 *
 * The name, address and phone are written exactly as on the Google Business Profile and the old
 * WordPress site: local search matches them character for character across the web.
 */
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
  image: '/wp-content/uploads/2020/02/insurance-claim-adjusters-charlotte.jpg',
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
    summary: 'Burst pipes, roof and appliance leaks, flooding and the mold that follows.',
  },
  {
    label: 'Storm & Wind Damage',
    to: '/insurance-claim-type/adjuster-wind-storm-damage-charlotte/',
    icon: 'icon-[carbon--rain-heavy]',
    summary: 'Hurricanes, tornadoes, fallen trees and wind-driven rain.',
  },
  {
    label: 'Hail & Roof Damage',
    to: '/insurance-claim-type/adjuster-hail-roof-damage-charlotte/',
    icon: 'icon-[carbon--home]',
    summary: 'Hail strikes, missing shingles and roofs the insurer would rather patch.',
  },
  {
    label: 'Smoke & Fire Damage',
    to: '/insurance-claim-type/adjuster-smoke-fire-damage-charlotte/',
    icon: 'icon-[carbon--fire]',
    summary: 'Fire, smoke and soot, and the water used to put the fire out.',
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

/** The client review the claim-review band quotes, as the old site's did. */
export const featuredReview = {
  quote: 'Fast, professional, and highly informed. I was happy with all aspects of the job. Would absolutely recommend to any friends and family.',
  name: 'Trey Edwards',
} as const

/**
 * The free claim review form. The site is static, so the form posts to a form service, which
 * emails the lead and sends the visitor to /thank-you-page/. Until `action` is set, the form
 * is left out and the block offers the phone and email instead. README.md has the setup.
 */
export const claimForm: { action: string, hidden: Record<string, string>, lossTypes: readonly string[] } = {
  action: '',
  // Fields the service needs with every submission, such as its access key.
  hidden: {},
  // The checkboxes of the old form's first step.
  lossTypes: ['Fire / Smoke Damage', 'Water Damage', 'Mold Remediation', 'Storm Damage', 'Other'],
}
