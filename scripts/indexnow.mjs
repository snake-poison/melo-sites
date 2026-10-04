// Tells IndexNow (Bing, Yandex, Seznam, Naver and the rest) which pages a deploy added or
// changed, so they recrawl them now rather than whenever they next read the sitemap. CI runs it
// after Cloudflare Pages has deployed a site's build.
//
//   node scripts/indexnow.mjs <site> <live-sitemap.xml>   # pages new to, or with a newer lastmod than, the live sitemap
//   node scripts/indexnow.mjs <site> --all                # every page in the build
//
// <site> is a directory under sites/. Its key is sites/<site>/public/<key>.txt, a file holding
// its own name, served at the site root where IndexNow checks it.
import { readdirSync, readFileSync } from 'node:fs'
import process from 'node:process'

const [site, arg] = process.argv.slice(2)
if (site == null)
  throw new Error('Usage: node scripts/indexnow.mjs <site> <live-sitemap.xml> | --all')
const built = `sites/${site}/.output/public`
const endpoint = 'https://api.indexnow.org/indexnow'

/** A sitemap's pages, as url → lastmod (or ''). Image entries sit inside <url> and are skipped. */
function pagesIn(xml) {
  const pages = new Map()
  for (const [, entry] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>([^<]+)<\/loc>/.exec(entry)?.[1]
    if (loc != null)
      pages.set(loc, /<lastmod>([^<]+)<\/lastmod>/.exec(entry)?.[1] ?? '')
  }
  return pages
}

const keys = readdirSync(built).filter(name => /^[\da-f]{32}\.txt$/.test(name))
if (keys.length !== 1)
  throw new Error(`Expected one IndexNow key file in ${built}, found ${keys.length}.`)
const key = keys[0].replace(/\.txt$/, '')

const current = pagesIn(readFileSync(`${built}/sitemap.xml`, 'utf8'))
let urls
if (arg === '--all') {
  urls = [...current.keys()]
}
else if (arg != null) {
  // An empty file means the live sitemap could not be fetched: then every page is news.
  const live = pagesIn(readFileSync(arg, 'utf8'))
  urls = [...current].filter(([url, lastmod]) => !live.has(url) || live.get(url) !== lastmod).map(([url]) => url)
}
else {
  throw new Error('Usage: node scripts/indexnow.mjs <site> <live-sitemap.xml> | --all')
}

if (urls.length === 0) {
  console.log('IndexNow: no new or changed pages.')
  process.exit(0)
}

const origin = new URL(urls[0]).origin
const response = await fetch(endpoint, {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(origin).host, key, keyLocation: `${origin}/${key}.txt`, urlList: urls }),
})
// 200 and 202 are both accepted; 202 means the key is still being checked.
if (!response.ok)
  throw new Error(`IndexNow answered ${response.status}: ${await response.text()}`)
console.log(`IndexNow: submitted ${urls.length} page(s), ${response.status}.\n${urls.join('\n')}`)
