import { isScheduled, releaseDay } from '../../layers/melo/app/utils/schedule'

describe('releaseDay', () => {
  it('is the day in North Carolina, not in UTC', () => {
    // 11pm on October 9 in North Carolina is already October 10 in UTC.
    expect(releaseDay(new Date('2026-10-10T03:00:00Z'))).toBe('2026-10-09')
    expect(releaseDay(new Date('2026-10-10T05:00:00Z'))).toBe('2026-10-10')
  })

  it('follows the clocks in winter too', () => {
    expect(releaseDay(new Date('2026-12-10T04:30:00Z'))).toBe('2026-12-09')
    expect(releaseDay(new Date('2026-12-10T05:30:00Z'))).toBe('2026-12-10')
  })
})

describe('isScheduled', () => {
  it('holds a post back until the morning of its date', () => {
    expect(isScheduled('2026-10-10', '2026-10-09')).toBe(true)
    expect(isScheduled('2026-10-10', '2026-10-10')).toBe(false)
    expect(isScheduled('2026-10-10', '2026-10-11')).toBe(false)
  })

  it('reads frontmatter dates in either form the content layer gives them', () => {
    expect(isScheduled(new Date('2026-10-10T00:00:00.000Z'), '2026-10-09')).toBe(true)
    expect(isScheduled('2026-10-10T00:00:00.000Z', '2026-10-10')).toBe(false)
  })
})
