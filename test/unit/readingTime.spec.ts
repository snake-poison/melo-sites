import { readingMinutes } from '../../layers/melo/app/utils/readingTime'

describe('readingMinutes', () => {
  it('is at least one minute', () => {
    expect(readingMinutes('')).toBe(1)
    expect(readingMinutes('A short note.')).toBe(1)
  })

  it('rounds up at 230 words a minute', () => {
    expect(readingMinutes('word '.repeat(230))).toBe(1)
    expect(readingMinutes('word '.repeat(231))).toBe(2)
  })

  it('does not count frontmatter, code or markup', () => {
    const markdown = `---\ntitle: ${'long '.repeat(500)}\n---\n## Heading\n\n\`\`\`ts\n${'code '.repeat(500)}\n\`\`\`\n- **one** [two](/three)`
    expect(readingMinutes(markdown)).toBe(1)
  })
})
