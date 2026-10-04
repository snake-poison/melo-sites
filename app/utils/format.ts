const dateFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })

/** A frontmatter date as readers see it: "October 2, 2026". Frontmatter dates are UTC midnight. */
export function formatDate(date: Date | string): string {
  return dateFormat.format(new Date(date))
}

/** The yyyy-mm-dd form a <time datetime> and schema.org take. */
export function isoDate(date: Date | string): string {
  return new Date(date).toISOString().slice(0, 10)
}
