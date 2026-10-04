import { defineNuxtConfig } from 'nuxt/config'
import { meloSite } from '../../layers/melo/site-config'
import * as site from './site'

// melopropertyclaimsadjusting.com, the national site: the layer is the site, site.ts says which business it is.
export default defineNuxtConfig({
  extends: ['../../layers/melo'],
  ...meloSite(import.meta.url, site),
})
