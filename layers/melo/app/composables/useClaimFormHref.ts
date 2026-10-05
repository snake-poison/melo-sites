import type { InjectionKey } from 'vue'

/**
 * Where a page's "get a claims review" buttons go: the form further down the page when the page
 * has one, the contact page's form otherwise. pages/[...slug].vue provides it; PageCta reads it.
 */
export const claimFormHrefKey: InjectionKey<string> = Symbol('claimFormHref')

/**
 * Where the header's and the call bar's "free claim review" go: the form in this page's hero
 * when it has one, the contact page's otherwise. They sit in the layout, outside the page's
 * provide (claimFormHrefKey), so they read the page's frontmatter themselves.
 */
export async function useClaimFormHref() {
  const path = useRoute().path.replace(/\/$/, '') || '/'
  const { data } = await useAsyncData(`page:${path}:claim-form`, async () =>
    queryCollection('pages').path(path).select('claimForm').first())
  return computed(() => data.value?.claimForm === true ? '#claim-review' : '/contact/#claim-review')
}
