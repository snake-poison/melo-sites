// @vitest-environment happy-dom
import { themeScript } from '../../layers/melo/app/constants/themeScript'

function mockPrefersDark(dark: boolean) {
  vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: dark } as MediaQueryList)
}

describe('themeScript', () => {
  // Each run adds a click listener to the document; take them off again so tests stay apart.
  const listeners: Array<Parameters<typeof document.removeEventListener>> = []

  beforeEach(() => {
    const add = document.addEventListener.bind(document)
    vi.spyOn(document, 'addEventListener').mockImplementation((...args: Parameters<typeof document.addEventListener>) => {
      listeners.push(args)
      add(...args)
    })
    localStorage.clear()
    document.documentElement.className = ''
    document.body.innerHTML = '<button aria-label="Toggle dark mode"><span></span></button>'
  })

  afterEach(() => {
    for (const args of listeners.splice(0))
      document.removeEventListener(...args)
  })

  it('is light when nothing is stored, even on a dark system', () => {
    mockPrefersDark(true)
    themeScript()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('is dark when the reader chose it', () => {
    localStorage.setItem('nuxt-color-mode', 'dark')
    themeScript()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggles and remembers on a click anywhere inside the toggle', () => {
    mockPrefersDark(false)
    themeScript()
    document.querySelector('button span')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('nuxt-color-mode')).toBe('dark')
  })

  // The script reaches the head as source text: anything it closed over would be undefined there.
  it('runs from its own source', () => {
    localStorage.setItem('nuxt-color-mode', 'dark')
    // eslint-disable-next-line no-new-func, ts/no-implied-eval, ts/no-unsafe-call -- the head runs this same text
    new Function(`(${themeScript.toString()})()`)()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
