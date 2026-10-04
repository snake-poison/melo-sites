# layers/ui: Avow's design system

The blog and the Avow app share one look. This Nuxt layer holds the parts of
[Avow](https://github.com/snake-poison/Avow) that make it: the machine-style colour tokens,
the self-hosted fonts and the shared atoms. Nuxt extends every directory under `layers/`, so
the app gets the atoms (`UIText`, `UIHeading`, `UICard`, …), the fonts and the tokens without
importing anything.

Copied from Avow at `c4656831`.

| Here | In Avow |
| --- | --- |
| `app/assets/css/tailwind-theme.css` | same path |
| `app/assets/css/fonts.css` | same path |
| `app/assets/css/tokens.css` | the `:root` and dark blocks, `.machine-root` and `.machine-texture` of `app/assets/css/landing-machine.css` |
| `app/components/atoms/*.vue` | same paths |
| `app/constants/tones.ts`, `app/constants/icons.ts` | same paths |
| `app/types/ui/uiTypes.ts` | the one type of `app/types/ui/uiTypes.ts` the atoms use (not synced) |
| `public/fonts` | same path |
| `../../public/og-fonts` (the app's `public/`, where nuxt-og-image reads fonts while prerendering) | `public/og-fonts` |

## Rules

- **Change the design system in Avow, then bring it here.** Files in this layer stay byte for
  byte what Avow has (lint skips them for that reason). A fix made here first is a fork.
- **Colour with the theme's names.** `text-ink`, `bg-panel`, `border-rule-soft`, `text-accent`.
  Lint fails a palette class (`text-gray-500`) anywhere in `app/`, as it does in Avow. That
  rule is what lets a token change in Avow restyle the blog with no edit here.
- **A new atom goes into Avow first** when Avow could use it. One only the blog needs lives in
  `app/components/`, not here.

## Keeping in step

```sh
pnpm ds:diff          # lists every file that differs from ~/Code/Avow (AVOW_DIR to override)
pnpm ds:diff --sync   # copies Avow's versions over; review with git diff, then build
```

`tokens.css` is checked block by block, not synced: copy changed `:root` values by hand. The
share card (`components/OgImage/BlogPost.satori.vue`) repeats the light tokens, since Satori
cannot read CSS variables; update it when they change.

## Later

When a third project needs this, or the copies start to drift, move the layer into its own
repository and have both apps extend it from git (`extends: ['github:snake-poison/avow-ui']`).
The directory is already shaped as a layer, so that move is a cut and paste.
