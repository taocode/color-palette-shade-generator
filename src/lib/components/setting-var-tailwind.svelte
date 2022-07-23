<script>
  import { readableColor } from 'color2k'
  import { primaryColor, varOptTailwind } from '$lib/stores'

  export const varOptsTailwind = [
    ['novar', 'No CSS vars'],
    ['varonly', 'CSS vars'],
    ['both', 'CSS vars +fallback']
  ]
  export let noColor = false
  export let color = noColor ? 'white' : $primaryColor
  export let fixedColor
  export let withLabel = false
  // $: color = 
  $: _varOptTailwind = $varOptTailwind
  $: color = noColor ? 'white' : (fixedColor || $primaryColor)
</script>
<div class="settings vars">
  {#if withLabel}
  <label for="varsOpt">
    Tailwind Vars:
  </label>
  {/if}
  <select id="varsOpt"
  bind:value={_varOptTailwind}
  on:change={()=>varOptTailwind.set(_varOptTailwind)}
  style="--color-background: {color}; --color-foreground: {readableColor(color)};"
  >
    {#each varOptsTailwind as o, i}
    <option value={o[0]}>{o[1]}</option>
    {/each}
  </select>
</div>

<style lang="postcss">
</style>