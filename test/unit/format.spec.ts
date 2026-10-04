import { formatDate, isoDate } from '../../layers/melo/app/utils/format'

describe('formatDate', () => {
  it('reads a frontmatter date as the calendar day it names, in any time zone', () => {
    expect(formatDate('2026-10-02T00:00:00.000Z')).toBe('October 2, 2026')
    expect(formatDate(new Date(Date.UTC(2026, 0, 1)))).toBe('January 1, 2026')
  })
})

describe('isoDate', () => {
  it('is yyyy-mm-dd', () => {
    expect(isoDate('2026-10-02T00:00:00.000Z')).toBe('2026-10-02')
  })
})
