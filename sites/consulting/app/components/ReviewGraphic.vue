<template>
  <figure class="review-graphic">
    <div class="graphic-heading">
      <span>PROPERTY REVIEW</span><span aria-hidden="true">01 / 03</span>
    </div>
    <svg viewBox="0 0 480 310" fill="none" role="img" aria-labelledby="review-title review-description">
      <title id="review-title">From property evidence to a defined review</title>
      <desc id="review-description">An architectural drawing of a home connects to a document showing damage, scope, and valuation.</desc>
      <defs>
        <pattern id="review-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" stroke="currentColor" stroke-opacity=".08" /></pattern>
      </defs>
      <rect x="0" y="0" width="480" height="310" fill="url(#review-grid)" />
      <circle cx="180" cy="151" r="113" stroke="currentColor" stroke-opacity=".1" />
      <circle cx="180" cy="151" r="90" stroke="currentColor" stroke-opacity=".1" stroke-dasharray="3 7" />
      <g class="property-outline" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path class="graphic-draw" pathLength="1" d="M56 153L170 67L283 153M76 138V237H264V138M96 123V81H124V101M146 237V177H193V237M97 160H127V192H97ZM211 160H243V192H211ZM112 160V192M227 160V192" />
        <path d="M55 257H283M55 252V262M283 252V262" stroke-opacity=".35" />
      </g>
      <path class="graphic-connector" pathLength="1" d="M266 202H302V129H330" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 5" />
      <g class="graphic-document">
        <rect x="321" y="83" width="131" height="177" rx="8" fill="var(--pcc-paper)" stroke="var(--pcc-line)" />
        <path d="M339 108H406M339 118H383" stroke="currentColor" stroke-opacity=".35" stroke-width="3" stroke-linecap="round" />
        <g stroke="currentColor" stroke-width="1.5"><rect x="339" y="143" width="10" height="10" rx="2" /><rect x="339" y="177" width="10" height="10" rx="2" /><rect x="339" y="211" width="10" height="10" rx="2" /></g>
        <g fill="currentColor" class="graphic-labels"><text x="361" y="152">Damage</text><text x="361" y="186">Scope</text><text x="361" y="220">Valuation</text></g>
        <path d="M339 167H430M339 201H430M339 235H430" stroke="currentColor" stroke-opacity=".1" />
      </g>
      <circle cx="170" cy="67" r="5" fill="var(--pcc-accent)" />
      <circle cx="266" cy="202" r="5" fill="var(--pcc-accent)" />
    </svg>
    <figcaption><span class="graphic-index">01</span><span>Evidence informs the scope.<br><strong>The scope informs the valuation.</strong></span></figcaption>
  </figure>
</template>
