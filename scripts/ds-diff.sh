#!/usr/bin/env bash
# Compares layers/ui with the Avow checkout it was copied from. Prints the files that differ
# and exits 1 if any do. AVOW_DIR defaults to ~/Code/Avow.
#
#   pnpm ds:diff          # what changed
#   pnpm ds:diff --sync   # copy Avow's versions over these, then review with git diff
set -euo pipefail

avow="${AVOW_DIR:-$HOME/Code/Avow}"
layer="$(cd "$(dirname "$0")/.." && pwd)/layers/ui"
sync=false
[[ "${1:-}" == "--sync" ]] && sync=true

if [[ ! -d "$avow/app" ]]; then
  echo "No Avow checkout at $avow. Set AVOW_DIR." >&2
  exit 2
fi

# layer path -> Avow path. tokens.css is an extract of landing-machine.css, so it is checked by
# hand (layers/ui/README.md) rather than here.
pairs=(
  "app/assets/css/fonts.css:app/assets/css/fonts.css"
  "app/assets/css/tailwind-theme.css:app/assets/css/tailwind-theme.css"
  "app/constants/tones.ts:app/constants/tones.ts"
  "app/constants/icons.ts:app/constants/icons.ts"
)
for file in "$layer"/app/components/atoms/*.vue; do
  name="app/components/atoms/$(basename "$file")"
  pairs+=("$name:$name")
done
for file in "$layer"/public/fonts/*; do
  name="${file#"$layer"/}"
  pairs+=("$name:$name")
done
# The share-card fonts sit in the app's public/, the only place nuxt-og-image reads fonts
# from while prerendering.
for file in "$layer"/../../public/og-fonts/*; do
  name="public/og-fonts/$(basename "$file")"
  pairs+=("../../$name:$name")
done

status=0
for pair in "${pairs[@]}"; do
  ours="$layer/${pair%%:*}"
  theirs="$avow/${pair##*:}"
  if [[ ! -f "$theirs" ]]; then
    echo "gone in Avow   ${pair##*:}"
    status=1
  elif ! cmp -s "$ours" "$theirs"; then
    if $sync; then
      cp "$theirs" "$ours"
      echo "synced         ${pair%%:*}"
    else
      echo "differs        ${pair%%:*}"
      status=1
    fi
  fi
done

# The tokens: landing-machine.css's :root and dark blocks should still be in tokens.css.
if ! diff -q <(sed -n '/^:root {/,/^}/p;/^:root:where(.dark) {/,/^}/p' "$avow/app/assets/css/landing-machine.css") \
             <(sed -n '/^:root {/,/^}/p;/^:root:where(.dark) {/,/^}/p' "$layer/app/assets/css/tokens.css") >/dev/null; then
  echo "differs        app/assets/css/tokens.css (the :root blocks of Avow's landing-machine.css)"
  status=1
fi

[[ $status -eq 0 ]] && echo "layers/ui matches $avow ($(git -C "$avow" rev-parse --short HEAD))"
exit $status
