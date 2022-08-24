<script>
import { adjustHue, darken, lighten } from 'color2k'
import { fade } from 'svelte/transition'
import { sineInOut } from 'svelte/easing'
import { schemes, schemeColors, getSchemeColorShade } from '$lib'
import { primaryColor, schemeIndex, schemeObj } from '$lib/stores'
</script>

{#each schemes as schmo,i}
{#if $schemeIndex === i}
<div transition:fade class="gradient-display scheme-{i}">
</div>
{/if}
{/each}

<style global lang="postcss">
.gradient-display {
  @apply absolute bg-light-500 top-0 w-full h-full -z-1;
  min-height: 66vh;
  transition: background 400ms ease-out;
  background: linear-gradient(90deg, 
    var(--scheme-color-0) 0%, 
    var(--scheme-color-1) 100% );
}
.scheme-1 {
  background: linear-gradient(90deg, 
    var(--scheme-color-1) 0%, 
    var(--scheme-color-0) 49.9%, 
    var(--scheme-color-2) 50.1%, 
    var(--scheme-color-3) 100% );
}
.scheme-2 {
  background: linear-gradient(90deg, 
    var(--scheme-color-0) 0%, var(--scheme-color-0) 20%, 
    var(--scheme-color-1) 80%, var(--scheme-color-1) 100% );
}
.scheme-3 {
  background: linear-gradient(90deg, 
    var(--scheme-color-1) 25%,
    var(--scheme-color-0) 35%, var(--scheme-color-0) 65%,
    var(--scheme-color-2) 75% );
}
.scheme-4,
.scheme-5 {
  background: linear-gradient(90deg, 
    var(--scheme-color-1) 20%, 
    var(--scheme-color-0) 39%, var(--scheme-color-0) 61%,
    var(--scheme-color-2) 80% );
}
.scheme-6 {
  background: linear-gradient(90deg, 
  var(--scheme-color-0) 15%, 
  var(--scheme-color-1) 30%, var(--scheme-color-1) 42.5%, 
  var(--scheme-color-2) 57.5%, var(--scheme-color-2) 70%, 
  var(--scheme-color-3) 85% );
}
</style>