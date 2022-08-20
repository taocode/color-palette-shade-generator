<script>
  import { readableColor } from 'color2k'
  import { primaryColor, varOptCSS } from '$lib/stores'
  import { cssSchemes } from '$lib'
  
  export const varOptsCSS = [
    'HSLA','RGBA','#HexA', 'HSL', 'RGB', '#Hex'
  ]
  export let noColor = false
  export let fixedColor = ''
  export let color = noColor ? 'white' : (fixedColor || $primaryColor)
  export let withLabel = false

  $: _varOptCSS = $varOptCSS
  $: color = noColor ? 'white' : (fixedColor || $primaryColor)
</script>
<div class="settings vars">
  {#if withLabel}
  <label for="varsOpt">Color Notation:</label>
  {/if}
  <select id="varsOpt"
  bind:value={_varOptCSS}
  on:change={()=>{varOptCSS.set(_varOptCSS)}}
  style="--color-background: {color}; --color-foreground: {readableColor(color)};"
  >
    {#each cssSchemes as {id,name}, i}
    <option value={id}>{name || id}</option>
    {/each}
  </select>
</div>

<style lang="postcss">
</style>