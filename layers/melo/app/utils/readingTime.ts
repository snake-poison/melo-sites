/** Adult silent reading speed for non-fiction, in words per minute. */
const WORDS_PER_MINUTE = 230

const FRONTMATTER_RE = /^---\n[\s\S]*?\n---\n/
const CODE_FENCE_RE = /```[\s\S]*?```/g
const MARKUP_RE = /[#>*_`[\]()!|-]/g
const WORD_RE = /\S+/g

/** Minutes to read a Markdown document, rounded up, at least one. */
export function readingMinutes(markdown: string): number {
  const prose = markdown
    .replace(FRONTMATTER_RE, '')
    .replace(CODE_FENCE_RE, '')
    .replace(MARKUP_RE, ' ')
  const words = prose.match(WORD_RE)?.length ?? 0
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}
