import type { InjectionKey } from 'vue'

/**
 * Where a page's "get a claims review" buttons go: the form further down the page when the page
 * has one, the contact page's form otherwise. pages/[...slug].vue provides it; PageCta reads it.
 */
export const claimFormHrefKey: InjectionKey<string> = Symbol('claimFormHref')
