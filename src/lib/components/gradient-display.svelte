<script>
import { adjustHue, darken, lighten } from 'color2k'
import { fade } from 'svelte/transition'
import { sineInOut } from 'svelte/easing'
import { schemes, schemeColors, getSchemeColorShade } from '$lib'
import { primaryColor, schemeIndex, schemeObj } from '$lib/stores'

function styleColors(si,pColor) {
  const _sCs = schemeColors(schemes[si],pColor)
  const colors = _sCs.map((v,i)=>getSchemeColorShade(si, pColor, i, _sCs))
  if (si === 0) {
    colors[0] = darken(pColor,0.3)
    colors[1] = lighten(pColor,0.3)
  } else if (si === 1) {
    colors[0] = darken(pColor,0.05)
    colors[1] = darken(pColor,0.4)
    colors[2] = lighten(pColor,0.01)
    colors[3] = lighten(pColor,0.3)
  }
  return colors.reduce((p,c,i) => `${p}\n--c${i}: ${c};`,'')  
}
</script>

{#each schemes as schmo,i}
{#if $schemeIndex === i}
<div transition:fade class="gradient-display scheme-{i}"
style={styleColors($schemeIndex,$primaryColor)}>
</div>
{/if}
{/each}

<style global lang="postcss">
.gradient-display {
  @apply absolute bg-light-500 top-0 w-full h-full -z-1;
  min-height: 66vh;
  transition: background 400ms ease-out;
}
.scheme-0 {
  background: linear-gradient(90deg, 
    var(--c0) 0%, 
    var(--c1) 100% );
}
.scheme-1 {
  background: linear-gradient(90deg, 
    var(--c1) 0%, 
    var(--c0) 49.9%, 
    var(--c2) 50.1%, 
    var(--c3) 100% );
}
.scheme-2 {
  background: linear-gradient(90deg, 
    var(--c0) 0%, var(--c0) 20%, 
    var(--c1) 80%, var(--c1) 100% );
}
.scheme-3 {
  background: linear-gradient(90deg, 
    var(--c1) 25%,
    var(--c0) 35%, var(--c0) 65%,
    var(--c2) 75% );
}
.scheme-4,
.scheme-5 {
  background: linear-gradient(90deg, 
    var(--c1) 20%, 
    var(--c0) 39%, var(--c0) 61%,
    var(--c2) 80% );
}
.scheme-6 {
  background: linear-gradient(90deg, 
  var(--c0) 15%, 
  var(--c1) 30%, var(--c1) 42.5%, 
  var(--c2) 57.5%, var(--c2) 70%, 
  var(--c3) 85% );
}
</style>