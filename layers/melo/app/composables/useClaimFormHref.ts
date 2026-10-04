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
