<!--
  A sequence of steps. Each h2 inside becomes a numbered node on one rail, the way Avow's
  "how to join" steps are drawn; :post-when[…] above a heading labels when the step happens.

    ::post-steps
    :post-when[Right away]
    ## Make it safe
    …
    ::

  The numbering and rail are CSS (prose.css), so the headings stay plain h2s in the outline.
-->
<template>
  <div class="post-steps">
    <slot />
  </div>
</template>
