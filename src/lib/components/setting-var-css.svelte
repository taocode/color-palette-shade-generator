<script>
  import { readableColor } from 'color2k'
  import { primaryColor, varOptCSS } from '$lib/stores'

  export const varOptsCSS = [
    'HSLA','RGBA','#HexA', 'HSL', 'RGB', '#Hex'
  ]
  export let noColor = false
  export let fixedColor
  export let color = noColor ? 'white' : $primaryColor
  export let withLabel = false

  $: _varOptCSS = $varOptCSS
  $: color = noColor ? 'white' : (fixedColor || $primaryColor)
</script>
<div class="settings vars">
  {#if withLabel}
  <label for="varsOpt">CSS Notation:</label>
  {/if}
  <select id="varsOpt"
  bind:value={_varOptCSS}
  on:change={()=>{varOptCSS.set(_varOptCSS)}}
  style="--color-background: {color}; --color-foreground: {readableColor(color)};"
  >
    {#each varOptsCSS as o, i}
    <option value={o}>{o}</option>
    {/each}
  </select>
</div>

<style lang="postcss">
</style>