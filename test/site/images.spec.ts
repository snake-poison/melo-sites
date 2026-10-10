import { fileFor, pages, readPage } from './site'

it('ships every image variant referenced by the generated pages', () => {
  const paths = new Set<string>()
  for (const { file } of pages()) {
    const doc = readPage(file)
    for (const element of doc.querySelectorAll('img, source, link[as="image"]')) {
      const src = element.getAttribute('src') ?? element.getAttribute('href') ?? ''
      const srcset = element.getAttribute('srcset') ?? element.getAttribute('imagesrcset') ?? ''
      for (const path of [src, ...srcset.split(',').map(entry => entry.trim().split(/\s+/)[0] ?? '')]) {
        if (path.startsWith('/_ipx/'))
          paths.add(decodeURI(path))
      }
    }
  }
  expect(paths.size).toBeGreaterThan(0)
  for (const path of paths)
    expect(fileFor(path), `Missing published image: ${path}`).toBeDefined()
})
