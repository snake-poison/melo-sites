import { isoDate } from './format'

// The blog's day turns over in North Carolina, where its reviewer works, not in UTC.
const releaseDayFormat = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' })

/** Today in North Carolina, yyyy-mm-dd. A post dated after it is scheduled, not published. */
export function releaseDay(now = new Date()): string {
  return releaseDayFormat.format(now)
}

/**
 * Whether a post's date is still to come. A scheduled post is left out of the build like a
 * draft; the daily CI run (.github/workflows/ci.yml) publishes it on the morning of its date.
 */
export function isScheduled(date: Date | string, today = releaseDay()): boolean {
  return isoDate(date) > today
}
