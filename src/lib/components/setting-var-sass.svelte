<script>
  import { readableColor } from 'color2k'
  import { primaryColor, optSass } from '$lib/stores'

  export const opts = ['CSS','Sass/SCSS']

  export let noColor = false
  export let color = noColor ? 'white' : $primaryColor
  export let fixedColor = ''
  export let withLabel = false
  // $: color = 
  $: _optSass = $optSass
  $: color = noColor ? 'white' : (fixedColor || $primaryColor)
</script>
<div class="settings vars">
  {#if withLabel}
  <label for="varsOptSass">
    CSS or Sass Vars:
  </label>
  {/if}
  <select id="varsOptSass"
  bind:value={_optSass}
  on:change={()=>optSass.set(_optSass)}
  style="--color-background: {color}; --color-foreground: {readableColor(color)};"
  >
    {#each opts as o, i}
    <option value={i}>{o}</option>
    {/each}
  </select>
</div>

<style lang="postcss">
</style>