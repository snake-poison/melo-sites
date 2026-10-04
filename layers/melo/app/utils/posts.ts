import type { BlogCollectionItem } from '@nuxt/content'

/** What a post list shows. Lists select only these, so a list page's payload carries no bodies. */
export const postListFields = ['path', 'title', 'description', 'date', 'category', 'readingTime', 'image'] as const

export type PostListItem = Pick<BlogCollectionItem, typeof postListFields[number]>

/**
 * Published posts, newest first: not drafts, and not scheduled for a later day. `pnpm dev` lists
 * both too, so a post can be read in place before it goes out.
 */
export function queryPosts() {
  const query = queryCollection('blog').select(...postListFields).order('date', 'DESC')
  return import.meta.dev ? query : query.where('draft', '=', false).where('date', '<=', releaseDay())
}
